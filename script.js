// Content loaded from JSON files
let content = {};
let currentLang = 'zh';

// ── Load all content files ──────────────────────────────────────────────────
async function loadContent() {
  const files = ['meta', 'about', 'education', 'projects', 'experience', 'skills', 'contributions'];
  const results = await Promise.all(
    files.map(async (file) => {
      const response = await fetch(`./content/${file}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${file}.json (${response.status})`);
      }
      return response.json();
    })
  );
  content = {
    meta: results[0],
    about: results[1],
    education: results[2],
    projects: results[3],
    experience: results[4],
    skills: results[5],
    contributions: results[6],
  };
}

// ── Render helpers ──────────────────────────────────────────────────────────
function t(obj) {
  if (!obj) return '';
  return (typeof obj === 'string') ? obj : (obj[currentLang] || obj.zh || obj.en || '');
}

function renderChips(items) {
  return items.map(item => `<span>${item}</span>`).join('');
}

// ── Render sections ─────────────────────────────────────────────────────────
function renderMeta() {
  document.querySelectorAll('[data-i18n]').forEach(node => {
    const key = node.getAttribute('data-i18n');
    const val = translations[currentLang]?.[key];
    if (val !== undefined) node.textContent = val;
  });

  const isDetailsPage = document.body.classList.contains('details-page');
  document.title = isDetailsPage
    ? t({ zh: '经历 | 金苇航 Ian', en: 'Experience | Weihang (Ian) Jin' })
    : t({ zh: '金苇航 Ian | 个人作品集', en: 'Weihang (Ian) Jin | Personal Portfolio' });
  document.querySelector('meta[name="description"]')?.setAttribute('content',
    isDetailsPage
      ? t({ zh: '金苇航 Ian 的教育、项目与工作经历', en: 'Education, projects, and work experience of Weihang (Ian) Jin' })
      : t({ zh: '金苇航 Ian 的个人主页', en: 'Personal portfolio of Weihang (Ian) Jin' }));
  document.querySelector('meta[property="og:title"]')?.setAttribute('content',
    t({ zh: '金苇航 Ian | 个人作品集', en: 'Weihang (Ian) Jin | Personal Portfolio' }));
}

function renderHero() {
  const m = content.meta;
  if (!m?.name) return;

  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  };
  setText('[data-field="brand-name"]', t(m.name));
  setText('[data-field="hero-kicker"]', t(m.tagline));
  setText('[data-field="hero-byline"]', t(m.byline));
  setText('[data-field="hero-lead"]', t(content.about?.profile));
  setText('[data-field="hero-title"]',
    currentLang === 'zh'
      ? '用工程方法做生物与人之间的连接，也保留对世界的好奇心。'
      : 'I use engineering to connect biology and people, while staying curious about the world.');
}

function renderPortrait() {
  document.querySelectorAll('.portrait').forEach(portrait => {
    const img = document.createElement('img');
    img.src = './assets/portrait.jpg';
    img.alt = t(content.meta?.name) || 'Portrait';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:999px;';
    portrait.replaceChildren(img);
  });
}

function renderAbout() {
  const a = content.about;
  if (!a) return;
  const body = document.querySelector('[data-field="about-body"]');
  const title = document.querySelector('[data-field="about-title"]');
  if (body) body.textContent = t(a.body);
  if (title) title.textContent = t(a.title);
  const chipsEl = document.querySelector('#about .chips');
  if (chipsEl) chipsEl.innerHTML = renderChips(a.interests || []);
}

function renderEducation() {
  const e = content.education;
  if (!e) return;

  const section = document.querySelector('#education');
  if (!section) return;

  const cw = e.coursework || [];
  const cwHtml = cw.map(g => `
    <div class="coursework-group">
      <h4>${g.category}</h4>
      <ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>
  `).join('');

  section.querySelector('[data-field="edu-school"]').textContent = e.school;
  section.querySelector('[data-field="edu-degree"]').textContent = e.degree;
  section.querySelector('[data-field="edu-period"]').textContent = t(e.period);
  section.querySelector('[data-field="edu-summary"]').textContent = t(e.summary);
  const cwList = section.querySelector('.coursework-list');
  if (cwList) cwList.innerHTML = cwHtml;
  section.querySelector('[data-field="thesis-title"]').textContent = t(e.thesis?.title);
  section.querySelector('[data-field="thesis-body"]').textContent = t(e.thesis?.body);
}

function renderProjects() {
  const p = content.projects?.projects || [];
  if (!p.length) return;

  const section = document.querySelector('#projects');
  if (!section) return;

  section.querySelector('.cards').innerHTML = p.map(proj => `
    <article class="card project-card">
      <div class="card-header">
        <span class="card-period">${t(proj.period)}</span>
        <span class="card-org">${t(proj.org)}</span>
      </div>
      <h4 class="card-title">${t(proj.title)}</h4>
      <p class="card-tech">${proj.tech?.join(' · ')}</p>
      <ul class="card-highlights">
        ${proj.highlights[currentLang]?.map(h => `<li>${h}</li>`).join('') || ''}
      </ul>
    </article>
  `).join('');
}

function renderExperience() {
  const exps = content.experience?.experience || [];
  if (!exps.length) return;

  const section = document.querySelector('#experience');
  if (!section) return;

  section.querySelector('.experience-list').innerHTML = exps.map(exp => `
    <article class="exp-item">
      <div class="exp-header">
        <div class="exp-left">
          <h4 class="exp-title">${t(exp.title)}</h4>
          <span class="exp-company">${exp.company} · ${exp.location}</span>
        </div>
        <span class="exp-period">${t(exp.period)}</span>
      </div>
      <ul class="exp-highlights">
        ${exp.highlights[currentLang]?.map(h => `<li>${h}</li>`).join('') || ''}
      </ul>
    </article>
  `).join('');
}

