import os
import io
import json
import time
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from google.genai import types
from data import (
    ONET_QUESTIONS,
    SHS_PATHWAYS,
    INSTITUTIONS,
    ONET_ATTRIBUTION,
    ONET_MODIFICATION_NOTICE,
)
from pdf_generator import create_pdf_report

load_dotenv()
app = Flask(__name__)

# Allowed origin for CORS
ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "http://localhost:8888")
CORS(app, resources={r"/api/*": {"origins": "*"}})

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

SYSTEM_CONTEXT = """
You are assisting a Philippine Senior High School (SHS) guidance tool.
As of DepEd Memorandum No. 012, s. 2026 (Strengthened SHS Curriculum),
there are only 2 tracks: Academic and Technical Professional (TechPro).
Rigid strands no longer exist. Under Academic, a student can pick elective clusters: STEM, ABM, HUMSS, GAS, Arts & Design, Sports.
TechPro has specializations: ICT, Industrial Arts, Home Economics, Agri-Fishery Arts.
A "doorway option" lets a student add a limited number of electives from the other track.
Do not recommend the old 4-strand (STEM/ABM/HUMSS/TVL) model — it no longer exists.
"""

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "primary_track": {"type": "string"},
        "primary_cluster": {"type": "string"},
        "primary_rationale": {"type": "string"},
        "doorway_option": {"type": "string"},
        "prerequisite_gaps": {"type": "array", "items": {"type": "string"}},
        "degree_suggestions": {"type": "array", "items": {"type": "string"}},
        "tesda_suggestions": {"type": "array", "items": {"type": "string"}},
        "scholarship_suggestions": {"type": "array", "items": {"type": "string"}},
        "career_suggestions": {"type": "array", "items": {"type": "string"}},
        "institution_suggestions": {"type": "array", "items": {"type": "string"}},
    },
    "required": [
        "primary_track", "primary_cluster", "primary_rationale",
        "prerequisite_gaps", "degree_suggestions", "tesda_suggestions",
        "scholarship_suggestions", "career_suggestions", "institution_suggestions"
    ],
}

def _generate_with_resilience(prompt: str):
    models_to_try = ["gemini-flash-lite-latest", "gemini-flash-latest"]
    last_error = None
    for model_name in models_to_try:
        for attempt in range(2):
            try:
                return client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.2,
                        response_mime_type="application/json",
                        response_schema=RESPONSE_SCHEMA,
                    ),
                )
            except Exception as e:
                last_error = e
                err_text = str(e)
                if any(code in err_text for code in ("503", "UNAVAILABLE", "429", "RESOURCE_EXHAUSTED")):
                    time.sleep(2 * (attempt + 1))
                    continue
                raise
    raise last_error

@app.route("/api/onet-questions", methods=["GET"])
def get_onet_questions():
    return jsonify({
        "questions": ONET_QUESTIONS,
        "attribution": ONET_ATTRIBUTION,
    })

@app.route("/api/generate", methods=["POST"])
def generate():
    if not GEMINI_API_KEY or client is None:
        return jsonify({"error": "server_misconfigured", "message": "Server is missing GEMINI_API_KEY."}), 500

    payload = request.get_json(force=True, silent=True) or {}
    math_grade = payload.get("math_grade")
    sci_grade = payload.get("sci_grade")
    eng_grade = payload.get("eng_grade")
    tle_grade = payload.get("tle_grade")
    tle_track = payload.get("tle_track")
    commerce_interest = payload.get("commerce_interest", False)
    riasec_scores = payload.get("riasec_scores", {})

    total_checked = sum(riasec_scores.values()) if riasec_scores else 0
    if total_checked == 0 or total_checked == 60:
        return jsonify({
            "error": "low_engagement",
            "message": "You selected either none or all 60 items. This profile isn't a reliable read of your real interests."
        }), 400

    prompt = f"""{SYSTEM_CONTEXT}
Analyze this Grade 10 student:
Subject grades (0-100): Math {math_grade}, Science {sci_grade}, English {eng_grade}, TLE {tle_grade}
Commerce/business interest indicated: {commerce_interest}
TLE specialization interest: {tle_track}
RIASEC interest checklist results (count out of 10 per domain): {riasec_scores}

Return your evaluation as the requested JSON structure. Keep language concise, encouraging, and clear for a 16-year-old student.
Describe fit qualitatively rather than fabricating precise statistics.

Reference data for your chosen cluster/specialization:
{json.dumps(SHS_PATHWAYS, indent=2)}

Institution reference:
{json.dumps(INSTITUTIONS, indent=2)}
"""
    try:
        response = _generate_with_resilience(prompt)
        result = response.parsed
        return jsonify({"result": result, "scores": riasec_scores})
    except Exception as e:
        return jsonify({
            "error": "generation_failed",
            "message": "Something went wrong generating the recommendation. The AI service may be temporarily busy.",
            "technical_detail": str(e)
        }), 502

@app.route("/api/pdf", methods=["POST"])
def pdf():
    payload = request.get_json(force=True, silent=True) or {}
    scores = payload.get("scores", {})
    result = payload.get("result", {})
    try:
        pdf_bytes = create_pdf_report(scores, result)
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name="CareerPath_AI_Guidance_Report.pdf"
        )
    except Exception as e:
        return jsonify({
            "error": "pdf_failed",
            "message": "PDF export hit a snag. The recommendation itself is still valid.",
            "technical_detail": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
