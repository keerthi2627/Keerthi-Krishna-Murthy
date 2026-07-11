/* =====================================================
   EEE BIODATA WEBSITE — vanilla JS, no dependencies
   All data persists in localStorage under "eeeBiodataDB"
===================================================== */

const DB_KEY = "eeeBiodataDB";

const defaultData = {
  biodata: {
    fullName: "Keerthi K", age: "18", dob: "26 / 05 / 2008",
    email: "Sec25ee079@sairamtap.edu.in",
    deptShort: "Electrical and Electronics Engineering",
    deptFull: "Electrical and Electronics Engineering (EEE)",
    college: "Sri Sairam Engineering College", year: "First Year",
    nationality: "Indian", languages: "Tamil, English"
  },
  education: [
    { id: "sslc", label: "SSLC", marks: "451 / 500", school: "", year: "", file: null },
    { id: "hsc", label: "HSC", marks: "506 / 600", school: "", year: "", file: null }
  ],
  skills: [
    { name: "Electrical Engineering", pct: 80 }, { name: "Circuit Analysis", pct: 75 },
    { name: "Power Electronics", pct: 65 }, { name: "Embedded Systems", pct: 60 },
    { name: "Arduino", pct: 70 }, { name: "PCB Design", pct: 55 },
    { name: "Java", pct: 50 }, { name: "Python", pct: 60 },
    { name: "HTML", pct: 85 }, { name: "CSS", pct: 80 }, { name: "JavaScript", pct: 70 },
    { name: "Cyber Security", pct: 45 }, { name: "Communication", pct: 75 },
    { name: "Problem Solving", pct: 80 }, { name: "Leadership", pct: 65 }
  ],
  certifications: [],
  projects: [],
  achievements: [],
  internship: { company: "", duration: "", description: "", file: null },
  contact: {
    email: "Sec25ee079@sairamtap.edu.in", phone: "", linkedin: "",
    github: "", instagram: "", location: ""
  }
};

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return structuredClone(defaultData);
    const parsed = JSON.parse(raw);
    // merge to survive schema additions
    return { ...structuredClone(defaultData), ...parsed };
  } catch (e) {
    console.error("DB load failed, resetting.", e);
    return structuredClone(defaultData);
  }
}

function saveDB() {
  localStorage.setItem(DB_KEY, JSON.stringify(state));
}

let state = loadDB();

/* ===================== LOADER ===================== */
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").classList.add("hidden"), 600);
});

/* ===================== NAVBAR ===================== */
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  document.getElementById("scroll-progress").style.width = scrolled + "%";
});

/* ===================== CURSOR GLOW ===================== */
const glow = document.getElementById("cursor-glow");
window.addEventListener("mousemove", e => {
  glow.style.opacity = 1;
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});
window.addEventListener("mouseleave", () => glow.style.opacity = 0);

/* ===================== SCROLL REVEAL ===================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add("in-view"); });
}, { threshold: 0.2 });
document.querySelectorAll(".section-title").forEach(el => revealObserver.observe(el));

/* ===================== TYPING ANIMATION ===================== */
const typedPhrases = [
  "Electrical Engineer", "Electronics Enthusiast", "Embedded Systems Learner",
  "Arduino Developer", "Future Innovator", "AI + Electronics Explorer"
];
const typedEl = document.getElementById("typed-text");
let tIdx = 0, cIdx = 0, deleting = false;
function typeLoop() {
  const word = typedPhrases[tIdx];
  if (!deleting) {
    cIdx++;
    typedEl.textContent = word.slice(0, cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    cIdx--;
    typedEl.textContent = word.slice(0, cIdx);
    if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % typedPhrases.length; }
  }
  setTimeout(typeLoop, deleting ? 40 : 90);
}
typeLoop();

/* ===================== CIRCUIT-BOARD BACKGROUND CANVAS ===================== */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let W, H;
function resizeCanvas() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Generate circuit nodes (grid-snapped) and traces
const nodes = [];
const GRID = 70;
for (let x = 0; x < window.innerWidth + GRID; x += GRID) {
  for (let y = 0; y < window.innerHeight + GRID; y += GRID) {
    if (Math.random() < 0.14) nodes.push({ x, y });
  }
}
const traces = [];
nodes.forEach((n, i) => {
  if (Math.random() < 0.5 && i < nodes.length - 1) {
    const next = nodes[i + 1];
    if (next && Math.abs(next.x - n.x) + Math.abs(next.y - n.y) < GRID * 3) {
      traces.push({ from: n, to: next, pulse: Math.random() });
    }
  }
});

// floating particles (green dust)
const particles = Array.from({ length: 60 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.8 + 0.4,
  vy: Math.random() * 0.3 + 0.05,
  a: Math.random() * 0.5 + 0.1
}));

