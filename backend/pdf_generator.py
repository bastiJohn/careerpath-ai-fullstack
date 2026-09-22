# pdf_generator.py
from fpdf import FPDF
from unidecode import unidecode


def _safe(text):
    if text is None:
        return ""
    if not isinstance(text, str):
        text = str(text)
    # Sanitize special smart quotes, dashes, and accented letters
    return unidecode(text)


def create_pdf_report(scores, result):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Title
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, _safe("CareerPath AI — SHS Pathway Report"), ln=True, align="C")
    pdf.ln(5)

    # Primary Track
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, _safe(f"Recommended Track: {result.get('primary_track', 'N/A')} - {result.get('primary_cluster', 'N/A')}"), ln=True)
    
    # Rationale
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 6, _safe(result.get("primary_rationale", "")), wrapmode="CHAR")
    pdf.ln(4)

    # List Helper Function
    def add_list_section(title, items):
        if not items:
            return
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 7, _safe(title), ln=True)
        pdf.set_font("Helvetica", "", 10)
        for item in items:
            pdf.multi_cell(0, 5, _safe(f"- {item}"), wrapmode="CHAR")
        pdf.ln(3)

    add_list_section("Prerequisite Gaps", result.get("prerequisite_gaps", []))
    add_list_section("Suggested CHED Degree Programs", result.get("degree_suggestions", []))
    add_list_section("Suggested TESDA Certifications", result.get("tesda_suggestions", []))
    add_list_section("Scholarships to Look Into", result.get("scholarship_suggestions", []))
    add_list_section("Entry-Level Career Paths", result.get("career_suggestions", []))
    add_list_section("Institutions to Check", result.get("institution_suggestions", []))

    # Return raw PDF bytes
    return bytes(pdf.output())
