// 1. FIXED: Added the absolute API URL and missing auth headers
const API_ROOT = 'http://localhost:3000/api'; 
const DB_KEY = 'resumeai_library';
let selectedResumeId = null;

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

document.addEventListener('DOMContentLoaded', () => {
  setupThemeAndSidebar();
  loadResumeOptions();
});

// ==========================================
// THEME & UI SETUP
// ==========================================
function setupThemeAndSidebar() {
  const themeBtn = document.getElementById('toggle-theme-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      if (themeIcon) themeIcon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
}

function loadResumeOptions() {
  const container = document.getElementById('resume-select-container');
  const resumes = JSON.parse(localStorage.getItem(DB_KEY) || '[]');

  if (resumes.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400 p-4 border border-dashed rounded-lg text-center">No resumes found. Please create a resume in the Builder first.</p>`;
    return;
  }

  container.innerHTML = resumes.map((r, index) => {
    const isSelected = index === 0;
    if (isSelected) selectedResumeId = r.id;

    return `
      <div onclick="selectResume('${r.id}')" id="resume-card-${r.id}" class="resume-option-card border ${isSelected ? 'border-brand-green bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg'} rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-brand-green transition-all">
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded bg-brand-green text-white font-bold text-xs flex items-center justify-center">R</div>
          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">${r.title || 'Untitled Resume'}</h4>
            <p class="text-[10px] font-medium text-slate-500">${r.content?.profile?.headline || 'Resume File'}</p>
          </div>
        </div>
        <i class="fa-solid fa-circle-check text-brand-green text-sm ${isSelected ? '' : 'hidden'}" id="check-${r.id}"></i>
      </div>
    `;
  }).join('');
}

function selectResume(id) {
  selectedResumeId = id;
  document.querySelectorAll('.resume-option-card').forEach(card => {
    card.classList.remove('border-brand-green', 'bg-emerald-50/50', 'dark:bg-emerald-900/10');
    card.classList.add('border-slate-200', 'dark:border-dark-border', 'bg-slate-50', 'dark:bg-dark-bg');
  });
  document.querySelectorAll('[id^="check-"]').forEach(icon => icon.classList.add('hidden'));

  const selectedCard = document.getElementById(`resume-card-${id}`);
  const selectedIcon = document.getElementById(`check-${id}`);
  if (selectedCard) {
    selectedCard.classList.add('border-brand-green', 'bg-emerald-50/50', 'dark:bg-emerald-900/10');
  }
  if (selectedIcon) selectedIcon.classList.remove('hidden');
}

// ==========================================
// AI JD COMPARISON ENGINE
// ==========================================
async function runJdComparison() {
  const jdText = document.getElementById('jd-textarea').value.trim();
  const jobTitle = document.getElementById('job-title-input').value.trim() || 'Target Position';
  const companyName = document.getElementById('company-name-input').value.trim() || 'Unknown Company';
  const analyzeBtn = document.getElementById('analyze-jd-btn');

  if (!jdText) {
    alert("Please paste a job description first.");
    return;
  }

  const resumes = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  const resume = resumes.find(r => String(r.id) === String(selectedResumeId)) || resumes[0];

  if (!resume) {
    alert("Please select a valid resume.");
    return;
  }

  // 1. UI Loading State
  const originalBtnText = analyzeBtn.innerHTML;
  analyzeBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> AI is Analyzing...`;
  analyzeBtn.disabled = true;

  try {
    const resumeText = JSON.stringify(resume.content || {});

    // 2. Call your Backend AI Route
    const aiResponse = await fetch(`${API_ROOT}/ai/agents/jd_matcher`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jdText
      })
    });

    if (!aiResponse.ok) throw new Error("AI Analysis failed. Server responded with " + aiResponse.status);

    const analysis = await aiResponse.json(); 

    // 3. Render the AI's intelligent results
    renderAnalysisResults(
      analysis.score || 0, 
      analysis.matched || [], 
      analysis.missing || [], 
      jobTitle, 
      analysis.recommendations || []
    );

    // 4. Silently save the AI results to MySQL Database (jd_comparison table)
    fetch(`${API_ROOT}/compare`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        resume_id: resume.id,
        job_title: jobTitle,
        company_name: companyName,
        job_description: jdText,
        match_score: analysis.score || 0,
        missing_keywords: (analysis.missing || []).slice(0, 10),
        recommendations: (analysis.recommendations || []).join(' | ')
      })
    }).catch(err => console.log("Database history save skipped or failed (non-critical).", err));

  } catch (error) {
    console.error("JD Match Error:", error);
    alert("Failed to connect to the backend. Please ensure your Node server (app.js) is running on port 3000.");
  } finally {
    // Restore button state
    analyzeBtn.innerHTML = originalBtnText;
    analyzeBtn.disabled = false;
  }
}

// ==========================================
// RENDER RESULTS
// ==========================================
function renderAnalysisResults(score, matched, missing, jobTitle, recommendations) {
  const resultsSec = document.getElementById('results-section');
  resultsSec.classList.remove('hidden');

  // Update Score UI
  document.getElementById('match-score-num').innerText = `${score}%`;
  document.getElementById('score-circle').setAttribute('stroke-dasharray', `${score}, 100`);

  // Update Keyword Counts
  document.getElementById('matched-count').innerText = matched.length;
  document.getElementById('missing-count').innerText = missing.length;

  // Render Matched Keywords
  document.getElementById('matched-keywords-container').innerHTML = matched.slice(0, 20).map(k => `
    <span class="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded border border-emerald-100 dark:border-emerald-800">${k}</span>
  `).join('');

  // Render Missing Keywords
  document.getElementById('missing-keywords-container').innerHTML = missing.slice(0, 20).map(k => `
    <span class="px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-500 text-[10px] font-bold rounded border border-rose-100 dark:border-rose-800">${k}</span>
  `).join('');

  // Render AI Recommendations
  const recsContainer = document.getElementById('recommendations-container');
  if (recommendations && recommendations.length > 0) {
    recsContainer.innerHTML = recommendations.map(rec => `
      <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-dark-border">
        <p>💡 ${rec}</p>
      </div>
    `).join('');
  } else {
    recsContainer.innerHTML = `<div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-dark-border"><p>💡 Add top missing keywords like <strong class="text-rose-500">${missing.slice(0, 3).join(', ')}</strong> directly into your Work Experience.</p></div>`;
  }

  // Smooth scroll down to results
  resultsSec.scrollIntoView({ behavior: 'smooth' });
}