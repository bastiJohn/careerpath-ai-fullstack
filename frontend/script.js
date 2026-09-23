const API_BASE = "https://careerpath-ai-fullstack-production.up.railway.app";

const consentCheckbox = document.getElementById("consentCheckbox");
const consentWarning = document.getElementById("consentWarning");
const guidanceForm = document.getElementById("guidanceForm");
const onetAccordions = document.getElementById("onetAccordions");
const onetAttribution = document.getElementById("onet-attribution");
const lowEngagementWarning = document.getElementById("lowEngagementWarning");
const generateBtn = document.getElementById("generateBtn");
const resultsSection = document.getElementById("resultsSection");
const resultsContent = document.getElementById("resultsContent");
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const pdfWarning = document.getElementById("pdfWarning");
const errorBox = document.getElementById("errorBox");

let onetQuestions = {};
let lastResult = null;
let lastScores = null;

consentCheckbox.addEventListener("change", () => {
  if (consentCheckbox.checked) {
    guidanceForm.classList.remove("hidden");
    consentWarning.classList.add("hidden");
  } else {
    guidanceForm.classList.add("hidden");
    consentWarning.classList.remove("hidden");
  }
});

async function loadOnetQuestions() {
  try {
    const res = await fetch(`${API_BASE}/api/onet-questions`);
    const data = await res.json();
    onetQuestions = data.questions;
    onetAttribution.textContent = data.attribution;
    renderAccordions();
  } catch (err) {
    errorBox.textContent = "Could not load the interest checklist. Please refresh the page.";
    errorBox.classList.remove("hidden");
  }
}

function renderAccordions() {
  onetAccordions.innerHTML = "";
  for (const [domain, questions] of Object.entries(onetQuestions)) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = `${domain} Activities`;
    details.appendChild(summary);

    questions.forEach((q, idx) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.dataset.domain = domain;
      input.id = `${domain}_${idx}`;
      label.appendChild(input);
      label.append(" " + q);
      details.appendChild(label);
    });
    onetAccordions.appendChild(details);
  }
}

function getRiasecScores() {
  const scores = {};
  for (const domain of Object.keys(onetQuestions)) {
    scores[domain] = 0;
  }
  onetAccordions.querySelectorAll("input[type=checkbox]").forEach((cb) => {
    if (cb.checked) scores[cb.dataset.domain] += 1;
  });
  return scores;
}

guidanceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox?.classList.add("hidden");
  lowEngagementWarning?.classList.add("hidden");
  resultsSection?.classList.add("hidden");
  downloadPdfBtn?.classList.add("hidden");
  pdfWarning?.classList.add("hidden");

  const riasecScores = getRiasecScores();
  const totalChecked = Object.values(riasecScores).reduce((a, b) => a + b, 0);

  if (totalChecked === 0 || totalChecked === 60) {
      lowEngagementWarning?.classList.remove("hidden");
      return;
  }

  const payload = {
    math_grade: Number(document.getElementById("mathGrade").value),
    sci_grade: Number(document.getElementById("sciGrade").value),
    eng_grade: Number(document.getElementById("engGrade").value),
    tle_grade: Number(document.getElementById("tleGrade").value),
    tle_track: document.getElementById("tleTrack").value,
    commerce_interest: document.getElementById("commerceInterest").checked,
    riasec_scores: riasecScores,
  };

  generateBtn.disabled = true;
  generateBtn.textContent = "Analyzing profile and matching to DepEd tracks...";

  try {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.message || "Something went wrong generating your recommendation.";
      errorBox.classList.remove("hidden");
      return;
    }

    lastResult = data.result;
    lastScores = data.scores;
    renderResults(lastResult);
    downloadPdfBtn.classList.remove("hidden");
  } catch (err) {
    errorBox.textContent = "Could not reach the guidance server. Please try again in a moment.";
    errorBox.classList.remove("hidden");
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Career Pathway Recommendations";
  }
});

function renderResults(result) {
  const listSection = (title, items) =>
    `<h3>${title}</h3><ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

  resultsContent.innerHTML = `
    <h2>Primary Recommendation: ${result.primary_track} - ${result.primary_cluster}</h2>
    <p>${result.primary_rationale}</p>
    ${result.doorway_option ? `<p><strong>Doorway option:</strong> ${result.doorway_option}</p>` : ""}
    ${listSection("Prerequisite Gaps to Review", result.prerequisite_gaps)}
    ${listSection("Suggested CHED Degree Programs", result.degree_suggestions)}
    ${listSection("Suggested TESDA Certifications", result.tesda_suggestions)}
    ${listSection("Scholarships to Look Into", result.scholarship_suggestions)}
    ${listSection("Entry-Level Career Paths", result.career_suggestions)}
    ${listSection("Institutions to Check", result.institution_suggestions)}
  `;
  resultsSection.classList.remove("hidden");
}

document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-pdf-btn');
    
    if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', function () {
        // Target ONLY the results container, NOT the entire page/form
        const element = document.getElementById('results-section'); 

        if (!element) {
            console.error("Results section element not found!");
            return;
        }

        const opt = {
            margin:       [0.4, 0.4, 0.4, 0.4], // 0.4 inch margins top, left, bottom, right
            filename:     'CareerPath_AI_Guidance_Report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Render and save
        html2pdf().set(opt).from(element).save();
    });
}

loadOnetQuestions();
