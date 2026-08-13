const API_ROOT = '/api'; 
const token = localStorage.getItem('token');
const DB_KEY = 'resumeai_library'; 

let activeResumeId = null;
let state = {
  template: 'classic',
  versions: [],
  content: { profile: {}, summary: '', experience: [], education: [], projects: [], skills: [] }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const clone = (value) => (globalThis.structuredClone ? globalThis.structuredClone(value) : JSON.parse(JSON.stringify(value)));
const makeId = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

// ==========================================
// THEME & SIDEBAR MANAGEMENT (Synced with Dashboard)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('toggle-theme-btn');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check saved preference
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
        if(themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            if (document.documentElement.classList.contains('dark')) {
                if(themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                if(themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    const sidebar = document.getElementById('app-sidebar');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const mobileOverlay = document.getElementById('mobile-sidebar-overlay');

    if (toggleSidebarBtn && sidebar && mobileOverlay) {
        toggleSidebarBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('hidden');
                sidebar.classList.toggle('mobile-open');
                if (sidebar.classList.contains('mobile-open')) {
                    mobileOverlay.classList.remove('hidden');
                    setTimeout(() => mobileOverlay.classList.remove('opacity-0'), 10);
                } else {
                    closeMobileSidebar();
                }
            }
        });
        mobileOverlay.addEventListener('click', closeMobileSidebar);
    }

    function closeMobileSidebar() {
        sidebar.classList.remove('mobile-open');
        sidebar.classList.add('hidden');
        mobileOverlay.classList.add('opacity-0');
        setTimeout(() => mobileOverlay.classList.add('hidden'), 300);
    }
});

// ==========================================
// ROBUST DATABASE ENGINE
// ==========================================
function getDatabase() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); } 
  catch(e) { return []; }
}

function saveToDatabase(resumeObj) {
  const db = getDatabase();
  const existingIndex = db.findIndex(r => String(r.id) === String(resumeObj.id));
  if (existingIndex > -1) db[existingIndex] = resumeObj;
  else db.push(resumeObj);
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  renderLibraryGrid();
}

function loadFromDatabase(id) {
  return getDatabase().find(r => String(r.id) === String(id));
}

function deleteFromDatabase(id) {
  let db = getDatabase();
  db = db.filter(r => String(r.id) !== String(id));
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  renderLibraryGrid();
}

// ==========================================
// UI LOGIC & TRANSITIONS
// ==========================================
function renderLibraryGrid() {
  const db = getDatabase();
  const grid = $('#saved-resumes-grid');
  const countEl = $('#resume-count');
  
  if (countEl) countEl.innerText = db.length;
  if (!grid) return;

  grid.innerHTML = db.length > 0 ? db.map(resume => `
    <div class="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-brand-green dark:hover:border-brand-green transition-all group flex flex-col justify-between h-56 cursor-pointer relative" onclick="openEditor('${resume.id}')">
      <div class="absolute inset-0 bg-slate-900/5 dark:bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[1px]">
        <button class="bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-md shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-1.5"><i class="fa-solid fa-pen-to-square"></i> Open Editor</button>
      </div>
      <div>
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-black text-slate-900 dark:text-white text-base truncate">${resume.title || 'Untitled Draft'}</h3>
          <span class="text-[9px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold px-1.5 py-0.5 rounded capitalize">${resume.template || 'classic'}</span>
        </div>
        <p class="text-xs font-bold text-brand-green mb-2 truncate">${resume.content?.profile?.headline || 'Professional'}</p>
        <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed">${resume.content?.summary || 'No summary written yet.'}</p>
      </div>
    </div>
  `).reverse().join('') : `<div class="col-span-full h-56 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500"><i class="fa-regular fa-folder-open text-3xl mb-3"></i><p class="text-sm font-bold">Library is empty</p><p class="text-xs mt-1">Click Create New to start building</p></div>`;
}