function renderContributions() {
  const contribs = content.contributions?.contributions || [];
  if (!contribs.length) return;

  const section = document.querySelector('#contributions');
  if (!section) return;

  section.querySelector('.cards').innerHTML = contribs.map(c => `
    <article class="card contrib-card">
      <div class="card-header">
        <span class="card-period">${t(c.period)}</span>
        <a class="card-repo" href="${c.url}" target="_blank" rel="noopener noreferrer">${c.repo}</a>
      </div>
      <h4 class="card-title">${t(c.title)}</h4>
      <p class="card-tech">${c.tech?.join(' · ')}</p>
      <ul class="card-highlights">
        ${c.highlights[currentLang]?.map(h => `<li>${h}</li>`).join('') || ''}
      </ul>
    </article>
  `).join('');
}

function renderSkills() {
  const skills = content.skills?.skills || [];
  if (!skills.length) return;

  const section = document.querySelector('#skills');
  if (!section) return;

  section.querySelector('.skills-grid').innerHTML = skills.map(s => `
    <div class="skill-group">
      <h4 class="skill-category">${s.category}</h4>
      <div class="chips">
        ${s.items.map(i => `<span>${i}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderFooter() {
  const year = new Date().getFullYear();
  const name = t(content.meta?.name) || '金苇航 Ian';
  const footer = document.querySelector('[data-field="footer-name"]');
  if (footer) footer.textContent = `© ${year} ${name}`;
}

// ── Full render ─────────────────────────────────────────────────────────────
async function render() {
  await loadContent();
  renderMeta();
  renderHero();
  renderPortrait();
  renderAbout();
  renderEducation();
  renderProjects();
  renderContributions();
  renderExperience();
  renderSkills();
  renderFooter();
}

// ── Language switching ──────────────────────────────────────────────────────
const translations = {
  zh: {
    'brand.eyebrow': '个人作品集 / Portfolio',
    'hero.cta_primary': '查看实践',
    'hero.cta_secondary': '了解更多',
    'stats.title1': '方向',
    'stats.title2': '身份',
    'stats.title3': '地点',
    'about.eyebrow': 'About',
    'about.title': '我关注什么',
    'projects.eyebrow': 'Practice',
    'projects.title': '项目经历',
    'education.eyebrow': 'Education',
    'education.title': '教育背景',
    'contributions.eyebrow': 'Open Source',
    'contributions.title': '开源贡献',
    'experience.eyebrow': 'Experience',
    'experience.title': '工作经历',
    'skills.eyebrow': 'Skills',
    'skills.title': '技能',
    'contact.eyebrow': 'Contact',
    'contact.title': '联系我',
    'contact.body': '如果你对项目合作、技术交流，或任何值得探索的跨学科话题感兴趣，可以通过 GitHub 了解更多。',
    'contact.link': 'GitHub · @jian45154',
    'footer.credit': '由 Lucien Auregin 设计与构建',
    'home.explore': '了解我的经历',
    'home.location': '悉尼 / 线上',
    'home.focus': '生物医学工程',
    'details.back': '返回主页',
    'details.eyebrow': '个人档案 / Profile',
    'details.experience': '工作经历',
    'details.projects': '项目经历',
  },
  en: {
    'brand.eyebrow': 'Portfolio / 个人作品集',
    'hero.cta_primary': 'View Practice',
    'hero.cta_secondary': 'About Me',
    'stats.title1': 'Focus',
    'stats.title2': 'Identity',
    'stats.title3': 'Location',
    'about.eyebrow': 'About',
    'about.title': 'What I care about',
    'projects.eyebrow': 'Practice',
    'projects.title': 'Project Experience',
    'education.eyebrow': 'Education',
    'education.title': 'Education',
    'contributions.eyebrow': 'Open Source',
    'contributions.title': 'Open Source Contributions',
    'experience.eyebrow': 'Experience',
    'experience.title': 'Work Experience',
    'skills.eyebrow': 'Skills',
    'skills.title': 'Skills',
    'contact.eyebrow': 'Contact',
    'contact.title': 'Get in touch',
    'contact.body': 'For collaboration, technical exchange, or an interdisciplinary idea worth exploring, find me on GitHub.',
    'contact.link': 'GitHub · @jian45154',
    'footer.credit': 'Designed and built by Lucien Auregin',
    'home.explore': 'Explore my experience',
    'home.location': 'Sydney / Online',
    'home.focus': 'Biomedical Engineering',
    'details.back': 'Back home',
    'details.eyebrow': 'Profile / 个人档案',
    'details.experience': 'Work experience',
    'details.projects': 'Projects',
  },
};

function applyLanguage(lang) {
  if (!translations[lang]) lang = 'zh';
  currentLang = lang;

  // Toggle [data-lang] visibility
  document.querySelectorAll('[data-lang]:not(.lang-btn)').forEach(el => {
    el.style.display = el.dataset.lang === lang ? '' : 'none';
  });

  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });

  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  localStorage.setItem('site-lang', lang);

  // Re-render content with new language
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

// ── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await render();
  } catch (error) {
    console.error('Unable to load portfolio content:', error);
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.disabled = true;
    });
    return;
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  const savedLang = localStorage.getItem('site-lang');
  if (savedLang) applyLanguage(savedLang);
});