function drawBackground() {
  ctx.clearRect(0, 0, W, H);

  // traces
  ctx.strokeStyle = "rgba(0,255,153,0.10)";
  ctx.lineWidth = 1;
  traces.forEach(t => {
    ctx.beginPath();
    ctx.moveTo(t.from.x, t.from.y);
    ctx.lineTo(t.to.x, t.from.y);
    ctx.lineTo(t.to.x, t.to.y);
    ctx.stroke();
  });

  // pulses along traces
  traces.forEach(t => {
    t.pulse += 0.004;
    if (t.pulse > 1) t.pulse = 0;
    const midX = t.from.x + (t.to.x - t.from.x) * t.pulse;
    const midY = t.from.y + (t.to.y - t.from.y) * t.pulse;
    ctx.beginPath();
    ctx.arc(midX, midY, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,153,0.6)";
    ctx.fill();
  });

  // nodes
  ctx.fillStyle = "rgba(0,255,153,0.18)";
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 2.4, 0, Math.PI * 2);
    ctx.fill();
  });

  // floating particles
  particles.forEach(p => {
    p.y -= p.vy;
    if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,153,${p.a})`;
    ctx.fill();
  });

  requestAnimationFrame(drawBackground);
}
drawBackground();

/* ===================== GENERIC FORM EDIT HELPERS ===================== */
function fillView(container, data) {
  container.querySelectorAll("[data-key]").forEach(el => {
    const key = el.dataset.key;
    el.textContent = data[key] || "—";
  });
}
function fillForm(form, data) {
  [...form.elements].forEach(el => {
    if (el.name && data[el.name] !== undefined) el.value = data[el.name];
  });
}
function readForm(form) {
  const out = {};
  [...form.elements].forEach(el => { if (el.name) out[el.name] = el.value.trim(); });
  return out;
}

function wireSimpleSection(sectionKey, viewSel, formSel) {
  const view = document.querySelector(viewSel);
  const form = document.querySelector(formSel);
  const editBtn = document.querySelector(`[data-form="${form.id}"]`);

  fillView(view, state[sectionKey]);

  editBtn.addEventListener("click", () => {
    fillForm(form, state[sectionKey]);
    view.classList.add("hidden");
    form.classList.remove("hidden");
  });
  form.querySelector(".cancel-btn").addEventListener("click", () => {
    form.classList.add("hidden");
    view.classList.remove("hidden");
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    state[sectionKey] = { ...state[sectionKey], ...readForm(form) };
    saveDB();
    fillView(view, state[sectionKey]);
    form.classList.add("hidden");
    view.classList.remove("hidden");
  });
}

wireSimpleSection("biodata", "#biodata-view", "#biodata-form");
wireSimpleSection("internship", "#internship-view", "#internship-form");
wireSimpleSection("contact", "#contact-view", "#contact-form");

// Hero name mirrors biodata.fullName live
document.querySelector('.hero-name[data-key="fullName"]').textContent = state.biodata.fullName;
document.querySelector("#biodata-form").addEventListener("submit", () => {
  document.querySelector('.hero-name[data-key="fullName"]').textContent = state.biodata.fullName;
});

/* ===================== FILE UPLOAD (base64) ===================== */
function wireFileUpload(block, getFile, setFile) {
  const input = block.querySelector(".file-input");
  const preview = block.querySelector(".file-preview");

  function render() {
    const file = getFile();
    preview.innerHTML = "";
    if (!file) return;
    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = file.data;
      preview.appendChild(img);
    }
    const dl = document.createElement("a");
    dl.href = file.data; dl.download = file.name; dl.textContent = "Download";
    preview.appendChild(dl);
    const rm = document.createElement("button");
    rm.className = "file-remove"; rm.textContent = "Remove"; rm.type = "button";
    rm.addEventListener("click", () => { setFile(null); saveDB(); render(); });
    preview.appendChild(rm);
  }

  input.addEventListener("change", () => {
    const f = input.files[0];
    if (!f) return;
    if (f.size > 4 * 1024 * 1024) { alert("Please choose a file under 4MB (browser storage limit)."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setFile({ name: f.name, type: f.type, data: reader.result });
      saveDB();
      render();
    };
    reader.readAsDataURL(f);
  });

  render();
}

wireFileUpload(
  document.querySelector('[data-upload="internshipCert"]'),
  () => state.internship.file,
  (f) => state.internship.file = f
);

/* ===================== EDUCATION TIMELINE ===================== */
const eduTimeline = document.getElementById("education-timeline");
const eduTpl = document.getElementById("tpl-education");

function renderEducation() {
  eduTimeline.innerHTML = "";
  state.education.forEach((entry, idx) => {
    const node = eduTpl.content.cloneNode(true);
    const item = node.querySelector(".timeline-item");
    node.querySelector(".edu-label").textContent = entry.label;
    const view = node.querySelector(".edu-view");
    const form = node.querySelector(".edit-form");
    const editBtn = node.querySelector(".edit-btn");

    fillView(view, entry);
    editBtn.addEventListener("click", () => {
      fillForm(form, entry);
      view.classList.add("hidden");
      form.classList.remove("hidden");
    });
    form.querySelector(".cancel-btn").addEventListener("click", () => {
      form.classList.add("hidden");
      view.classList.remove("hidden");
    });
    form.addEventListener("submit", e => {
      e.preventDefault();
      Object.assign(state.education[idx], readForm(form));
      saveDB();
      fillView(view, state.education[idx]);
      form.classList.add("hidden");
      view.classList.remove("hidden");
    });

    wireFileUpload(
      node.querySelector(".file-upload-block"),
      () => state.education[idx].file,
      (f) => state.education[idx].file = f
    );

    eduTimeline.appendChild(node);
  });
}
renderEducation();

/* ===================== SKILLS ===================== */
const skillsGrid = document.getElementById("skills-grid");
const skillTpl = document.getElementById("tpl-skill");

function renderSkills() {
  skillsGrid.innerHTML = "";
  state.skills.forEach((skill, idx) => {
    const node = skillTpl.content.cloneNode(true);
    const nameEl = node.querySelector(".skill-name");
    const pctEl = node.querySelector(".skill-pct");
    const fillEl = node.querySelector(".skill-bar-fill");
    nameEl.textContent = skill.name;
    pctEl.textContent = skill.pct + "%";
    node.querySelector(".remove-x").addEventListener("click", () => {
      state.skills.splice(idx, 1); saveDB(); renderSkills();
    });
    nameEl.addEventListener("blur", () => {
      state.skills[idx].name = nameEl.textContent.trim() || "Skill";
      saveDB();
    });
    fillEl.addEventListener("click", () => {}); // placeholder to keep future extensibility
    const barWrap = node.querySelector(".skill-bar");
    barWrap.style.cursor = "pointer";
    barWrap.title = "Click to set proficiency";
    barWrap.addEventListener("click", (e) => {
      const rect = barWrap.getBoundingClientRect();
      const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      state.skills[idx].pct = Math.max(5, Math.min(100, pct));
      saveDB();
      renderSkills();
    });
    skillsGrid.appendChild(node);
    requestAnimationFrame(() => { fillEl.style.width = skill.pct + "%"; });
  });
}
renderSkills();

document.getElementById("add-skill-btn").addEventListener("click", () => {
  state.skills.push({ name: "New Skill", pct: 50 });
  saveDB();
  renderSkills();
});

/* ===================== GENERIC CARD LIST (certs / projects / achievements) ===================== */
function makeCardList({ gridId, tplId, addBtnId, stateKey, fields, hasFile, fileAccept }) {
  const grid = document.getElementById(gridId);
  const tpl = document.getElementById(tplId);

  function render() {
    grid.innerHTML = "";
    state[stateKey].forEach((item, idx) => {
      const node = tpl.content.cloneNode(true);
      fields.forEach(f => {
        const el = node.querySelector(f.sel);
        if (el) el.value = item[f.key] || "";
        if (el) el.addEventListener("input", () => { state[stateKey][idx][f.key] = el.value; saveDB(); });
      });
      const img = node.querySelector(".poly-image");
      node.querySelector(".remove-x").addEventListener("click", () => {
        state[stateKey].splice(idx, 1); saveDB(); render();
      });
      if (hasFile) {
        const block = node.querySelector(".file-upload-block");
        // render existing image preview into poly-image if present
        if (item.file && item.file.type && item.file.type.startsWith("image/")) {
          img.innerHTML = `<img src="${item.file.data}">`;
        }
        wireFileUpload(block, () => item.file, (f) => {
          item.file = f;
          if (f && f.type.startsWith("image/")) img.innerHTML = `<img src="${f.data}">`;
          else img.innerHTML = `<span class="placeholder-icon">${gridId === 'cert-grid' ? '🏆' : '⚙️'}</span>`;
        });
      }
      grid.appendChild(node);
    });
  }
  render();
  document.getElementById(addBtnId).addEventListener("click", () => {
    const blank = {};
    fields.forEach(f => blank[f.key] = "");
    if (hasFile) blank.file = null;
    state[stateKey].push(blank);
    saveDB();
    render();
  });
}

makeCardList({
  gridId: "cert-grid", tplId: "tpl-cert", addBtnId: "add-cert-btn", stateKey: "certifications",
  fields: [
    { sel: ".input-title", key: "title" },
    { sel: ".input-desc", key: "desc" },
    { sel: ".input-date", key: "date" }
  ],
  hasFile: true
});

makeCardList({
  gridId: "project-grid", tplId: "tpl-project", addBtnId: "add-project-btn", stateKey: "projects",
  fields: [
    { sel: ".input-title", key: "title" },
    { sel: ".input-desc", key: "desc" },
    { sel: ".input-tech", key: "tech" },
    { sel: ".input-github", key: "github" },
    { sel: ".input-demo", key: "demo" }
  ],
  hasFile: true
});

makeCardList({
  gridId: "achievement-grid", tplId: "tpl-achievement", addBtnId: "add-achievement-btn", stateKey: "achievements",
  fields: [
    { sel: ".input-title", key: "title" },
    { sel: ".input-desc", key: "desc" }
  ],
  hasFile: false
});

/* ===================== PRINT / RESUME ===================== */
document.getElementById("print-resume").addEventListener("click", () => window.print());