function openEditor(id = null) {
  if (id) {
    const data = loadFromDatabase(id);
    if(data) {
      activeResumeId = data.id;
      state = clone(data);
      if(!state.content) state.content = {};
      if(!state.content.profile) state.content.profile = {};
      if(!state.content.experience) state.content.experience = [];
      if(!state.content.education) state.content.education = [];
      if(!state.content.projects) state.content.projects = [];
      if(!state.content.skills) state.content.skills = [];
      hydrateForm();
    }
  }

  $('#library-view').classList.add('hidden');
  $('#editor-view').classList.remove('hidden');
  
  if($('#toggle-sidebar-btn')) $('#toggle-sidebar-btn').classList.add('hidden');
  $('#nav-back-btn').classList.remove('hidden');
  
  $('#editor-actions').classList.remove('hidden');
  $('#editor-actions').classList.add('flex');
  
  if(window.innerWidth > 768) {
    $('#save-state-container').classList.remove('hidden');
    $('#save-state-container').classList.add('flex');
  }
}

function closeEditor() {
  $('#editor-view').classList.add('hidden');
  $('#editor-actions').classList.add('hidden');
  $('#editor-actions').classList.remove('flex');
  $('#save-state-container').classList.add('hidden');
  $('#save-state-container').classList.remove('flex');
  $('#nav-back-btn').classList.add('hidden');
  if($('#toggle-sidebar-btn')) $('#toggle-sidebar-btn').classList.remove('hidden');
  $('#library-view').classList.remove('hidden');
  activeResumeId = null;
  renderLibraryGrid();
}

function toggleCreationModal() {
  $('#creation-modal').classList.toggle('hidden');
}

function generateAiResumeFromModal() {
  const title = $('#ai-job-title').value || 'Software Engineer';
  activeResumeId = makeId();
  state = {
    id: activeResumeId,
    title: `${title} Resume`,
    template: 'classic',
    versions: [],
    content: {
      profile: { headline: title },
      summary: `Results-driven ${title} with a proven track record of designing scalable solutions and exceeding performance targets.`,
      experience: [], education: [], projects: [], skills: []
    }
  };
  saveToDatabase(state);
  toggleCreationModal();
  openEditor(activeResumeId);
}

function handleDocumentUpload(event) {
  if(event.target.files.length > 0) {
    const file = event.target.files[0];
    activeResumeId = makeId();
    state = {
      id: activeResumeId,
      title: file.name.replace(/\.[^/.]+$/, ""),
      template: 'minimal',
      versions: [],
      content: { profile: { headline: 'Imported Document' }, summary: '[System: Parsed content from file]', experience: [], education: [], projects: [], skills: [] }
    };
    saveToDatabase(state);
    toggleCreationModal();
    openEditor(activeResumeId);
  }
}

// ==========================================
// FORM DATA COLLECTION
// ==========================================
function collectContent() {
  state.content.profile = {
    name: $('#profile-name')?.value || '',
    headline: $('#profile-headline')?.value || '',
    email: $('#profile-email')?.value || '',
    phone: $('#profile-phone')?.value || '',
    location: $('#profile-location')?.value || ''
  };
  state.title = $('#resume-title')?.value || 'Untitled Draft';
  state.content.summary = $('#summary-editor')?.innerText.trim() || '';
  const skillsVal = $('#skills-input')?.value || '';
  state.content.skills = skillsVal.split(',').map(item => item.trim()).filter(Boolean);
  return state.content;
}

function setSaveState(text) {
  if ($('#save-state')) $('#save-state').textContent = text;
}

function itemField(value, key, placeholder) {
  return `<input data-key="${key}" value="${value || ''}" placeholder="${placeholder}" class="w-full border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-brand-green focus:bg-white dark:focus:bg-dark-card transition-all shadow-sm">`;
}

function renderRepeatList(type) {
  const container = $(`#${type}-list`);
  if (!container) return;
  const items = state.content[type] || [];
  
  container.innerHTML = items.map((item, index) => {
    let innerHtml = '';
    if (type === 'experience') {
      innerHtml = `<div class="grid grid-cols-1 md:grid-cols-2 gap-3">${itemField(item.role, 'role', 'Role')}${itemField(item.company, 'company', 'Company')}<div class="md:col-span-2">${itemField(item.period, 'period', 'Period (e.g. 2021-Present)')}</div></div><textarea data-key="bullets" rows="3" class="w-full border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg focus:bg-white dark:focus:bg-dark-card rounded-lg p-3 text-xs font-medium mt-3 outline-none focus:border-brand-green shadow-sm leading-relaxed">${(item.bullets || []).join('\n')}</textarea>`;
    } else if (type === 'education') {
      innerHtml = `<div class="grid grid-cols-1 md:grid-cols-2 gap-3">${itemField(item.degree, 'degree', 'Degree')}${itemField(item.school, 'school', 'School')}<div class="md:col-span-2">${itemField(item.period, 'period', 'Period')}</div></div>`;
    } else {
      innerHtml = `${itemField(item.name, 'name', 'Project Name')}<textarea data-key="description" rows="2" class="w-full border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg focus:bg-white dark:focus:bg-dark-card rounded-lg p-3 text-xs font-medium mt-3 outline-none focus:border-brand-green shadow-sm leading-relaxed">${item.description || ''}</textarea>`;
    }
    return `<article class="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-4 relative repeat-item shadow-sm" data-type="${type}" data-index="${index}">${innerHtml}<button type="button" class="absolute top-3 right-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 w-7 h-7 rounded-md flex items-center justify-center transition-colors" data-remove="${type}:${index}"><i class="fa-regular fa-trash-can text-xs"></i></button></article>`;
  }).join('');
}

