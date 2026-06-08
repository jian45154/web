const translations = {
  zh: {
    "brand.eyebrow": "个人作品集 / Portfolio",
    "brand.name": "Lucien Auregin",
    "hero.kicker": "Biomedical engineer · Builder · Explorer",
    "hero.byline": "作者 / Created by 金苇航 Ian",
    "hero.title": "用工程方法做生物与人之间的连接，也保留对世界的好奇心。",
    "hero.lead":
      "我拥有悉尼大学生物医学工程荣誉学士背景，实践覆盖快速原型、嵌入式开发、生物信号处理与实验技术，长期关注把想法做成可测试、可使用的原型。",
    "hero.cta_primary": "查看实践",
    "hero.cta_secondary": "了解更多",
    "stats.title1": "方向",
    "stats.value1": "Biomedical Engineering",
    "stats.title2": "身份",
    "stats.value2": "Builder · Maker · Rider",
    "stats.title3": "地点",
    "stats.value3": "Sydney / Online",
    "about.eyebrow": "About",
    "about.title": "我关注什么",
    "about.body":
      "我持续关注生物、自然博物学和人与环境的关系，也喜欢让工程、观察与审美在同一个项目里相遇。",
    "projects.eyebrow": "Practice",
    "projects.title": "实践方向",
    "project1.title": "3D 打印与快速原型",
    "project1.body":
      "从结构设计、打印参数到迭代修正，关注如何把概念快速变成能测、能装配、能使用的实体。",
    "project2.title": "嵌入式开发与生物信号处理",
    "project2.body":
      "结合传感器、采集、滤波和可视化，把原始信号转成可分析的数据，并尽量提高系统稳定性。",
    "project3.title": "微流控与表面处理",
    "project3.body":
      "接触过微流控和 plasma surface treating 相关项目，关注材料表面、流体行为与实验可重复性。",
    "contact.eyebrow": "Contact",
    "contact.title": "联系我",
    "contact.body":
      "如果你对项目合作、技术交流，或任何值得探索的跨学科话题感兴趣，可以通过 GitHub 了解更多。",
    "contact.link": "GitHub · @jian45154",
    "footer.credit": "由金苇航 Ian 设计与构建",
  },
  en: {
    "brand.eyebrow": "Portfolio / 个人作品集",
    "brand.name": "Lucien Auregin",
    "hero.kicker": "Biomedical engineer · Builder · Explorer",
    "hero.byline": "Created by 金苇航 Ian",
    "hero.title": "I use engineering to connect biology and people, while staying curious about the world.",
    "hero.lead":
      "With an Honours degree in Biomedical Engineering from the University of Sydney, I work across rapid prototyping, embedded development, bio-signal processing, and experimental techniques to turn ideas into testable, usable prototypes.",
    "hero.cta_primary": "View Practice",
    "hero.cta_secondary": "About Me",
    "stats.title1": "Focus",
    "stats.value1": "Biomedical Engineering",
    "stats.title2": "Identity",
    "stats.value2": "Builder · Maker · Rider",
    "stats.title3": "Location",
    "stats.value3": "Sydney / Online",
    "about.eyebrow": "About",
    "about.title": "What I care about",
    "about.body":
      "I stay interested in biology, natural history, and the relationship between people and their environment. I like bringing engineering, observation, and aesthetics into the same project.",
    "projects.eyebrow": "Practice",
    "projects.title": "Areas of Practice",
    "project1.title": "3D Printing and Rapid Prototyping",
    "project1.body":
      "From structural design and print parameters to iteration, I focus on turning concepts into objects that can be tested, assembled, and used quickly.",
    "project2.title": "Embedded Development and Bio-signal Processing",
    "project2.body":
      "Combining sensors, acquisition, filtering, and visualization, I turn raw signals into analyzable data while keeping systems stable.",
    "project3.title": "Microfluidics and Surface Treatment",
    "project3.body":
      "I have worked on projects related to microfluidics and plasma surface treating, with attention to surface properties, fluid behavior, and reproducibility.",
    "contact.eyebrow": "Contact",
    "contact.title": "Get in touch",
    "contact.body":
      "For collaboration, technical exchange, or an interdisciplinary idea worth exploring, find me on GitHub.",
    "contact.link": "GitHub · @jian45154",
    "footer.credit": "Designed and built by 金苇航 Ian",
  },
};

const pageMetadata = {
  zh: {
    title: "Lucien Auregin | 个人作品集",
    description:
      "Lucien Auregin 的个人主页，由金苇航 Ian 创作，记录 biomedical engineering、原型实践与跨学科兴趣。",
  },
  en: {
    title: "Lucien Auregin | Personal Portfolio",
    description:
      "The personal portfolio of Lucien Auregin, created by 金苇航 Ian, featuring biomedical engineering, prototyping, and interdisciplinary interests.",
  },
};

const langButtons = document.querySelectorAll(".lang-btn");
const textNodes = document.querySelectorAll("[data-i18n]");
const descriptionMeta = document.querySelector('meta[name="description"]');

function applyLanguage(lang) {
  const dict = translations[lang] || translations.zh;
  textNodes.forEach((node) => {
    const key = node.getAttribute("data-i18n");
    const value = dict[key];
    if (typeof value === "string") {
      node.textContent = value;
    }
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.title = pageMetadata[lang].title;
  descriptionMeta.setAttribute("content", pageMetadata[lang].description);
  localStorage.setItem("site-lang", lang);
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.lang));
});

const savedLang = localStorage.getItem("site-lang");
applyLanguage(savedLang === "en" ? "en" : "zh");
