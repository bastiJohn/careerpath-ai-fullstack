# pdf_generator.py
from fpdf import FPDF
from unidecode import unidecode


def _safe(text: str) -> str:
    """Transliterate to plain ASCII so fpdf2's core Helvetica font never
    chokes on smart quotes, em dashes, peso signs, etc. from AI output."""
    return unidecode(text)


def create_pdf_report(scores: dict, result: dict) -> bytes:
    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "CareerPath AI - Senior High School Guidance Summary", new_x="LMARGIN", new_y="NEXT", align="C")

    pdf.set_font("Helvetica", "I", 9)
    pdf.cell(0, 5, "O*NET Interest Profiler (USDOL/ETA) - Adapted Exploratory Material", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "Your RIASEC Interest Profile Scores:", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    for domain, score in scores.items():
        pdf.cell(0, 6, _safe(f"- {domain}: {score} / 10"), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, f"Primary Recommendation: {_safe(result['primary_track'])} - {_safe(result['primary_cluster'])}", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 9)
    pdf.multi_cell(0, 5, _safe(result["primary_rationale"]), wrapmode="CHAR")
    pdf.ln(3)

    if result.get("doorway_option"):
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 6, "Doorway Option:", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9)
        pdf.multi_cell(0, 5, _safe(result["doorway_option"]), wrapmode="CHAR")
        pdf.ln(3)

    def _section(title, items):
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 6, title, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9)
        for item in items:
            pdf.multi_cell(0, 5, _safe(f"- {item}"), wrapmode="CHAR")
        pdf.ln(2)

    _section("Prerequisite Gaps to Review:", result["prerequisite_gaps"])
    _section("Suggested CHED Degree Programs:", result["degree_suggestions"])
    _section("Suggested TESDA Certifications:", result["tesda_suggestions"])
    _section("Scholarships to Look Into:", result["scholarship_suggestions"])
    _section("Entry-Level Career Paths:", result["career_suggestions"])
    _section("Institutions to Check (starter list only):", result["institution_suggestions"])

    pdf.ln(3)
    pdf.set_font("Helvetica", "I", 8)
    pdf.multi_cell(
        0, 4,
        "Notice: This document is generated as an exploratory guidance report "
        "using AI-assisted analysis. It is not an officially binding DepEd "
        "track placement order and has not been independently validated for "
        "this purpose or audience. Please review these results with your "
        "designated Guidance Counselor.",
        wrapmode="CHAR",
    )

    return bytes(pdf.output())