function syncRepeatData(event) {
  const item = event.target.closest('.repeat-item');
  if (!item) return;
  const type = item.dataset.type;
  const index = Number(item.dataset.index);
  const key = event.target.dataset.key;
  if (!key) return;

  if (key === 'bullets') state.content[type][index][key] = event.target.value.split('\n').map(line => line.trim()).filter(Boolean);
  else state.content[type][index][key] = event.target.value;
}

// ==========================================
// TEMPLATE & RENDER ENGINE
// ==========================================
function renderPreview() {
  collectContent();
  const preview = $('#resume-preview');
  if (!preview) return;
  const c = state.content || {};
  const p = c.profile || {};
  const t = state.template || 'classic';

  let fontClass = 'font-sans';
  let headerColor = '#0f172a';
  let accentColor = '#0f172a';
  let headerAlignment = 'text-left';
  let sectionBorder = 'border-b-2 border-slate-300';
  
  if(t === 'classic') {
    fontClass = 'font-serif';
    headerAlignment = 'text-center';
  } else if(t === 'modern') {
    accentColor = '#10b981'; // brand-green
    sectionBorder = 'border-b-2 border-emerald-500';
  } else if(t === 'minimal') {
    headerColor = '#334155'; 
    accentColor = '#64748b';
    sectionBorder = 'border-none'; 
  } else if(t === 'professional') {
    headerColor = '#1e3a8a'; // brand-navy
    accentColor = '#1e3a8a';
    sectionBorder = 'border-b-2 border-[#1e3a8a]';
  }

  preview.className = `bg-white text-black shadow-lg w-full max-w-[21cm] min-h-[29.7cm] p-12 transition-all duration-300 ${fontClass}`;
  
  preview.innerHTML = `
    <header class="pb-5 mb-6 ${sectionBorder} ${headerAlignment}">
      <h1 class="text-[32px] leading-none font-black tracking-tight" style="color: ${headerColor};">${p.name || 'Your Name'}</h1>
      <p class="font-bold text-sm mt-1.5 uppercase tracking-wider" style="color: ${accentColor};">${p.headline || ''}</p>
      <div class="text-[11px] mt-2 font-medium flex flex-wrap gap-2 ${headerAlignment === 'text-center' ? 'justify-center' : ''}" style="color: #475569;">
        ${p.email ? `<span>${p.email}</span>` : ''}
        ${p.phone ? `<span class="text-slate-300">|</span><span>${p.phone}</span>` : ''}
        ${p.location ? `<span class="text-slate-300">|</span><span>${p.location}</span>` : ''}
      </div>
    </header>
    
    ${c.summary ? `<section class="mb-7"><h2 class="text-xs font-black uppercase tracking-widest pb-1 mb-2 ${sectionBorder}" style="color: ${headerColor};">Professional Summary</h2><p class="text-xs leading-relaxed text-slate-700">${c.summary}</p></section>` : ''}
    
    ${c.experience && c.experience.length ? `<section class="mb-7"><h2 class="text-xs font-black uppercase tracking-widest pb-1 mb-3 ${sectionBorder}" style="color: ${headerColor};">Experience</h2>${c.experience.map(item => `
      <div class="mb-4">
        <div class="flex justify-between items-baseline mb-0.5"><h3 class="text-sm font-bold" style="color: ${headerColor};">${item.role || ''}</h3><span class="text-[11px] font-bold text-slate-500">${item.period || ''}</span></div>
        <div class="text-[11px] font-bold mb-1.5" style="color: ${accentColor};">${item.company || ''}</div>
        <ul class="list-disc list-outside ml-4 text-xs space-y-1 leading-relaxed text-slate-600">${(item.bullets || []).map(bullet => `<li>${bullet}</li>`).join('')}</ul>
      </div>`).join('')}</section>` : ''}
    
    ${c.education && c.education.length ? `<section class="mb-7"><h2 class="text-xs font-black uppercase tracking-widest pb-1 mb-3 ${sectionBorder}" style="color: ${headerColor};">Education</h2>${c.education.map(item => `
      <div class="mb-3 flex justify-between items-baseline"><div><h3 class="text-sm font-bold" style="color: ${headerColor};">${item.degree || ''}</h3><div class="text-[11px] font-semibold text-slate-600">${item.school || ''}</div></div><span class="text-[11px] font-bold text-slate-500">${item.period || ''}</span></div>`).join('')}</section>` : ''}
    
    ${c.projects && c.projects.length ? `<section class="mb-7"><h2 class="text-xs font-black uppercase tracking-widest pb-1 mb-3 ${sectionBorder}" style="color: ${headerColor};">Projects</h2>${c.projects.map(item => `
      <div class="mb-3"><h3 class="text-sm font-bold mb-0.5" style="color: ${headerColor};">${item.name || ''}</h3><p class="text-xs leading-relaxed text-slate-600">${item.description || ''}</p></div>`).join('')}</section>` : ''}
    
    ${c.skills && c.skills.length ? `<section class="mb-5"><h2 class="text-xs font-black uppercase tracking-widest pb-1 mb-2 ${sectionBorder}" style="color: ${headerColor};">Skills</h2><p class="text-xs leading-relaxed text-slate-600 font-medium">${c.skills.join('<span class="mx-2 text-slate-300">•</span>')}</p></section>` : ''}
  `;
}

