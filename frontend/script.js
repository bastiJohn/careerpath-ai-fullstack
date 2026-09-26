/* ==========================================================================
   SHARED CORE MODULES
   ========================================================================== */

/**
 * Typewriter wordmark header effect
 */
function initTypewriter() {
  const typewriterElement = document.getElementById("typewriterWordmark") || document.getElementById("wordmark");
  if (!typewriterElement) return;

  const wordmarkText = "Discover Your Potential Today!";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typewriterElement.textContent = wordmarkText;
    return;
  }

  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 60;
  const holdDuration = 2000;
  const pauseBeforeReType = 500;

  function typeTick() {
    typewriterElement.textContent = wordmarkText.substring(0, charIndex);
    let nextDelay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === wordmarkText.length) {
      nextDelay = holdDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      nextDelay = pauseBeforeReType;
    }

    charIndex += isDeleting ? -1 : 1;
    setTimeout(typeTick, nextDelay);
  }

  setTimeout(typeTick, 300);
}

/**
 * Scroll Intersection Observer
 */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal-on-scroll");
  if (!revealEls.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealEls.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("in-view", entry.isIntersecting);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/**
 * Global Modal Handlers (Accessible)
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }
}

// Global modal escape listener
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-backdrop.active").forEach((m) => {
      m.classList.remove("active");
      m.setAttribute("aria-hidden", "true");
    });
  }
});

/* ==========================================================================
   PAGE SPECIFIC: INDEX.HTML
   ========================================================================== */
function initIndexPage() {
  const headline = document.getElementById("headline");
  const consentCheckbox = document.getElementById("consentCheckbox");
  if (!headline && !consentCheckbox) return;

  // 1. O*NET Attribution Text
  const attributionEl = document.getElementById("onet-attribution");
  if (attributionEl) {
    attributionEl.textContent =
      "This application incorporates data and career descriptor taxonomies from the O*NET Database by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA), used under the CC BY 4.0 license. O*NET® is a trademark of USDOL/ETA.";
  }

  // 2. Headline sequence
  if (headline) {
    requestAnimationFrame(() => headline.classList.add("reveal"));
    const spans = headline.querySelectorAll("span");
    let settled = 0;
    spans.forEach((s) => {
      s.addEventListener("animationend", function onEnd(e) {
        if (e.animationName !== "slideIn") return;
        s.removeEventListener("animationend", onEnd);
        settled++;
        if (settled === spans.length) {
          headline.classList.remove("reveal");
          headline.classList.add("breathe");
        }
      });
    });
  }

  // 3. Parallax
  const shapeLayer = document.getElementById("shapeLayer");
  const shapeShadow = document.getElementById("shapeShadow");
  const heroCopy = document.getElementById("heroCopy");

  if (shapeLayer && shapeShadow && heroCopy) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const y = window.scrollY;
            if (window.innerWidth > 768 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              shapeLayer.style.transform = `translateY(${y * 0.18}px)`;
              shapeShadow.style.transform = `translate(${30 + y * 0.05}px, ${30 + y * 0.05}px)`;
              heroCopy.style.transform = `translateY(${y * -0.06}px)`;
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // 4. Form consent logic
  const proceedBtn = document.getElementById("proceedBtn");
  const consentHint = document.getElementById("consentHint");
  const consentWarning = document.getElementById("consentWarning");

  if (consentCheckbox && proceedBtn) {
    consentCheckbox.addEventListener("change", () => {
      if (consentCheckbox.checked) {
        proceedBtn.classList.add("active");
        proceedBtn.setAttribute("aria-disabled", "false");
        proceedBtn.removeAttribute("tabindex");
        if (consentHint) consentHint.style.display = "none";
        if (consentWarning) consentWarning.classList.add("hidden");
      } else {
        proceedBtn.classList.remove("active");
        proceedBtn.setAttribute("aria-disabled", "true");
        proceedBtn.setAttribute("tabindex", "-1");
        if (consentHint) consentHint.style.display = "block";
      }
    });

    const guardSubmit = (e) => {
      if (!consentCheckbox.checked) {
        e.preventDefault();
        e.stopPropagation();
        if (consentWarning) consentWarning.classList.remove("hidden");
        return false;
      }
    };

    proceedBtn.addEventListener("click", guardSubmit);
    proceedBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") guardSubmit(e);
    });
  }
}

