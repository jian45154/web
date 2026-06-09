document.documentElement.classList.add("js");

let content = {};
let currentLang = "zh";

async function loadContent() {
  const files = ["meta", "about", "education", "projects", "experience", "skills", "contributions"];
  const results = await Promise.all(
    files.map(async (file) => {
      const response = await fetch(`./content/${file}.json`);
      if (!response.ok) throw new Error(`Failed to load ${file}.json (${response.status})`);
      return response.json();
    })
  );

  [content.meta, content.about, content.education, content.projects, content.experience, content.skills, content.contributions] = results;
}

function t(value) {
  if (!value) return "";
  return typeof value === "string" ? value : value[currentLang] || value.zh || value.en || "";
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function renderChips(items) {
  return items.map((item) => `<span>${item}</span>`).join("");
}

function renderMeta() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = translations[currentLang]?.[node.dataset.i18n];
    if (value !== undefined) node.textContent = value;
  });

  const pageTitle = t({ zh: "金苇航 Ian | 个人作品集", en: "Weihang (Ian) Jin | Personal Portfolio" });
  document.title = pageTitle;
  document.querySelector('meta[name="description"]')?.setAttribute(
    "content",
    t({ zh: "金苇航 Ian 的个人作品集、项目与工作经历", en: "Portfolio, projects, and work experience of Weihang (Ian) Jin" })
  );
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", pageTitle);
}

function renderHero() {
  const meta = content.meta;
  if (!meta) return;

  setText('[data-field="brand-name"]', t(meta.name));
  setText('[data-field="hero-kicker"]', t(meta.tagline));
  setText('[data-field="hero-byline"]', t(meta.byline));
  setText('[data-field="hero-lead"]', t(content.about?.profile));
  setText(
    '[data-field="hero-title"]',
    currentLang === "zh"
      ? "用工程方法做生物与人之间的连接，也保留对世界的好奇心。"
      : "I use engineering to connect biology and people, while staying curious about the world."
  );
  setText('[data-field="contact-email"]', meta.contact?.email || "");
}

function renderAbout() {
  setText('[data-field="about-title"]', t(content.about?.title));
  setText('[data-field="about-body"]', t(content.about?.body));
  const chips = document.querySelector("#about-chips");
  if (chips) chips.innerHTML = renderChips(content.about?.interests || []);
}