// ==========================================
// VERSIONS & SAVING
// ==========================================
function renderVersions() {
  const list = $('#version-list');
  if (!list) return;
  const versions = (state.versions || []).slice().reverse(); 

  list.innerHTML = versions.length ? versions.map(version => {
    const timeStr = new Date(version.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const dateStr = new Date(version.timestamp).toLocaleDateString();
    
    return `
      <button class="w-full text-left p-2.5 rounded-md hover:bg-white dark:hover:bg-slate-800 border border-transparent dark:border-transparent hover:border-slate-200 dark:hover:border-dark-border flex justify-between items-center transition-all shadow-sm" data-version="${version.id}">
        <span class="font-bold text-[11px] text-slate-700 dark:text-slate-300 truncate">${version.label}</span>
        <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-dark-bg px-1.5 py-0.5 rounded border border-slate-100 dark:border-dark-border">${dateStr} ${timeStr}</span>
      </button>
    `;
  }).join('') : '<p class="text-[11px] font-medium text-slate-400 text-center py-2">No snapshots yet.</p>';
}

function addVersion(label = 'Manual Snapshot') {
  collectContent();
  if(!state.versions) state.versions = [];
  state.versions.push({ id: makeId(), label: label, content: clone(state.content), template: state.template, timestamp: Date.now() });
  saveToDatabase(state);
  renderVersions();
  setSaveState('Snapshot Created');
}

async function saveDraft() {
  if (!activeResumeId) return;
  collectContent();
  setSaveState('Saving...');
  saveToDatabase(state);
  setSaveState('Saved Locally');

  try {
    if (!token) throw new Error('No token.');
    const response = await fetch(`${API_ROOT}/resumes/${activeResumeId}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(state) });
    if (response.ok) setSaveState('Saved to Cloud');
  } catch (error) {}
}

function deleteCurrentResume() {
  if(confirm("Are you sure you want to delete this file? This cannot be undone.")) {
    deleteFromDatabase(activeResumeId);
    closeEditor();
  }
}

// ==========================================
// HYDRATION & LISTENERS
// ==========================================
function hydrateForm() {
  if ($('#template-select')) $('#template-select').value = state.template || 'classic';
  if ($('#resume-title')) $('#resume-title').value = state.title || '';
  if ($('#profile-name')) $('#profile-name').value = state.content?.profile?.name || '';
  if ($('#profile-headline')) $('#profile-headline').value = state.content?.profile?.headline || '';
  if ($('#profile-email')) $('#profile-email').value = state.content?.profile?.email || '';
  if ($('#profile-phone')) $('#profile-phone').value = state.content?.profile?.phone || '';
  if ($('#profile-location')) $('#profile-location').value = state.content?.profile?.location || '';
  if ($('#summary-editor')) $('#summary-editor').innerText = state.content?.summary || '';
  if ($('#skills-input')) $('#skills-input').value = (state.content?.skills || []).join(', ');
  
  renderRepeatList('experience');
  renderRepeatList('education');
  renderRepeatList('projects');
  renderPreview();
  renderVersions();
}

$$('.section-tab').forEach(button => {
  button.addEventListener('click', () => {
    $$('.section-tab').forEach(tab => {
      tab.classList.remove('active', 'border-brand-green', 'text-brand-green', 'bg-white', 'dark:bg-dark-card');
      tab.classList.add('border-transparent', 'text-slate-500');
    });
    $$('.section-pane').forEach(pane => pane.classList.add('hidden'));
    
    button.classList.remove('border-transparent', 'text-slate-500');
    button.classList.add('active', 'border-brand-green', 'text-brand-green', 'bg-white', 'dark:bg-dark-card');
    
    const pane = $(`[data-pane="${button.dataset.section}"]`);
    if(pane) pane.classList.remove('hidden');
  });
});

$$('[data-command]').forEach(button => {
  button.addEventListener('click', () => document.execCommand(button.dataset.command, false, null));
});

$$('[data-add]').forEach(button => {
  button.addEventListener('click', () => {
    const type = button.dataset.add;
    if (!state.content[type]) state.content[type] = [];
    if (type === 'experience') state.content.experience.push({ role: '', company: '', period: '', bullets: [] });
    if (type === 'education') state.content.education.push({ degree: '', school: '', period: '' });
    if (type === 'projects') state.content.projects.push({ name: '', description: '' });
    renderRepeatList(type);
    renderPreview();
  });
});

document.addEventListener('input', (event) => {
  syncRepeatData(event);
  renderPreview();
});

document.addEventListener('click', (event) => {
  const remove = event.target.closest('[data-remove]');
  if (!remove) return;
  const [type, index] = remove.dataset.remove.split(':');
  state.content[type].splice(Number(index), 1);
  renderRepeatList(type);
  renderPreview();
});

if ($('#template-select')) {
  $('#template-select').addEventListener('change', (event) => {
    state.template = event.target.value;
    renderPreview();
  });
}

if ($('#save-btn')) $('#save-btn').addEventListener('click', saveDraft);
if ($('#new-version-btn')) $('#new-version-btn').addEventListener('click', () => addVersion('Manual Snapshot'));
if ($('#export-btn')) $('#export-btn').addEventListener('click', () => window.print());

const versionList = $('#version-list');
if (versionList) {
  versionList.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-version]');
    if (!btn) return;
    if (confirm("Restore this version? Unsaved edits will be lost.")) {
      const version = state.versions.find(item => item.id === btn.dataset.version);
      if (!version) return;
      state.content = clone(version.content);
      state.template = version.template;
      hydrateForm(); 
      if($('#version-label')) $('#version-label').textContent = `Restored: ${version.label}`;
    }
  });
}

// AI LOGIC
async function runAi() {
  const output = $('#ai-output');
  const prompt = $('#ai-prompt').value.trim();
  if (!prompt) return;
  output.classList.remove('hidden');
  output.textContent = 'Analyzing and generating text...';

  try {
    if (!token) throw new Error('No auth token.');
    const response = await fetch(`${API_ROOT}/ai/agents/resume_improvement`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ prompt, resume_id: activeResumeId, resume_text: JSON.stringify(collectContent()) })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'AI failed.');
    output.textContent = data.content;
  } catch (error) {
    output.textContent = `[Simulated AI Response]: Enhanced Text generated.\n\nDriven professional with a proven track record of reducing latency and automating workflows.`;
  }
}

if ($('#ai-write-btn')) $('#ai-write-btn').addEventListener('click', () => $('#ai-dialog').showModal());
if ($('#run-ai-btn')) {
  $('#run-ai-btn').addEventListener('click', (event) => {
    event.preventDefault();
    runAi();
  });
}

// BOOT
renderLibraryGrid();
setInterval(() => {
  if(activeResumeId) {
    collectContent();
    saveToDatabase(state);
    setSaveState('Autosaved Locally');
  }
}, 15000);