/* ==========================================================================
   PAGE SPECIFIC: ABOUT.HTML
   ========================================================================== */
function initAboutPage() {
  const bioModal = document.getElementById("bioModal");
  if (!bioModal) return;

  window.openBio = function (name, role, fullBio) {
    document.getElementById("modalName").textContent = name;
    document.getElementById("modalRole").textContent = role;
    document.getElementById("modalBio").textContent = fullBio;
    openModal("bioModal");
  };

  window.closeBio = function () {
    closeModal("bioModal");
  };
}

/* ==========================================================================
   PAGE SPECIFIC: CAREERTRACK.HTML
   ========================================================================== */
function initCareerTrackPage() {
  const guidanceForm = document.getElementById("guidanceForm");
  if (!guidanceForm) return;

  const API_BASE = "https://careerpath-ai-fullstack-production.up.railway.app";
  const onetAccordions = document.getElementById("onetAccordions");
  const onetAttribution = document.getElementById("onet-attribution");
  const skeletonLoader = document.getElementById("skeletonLoader");
  const generationSkeleton = document.getElementById("generationSkeleton");
  const lowEngagementWarning = document.getElementById("lowEngagementWarning");
  const generateBtn = document.getElementById("generateBtn");
  const btnText = document.getElementById("btnText");
  const btnSpinner = document.getElementById("btnSpinner");
  const resultsSection = document.getElementById("resultsSection");
  const resultsContent = document.getElementById("resultsContent");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const pdfWarning = document.getElementById("pdfWarning");
  const errorBox = document.getElementById("errorBox");

  let onetQuestions = {};
  let lastResult = null;
  let lastScores = null;

  const domainIcons = {
    Realistic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    Investigative: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    Artistic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    Social: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    Enterprising: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    Conventional: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
  };

  async function loadOnetQuestions() {
    try {
      const res = await fetch(`${API_BASE}/api/onet-questions`);
      const data = await res.json();
      onetQuestions = data.questions;
      if (onetAttribution) onetAttribution.textContent = data.attribution || "";
      renderAccordions();
      if (skeletonLoader) skeletonLoader.classList.add("hidden");
    } catch {
      if (skeletonLoader) skeletonLoader.classList.add("hidden");
      if (errorBox) {
        errorBox.textContent = "Could not load the interest checklist. Please refresh the page.";
        errorBox.classList.remove("hidden");
      }
    }
  }

  function renderAccordions() {
    onetAccordions.innerHTML = "";
    for (const [domain, questions] of Object.entries(onetQuestions)) {
      const details = document.createElement("details");
      details.className = "onet-group";

      const summary = document.createElement("summary");
      summary.className = "onet-summary";
      summary.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="color: var(--blue-accent); display:flex;">${domainIcons[domain] || ""}</span>
          <span>${domain} Activities</span>
          <span class="domain-counter" id="badge-${domain}">0 / ${questions.length}</span>
        </div>
        <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;
      details.appendChild(summary);

      const body = document.createElement("div");
      body.className = "onet-group-body";

      questions.forEach((q, idx) => {
        const label = document.createElement("label");
        label.className = "onet-item";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "hidden-input";
        input.dataset.domain = domain;
        input.id = `${domain}_${idx}`;

        const box = document.createElement("span");
        box.className = "checkbox-box";
        box.innerHTML = `
          <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;

        const text = document.createElement("span");
        text.textContent = q;

        input.addEventListener("change", () => updateDomainBadge(domain));

        label.appendChild(input);
        label.appendChild(box);
        label.appendChild(text);
        body.appendChild(label);
      });

      details.appendChild(body);
      onetAccordions.appendChild(details);
    }
  }

  function updateDomainBadge(domain) {
    const inputs = document.querySelectorAll(`input[data-domain="${domain}"]`);
    let checked = 0;
    inputs.forEach((i) => {
      if (i.checked) checked++;
    });
    const badge = document.getElementById(`badge-${domain}`);
    if (badge) badge.textContent = `${checked} / ${inputs.length}`;
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
    errorBox.classList.add("hidden");
    lowEngagementWarning.classList.add("hidden");
    resultsSection.classList.add("hidden");
    downloadPdfBtn.classList.add("hidden");
    pdfWarning.classList.add("hidden");

    const riasecScores = getRiasecScores();
    const totalChecked = Object.values(riasecScores).reduce((a, b) => a + b, 0);

    if (totalChecked === 0 || totalChecked === 60) {
      lowEngagementWarning.classList.remove("hidden");
      lowEngagementWarning.scrollIntoView({ behavior: "smooth", block: "center" });
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
    btnText.textContent = "Analyzing Profile...";
    btnSpinner.classList.remove("hidden");
    generationSkeleton.classList.remove("hidden");
    generationSkeleton.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        errorBox.textContent = data.message || "Failed to generate recommendations.";
        errorBox.classList.remove("hidden");
        return;
      }

      lastResult = data.result;
      lastScores = data.scores;
      renderResults(lastResult);
      downloadPdfBtn.classList.remove("hidden");
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      errorBox.textContent = "Unable to reach the guidance server. Check connection and retry.";
      errorBox.classList.remove("hidden");
    } finally {
      generateBtn.disabled = false;
      btnText.textContent = "Generate Career Pathway Recommendations";
      btnSpinner.classList.add("hidden");
      generationSkeleton.classList.add("hidden");
    }
  });

  function renderResults(result) {
    const listBlock = (title, items, iconSvg) => `
      <div class="result-block">
        <h3>${iconSvg || ""} ${title}</h3>
        <ul>${(items || []).map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>
    `;

    resultsContent.innerHTML = `
      <div class="result-primary-card">
        <h2>Primary Match: ${result.primary_track || "General Academic"} — ${result.primary_cluster || ""}</h2>
        <p>${result.primary_rationale || "No rationale available."}</p>
        ${result.doorway_option ? `<span class="doorway-tag">Doorway Option: ${result.doorway_option}</span>` : ""}
      </div>

      <div class="result-grid">
        ${listBlock("Prerequisite Gaps to Review", result.prerequisite_gaps, `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`)}
        ${listBlock("Suggested CHED Degree Programs", result.degree_suggestions, `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`)}
        ${listBlock("Suggested TESDA Certifications", result.tesda_suggestions, `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`)}
        ${listBlock("Scholarships to Look Into", result.scholarship_suggestions, `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`)}
        ${listBlock("Entry-Level Career Paths", result.career_suggestions, `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`)}
        ${listBlock("Institutions to Check", result.institution_suggestions, `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>`)}
      </div>
    `;
    resultsSection.classList.remove("hidden");
  }

  downloadPdfBtn.addEventListener("click", async () => {
    pdfWarning.classList.add("hidden");
    try {
      const res = await fetch(`${API_BASE}/api/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: lastResult, scores: lastScores }),
      });

      if (!res.ok) throw new Error("PDF generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CareerPath_AI_Guidance_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      pdfWarning.textContent = "Guidance summary generated above, but the PDF download service encountered an error.";
      pdfWarning.classList.remove("hidden");
    }
  });

  loadOnetQuestions();
}

/* ==========================================================================
   APP INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initTypewriter();
  initScrollReveal();
  initIndexPage();
  initAboutPage();
  initCareerTrackPage();
});