function renderEducation() {
  const education = content.education;
  const section = document.querySelector("#education");
  if (!education || !section) return;

  setText('[data-field="edu-school"]', education.school);
  setText('[data-field="edu-degree"]', education.degree);
  setText('[data-field="edu-period"]', t(education.period));
  setText('[data-field="edu-summary"]', t(education.summary));
  setText('[data-field="thesis-title"]', t(education.thesis?.title));
  setText('[data-field="thesis-body"]', t(education.thesis?.body));

  section.querySelector(".coursework-list").innerHTML = (education.coursework || [])
    .map(
      (group) => `
        <article class="coursework-group">
          <h4>${group.category}</h4>
          <ul>${group.items.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("");
}

function renderProjects() {
  const section = document.querySelector("#projects .cards");
  if (!section) return;

  section.innerHTML = (content.projects?.projects || [])
    .map(
      (project) => `
        <article class="card">
          <div class="card-header">
            <span class="card-period">${t(project.period)}</span>
            <span class="card-org">${t(project.org)}</span>
          </div>
          <h4 class="card-title">${t(project.title)}</h4>
          <p class="card-tech">${project.tech?.join(" · ") || ""}</p>
          <ul class="card-highlights">
            ${(project.highlights?.[currentLang] || []).map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderContributions() {
  const section = document.querySelector("#contributions .cards");
  if (!section) return;

  section.innerHTML = (content.contributions?.contributions || [])
    .map(
      (contribution) => `
        <article class="card">
          <div class="card-header">
            <span class="card-period">${t(contribution.period)}</span>
            <a class="card-repo" href="${contribution.url}" target="_blank" rel="noopener noreferrer">${contribution.repo} ↗</a>
          </div>
          <h4 class="card-title">${t(contribution.title)}</h4>
          <p class="card-tech">${contribution.tech?.join(" · ") || ""}</p>
          <ul class="card-highlights">
            ${(contribution.highlights?.[currentLang] || []).map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderExperience() {
  const section = document.querySelector("#experience .experience-list");
  if (!section) return;

  section.innerHTML = (content.experience?.experience || [])
    .map(
      (experience) => `
        <article class="exp-item">
          <div class="exp-header">
            <div>
              <h4 class="exp-title">${t(experience.title)}</h4>
              <span class="exp-company">${experience.company} · ${experience.location}</span>
            </div>
            <span class="exp-period">${t(experience.period)}</span>
          </div>
          <ul class="exp-highlights">
            ${(experience.highlights?.[currentLang] || []).map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderSkills() {
  const section = document.querySelector("#skills .skills-grid");
  if (!section) return;

  section.innerHTML = (content.skills?.skills || [])
    .map(
      (skill) => `
        <article class="skill-group">
          <h4 class="skill-category">${skill.category}</h4>
          <div class="chips">${renderChips(skill.items)}</div>
        </article>
      `
    )
    .join("");
}

function renderFooter() {
  const year = new Date().getFullYear();
  setText('[data-field="footer-name"]', `© ${year} ${t(content.meta?.name) || "金苇航 Ian"}`);
}

function render() {
  renderMeta();
  renderHero();
  renderAbout();
  renderEducation();
  renderProjects();
  renderContributions();
  renderExperience();
  renderSkills();
  renderFooter();
}

function applyLanguage(lang) {
  currentLang = translations[lang] ? lang : "zh";
  document.documentElement.lang = currentLang === "en" ? "en" : "zh-CN";
  localStorage.setItem("site-lang", currentLang);

  document.querySelectorAll(".lang-btn").forEach((button) => {
    const active = button.dataset.lang === currentLang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  render();
}

function initReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
}

const translations = {
  zh: {
    "nav.personal": "业余",
    "nav.work": "工作",
    "hero.personal": "业余与好奇",
    "hero.personalNote": "摄影、骑行、自然与动手探索",
    "hero.work": "工作与实践",
    "hero.workNote": "工程、项目、经历与技能",
    "home.location": "悉尼 / 线上",
    "portrait.caption": "在路上观察，也在工作台上验证。",
    "personal.title": "业余，是另一种认真。",
    "practice.prototype": "3D 打印与快速原型",
    "practice.prototypeBody": "将创意转化为可触摸的实物，从概念验证到功能原型。",
    "practice.signal": "嵌入式开发与生物信号处理",
    "practice.signalBody": "连接传感器、控制与算法，构建完整的采集与分析系统。",
    "practice.microfluidics": "微流控与表面处理",
    "practice.microfluidicsBody": "在微观尺度进行精密控制，探索等离子体表面处理的应用。",
    "work.title": "把想法变成可以测试的东西。",
    "work.body": "从生物医学工程、制造与装配，到面向真实约束的原型和流程改进。",
    "education.eyebrow": "Education",
    "education.title": "教育背景",
    "projects.eyebrow": "Practice",
    "projects.title": "项目经历",
    "contributions.eyebrow": "Open Source",
    "contributions.title": "开源贡献",
    "experience.eyebrow": "Experience",
    "experience.title": "工作经历",
    "skills.eyebrow": "Skills",
    "skills.title": "技能",
    "contact.eyebrow": "Contact",
    "contact.title": "联系我",
    "contact.body": "如果你对项目合作、技术交流，或任何值得探索的跨学科话题感兴趣，欢迎联系。"
  },
  en: {
    "nav.personal": "Personal",
    "nav.work": "Work",
    "hero.personal": "Life & curiosity",
    "hero.personalNote": "Photography, cycling, nature, and making",
    "hero.work": "Work & practice",
    "hero.workNote": "Engineering, projects, experience, and skills",
    "home.location": "Sydney / Online",
    "portrait.caption": "Observing outdoors, validating at the workbench.",
    "personal.title": "Personal pursuits, taken seriously.",
    "practice.prototype": "3D Printing & Rapid Prototyping",
    "practice.prototypeBody": "Turning ideas into tangible forms, from proof of concept to functional prototypes.",
    "practice.signal": "Embedded Development & Bio-signal Processing",
    "practice.signalBody": "Connecting sensors, control, and algorithms into complete acquisition and analysis systems.",
    "practice.microfluidics": "Microfluidics & Surface Treatment",
    "practice.microfluidicsBody": "Working with precision at micro scale and exploring plasma surface treatment.",
    "work.title": "Turning ideas into testable things.",
    "work.body": "From biomedical engineering and manufacturing to prototypes and process improvements shaped by real constraints.",
    "education.eyebrow": "Education",
    "education.title": "Education",
    "projects.eyebrow": "Practice",
    "projects.title": "Projects",
    "contributions.eyebrow": "Open Source",
    "contributions.title": "Open Source Contributions",
    "experience.eyebrow": "Experience",
    "experience.title": "Work Experience",
    "skills.eyebrow": "Skills",
    "skills.title": "Skills",
    "contact.eyebrow": "Contact",
    "contact.title": "Get in touch",
    "contact.body": "For collaboration, technical exchange, or an interdisciplinary idea worth exploring, feel free to reach out."
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadContent();
    applyLanguage(localStorage.getItem("site-lang") || "zh");
    initReveal();
  } catch (error) {
    console.error("Unable to load portfolio content:", error);
    document.querySelectorAll(".lang-btn").forEach((button) => {
      button.disabled = true;
    });
  }

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });
});
