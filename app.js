const canvas = document.getElementById("constellation");
const ctx = canvas.getContext("2d");
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const splash = document.getElementById("splash");
const splashCard = splash ? splash.querySelector(".splash-card") : null;
const tabButtons = Array.from(document.querySelectorAll(".tab-btn[data-tab]"));
const panelHost = document.getElementById("tabPanelHost");
const rightPane = document.getElementById("rightPane");
const PANEL_ANIMATION_MS = 720;

let width = 0;
let height = 0;
let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
let points = [];
let mouse = { x: -9999, y: -9999 };
let mouseActiveUntil = 0;
let currentTab = "home";
let tabAnimating = false;
let smoothScrollTarget = 0;
let smoothScrollRunning = false;
let smoothScrollFrameId = null;
let projectStackCleanup = null;
let palette = {
  line: "205, 219, 255",
  glow: "163, 190, 255",
  dot: "245, 249, 255",
};
const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

const TAB_CONTENT = {
  home: {
    heroLabel: "Home",
    heroTitle: "Building practical AI systems and full-stack products from research ideas.",
    heroBody:
      "I am Dhruv Maheshwari, a Computer Science Engineering student at PES University. My work focuses on multilingual speech, machine learning pipelines, and developer-friendly products that are accurate, secure, and production-minded.",
    body: `
      <section class="section content">
        <p class="eyebrow">Snapshot</p>
        <p>Recently, I interned at xForm Solutions where I built a multilingual ASR to MT to intent system using Whisper, NLLB-200, and Sentence-BERT, validated with systematic WER and CER testing on Google FLEURS.</p>
        <p>Use the tabs on the left to switch sections with smooth side transitions while keeping this panel scrollable.</p>
      </section>
      <section class="section">
        <ul class="highlights">
          <li><span class="inline-accent">PES University:</span> B.Tech CSE (2023 - 2027)</li>
          <li><span class="inline-accent">Scholarship:</span> Prof. CNR Rao Merit Award</li>
          <li><span class="inline-accent">Focus:</span> AI, Speech, Networks, and Web</li>
        </ul>
      </section>
    `,
  },
  about: {
    heroLabel: "About",
    heroTitle: "I enjoy turning complex problems into clean, useful systems.",
    heroBody:
      "I am pursuing B.Tech in Computer Science Engineering at PES University, Bengaluru (Aug 2023 - Oct 2027). I work at the intersection of machine learning, language technologies, and software engineering.",
    body: `
      <section class="section">
        <p class="eyebrow">Skills Graph</p>
        <div class="skills-graph" aria-label="Floating skills graph">
          <article class="skill-cluster cluster-lang">
            <div class="graph-node graph-parent">Programming Languages</div>
            <div class="cluster-children" aria-label="Programming Languages skills">
              <div class="graph-node graph-child">Python</div>
              <div class="graph-node graph-child">C</div>
              <div class="graph-node graph-child">Java</div>
              <div class="graph-node graph-child">SQL</div>
            </div>
          </article>

          <article class="skill-cluster cluster-web">
            <div class="graph-node graph-parent">Web Development</div>
            <div class="cluster-children" aria-label="Web Development skills">
              <div class="graph-node graph-child">MongoDB</div>
              <div class="graph-node graph-child">Express.js</div>
              <div class="graph-node graph-child">React.js</div>
              <div class="graph-node graph-child">Node.js</div>
              <div class="graph-node graph-child">HTML+CSS</div>
            </div>
          </article>

          <article class="skill-cluster cluster-cloud">
            <div class="graph-node graph-parent">Cloud</div>
            <div class="cluster-children" aria-label="Cloud skills">
              <div class="graph-node graph-child">Docker</div>
              <div class="graph-node graph-child">Kubernetes</div>
              <div class="graph-node graph-child">AWS</div>
            </div>
          </article>
        </div>
      </section>
      <section class="section">
        <p class="eyebrow">Skills</p>
        <div class="skill-grid">
          <div><h3>Programming</h3><p>Python (Advanced), C, JavaScript, SQL</p></div>
          <div><h3>ML and NLP</h3><p>PyTorch, Transformers, Sentence-Transformers, scikit-learn, Jiwer, Langdetect, Librosa</p></div>
          <div><h3>Data and Systems</h3><p>NumPy, Pandas, Regex, Docker</p></div>
          <div><h3>Web and Cloud</h3><p>MERN Stack (MongoDB, Express.js, React.js, Node.js), HTML and CSS</p></div>
        </div>
      </section>
      <section class="section content">
        <p class="eyebrow">Awards and Leadership</p>
        <p>Prof. CNR Rao Scholarship (40 percent tuition merit award) and 3 times Distinction Award.</p>
        <p>Head of Design at Maaya 2025, Under Secretary General and Head of Design at MUNSoc PESUECC, and Head of Chassis Design and Fabrication at Team Vegavath.</p>
      </section>
    `,
  },
  experience: {
    heroLabel: "Experience",
    heroTitle: "Applied AI internship work with measurable multilingual speech outcomes.",
    heroBody: "Hands-on internship delivery across ASR, machine translation, intent understanding, and systematic evaluation.",
    body: `
      <section class="section">
        <div class="timeline">
          <article class="timeline-item">
            <div class="timeline-year">Jun 2025 - Jul 2025</div>
            <div>
              <h3>AI Application Development Intern · xForm Solutions</h3>
              <p>Built a multilingual speech understanding system using Whisper, NLLB-200, and Sentence-BERT, achieving sub-0.07 CER on English benchmark speech and strong semantic consistency on Hindi/Tamil code-mixed input.</p>
              <p>Performed systematic WER and CER evaluation on Google FLEURS and improved non-English transcription quality through targeted preprocessing and post-processing rules.</p>
              <ul class="tags"><li>Whisper</li><li>NLLB-200</li><li>Sentence-BERT</li><li>Google FLEURS</li><li>PyTorch</li></ul>
            </div>
          </article>
        </div>
      </section>
      <section class="section">
        <p class="eyebrow">Certifications</p>
        <div class="cert-float-timeline" aria-label="Certification timeline">
          <article class="cert-node cert-node-1">
            <div class="cert-node-head">
              <div class="cert-meta-right">
                <a class="project-icon-link" href="https://www.coursera.org/account/accomplishments/verify/A5PRE5DF9R39" aria-label="Google IT Automation with Python credential website">
                <img src="public/websiteicon.svg" alt="" aria-hidden="true" class="social-icon" />
                </a>
                <p class="cert-date">Jun 2023</p>
              </div>
            </div>
            <h3>Google IT Automation with Python</h3>
            <p>Google</p>
          </article>

          <article class="cert-node cert-node-2">
            <div class="cert-node-head">
              <div class="cert-meta-right">
                <a class="project-icon-link" href="https://certificates.mooc.fi/validate/ubs53o2vunn" aria-label="Introduction to AI credential website">
                <img src="public/websiteicon.svg" alt="" aria-hidden="true" class="social-icon" />
                </a>
                <p class="cert-date">Jul 2023</p>
              </div>
            </div>
            <h3>Introduction to AI</h3>
            <p>University of Helsinki</p>
          </article>

          <article class="cert-node cert-node-3">
            <div class="cert-node-head">
              <div class="cert-meta-right">
                <a class="project-icon-link" href="https://www.linkedin.com/in/dhruvmaheshwari1/details/certifications/" aria-label="Data Science with Python credential website">
                <img src="public/websiteicon.svg" alt="" aria-hidden="true" class="social-icon" />
                </a>
                <p class="cert-date">Aug 2023</p>
              </div>
            </div>
            <h3>Data Science with Python</h3>
            <p>Simplilearn</p>
          </article>

          <article class="cert-node cert-node-4">
            <div class="cert-node-head">
              <div class="cert-meta-right">
                <a class="project-icon-link" href="https://www.credly.com/badges/dbd7e0e9-3770-499c-afb5-7590de3990f8/print" aria-label="Artificial Intelligence Fundamentals credential website">
                <img src="public/websiteicon.svg" alt="" aria-hidden="true" class="social-icon" />
                </a>
                <p class="cert-date">Jan 2025</p>
              </div>
            </div>
            <h3>Artificial Intelligence Fundamentals</h3>
            <p>IBM</p>
          </article>

          <article class="cert-node cert-node-5">
            <div class="cert-node-head">
              <div class="cert-meta-right">
                <a class="project-icon-link" href="https://www.linkedin.com/in/dhruvmaheshwari1/details/certifications/" aria-label="AWS Foundations of Prompt Engineering credential website">
                <img src="public/websiteicon.svg" alt="" aria-hidden="true" class="social-icon" />
                </a>
                <p class="cert-date">Mar 2025</p>
              </div>
            </div>
            <h3>AWS Foundations of Prompt Engineering</h3>
            <p>Amazon Web Services (AWS)</p>
          </article>
        </div>
      </section>
    `,
  },
  projects: {
    heroLabel: "Projects",
    heroTitle: "Applied projects across multilingual AI, networking, and financial forecasting.",
    heroBody: "From speech pipelines to secure sockets and deep-learning forecasting systems.",
    body: `
      <section class="section project-stack-section" data-project-stack>
        <div class="project-stack-controls" aria-label="Project card controls">
          <button type="button" class="stack-nav-btn" data-project-prev aria-label="Previous project">&#8592;</button>
          <button type="button" class="stack-nav-btn" data-project-next aria-label="Next project">&#8594;</button>
        </div>
        <div class="project-stack-viewport" data-project-viewport tabindex="0" aria-label="Project card stack">
          <div class="project-stack-track">
            <article class="project-card" data-project-card>
              <div class="project-head">
                <h3>EchoLang · Real-Time Multilingual Speech Translator (Jul 2025)</h3>
                <div class="project-actions" aria-label="EchoLang links">
                  <a class="project-icon-link" href="https://github.com/dhruvm-04/EchoLang" aria-label="EchoLang GitHub repository">
                    <img src="public/githubicon.svg" alt="" aria-hidden="true" class="social-icon" />
                  </a>
                </div>
              </div>
              <p>Developed an end-to-end multilingual speech pipeline (ASR to MT to intent classification) for code-switched Hindi, Tamil, and English with Whisper, NLLB-200, and Sentence-BERT.</p>
              <p>Evaluated systematically on Google FLEURS to optimize transcription quality and semantic consistency.</p>
              <ul class="tags"><li>Python</li><li>PyTorch</li><li>Transformers</li><li>Whisper</li><li>NLLB-200</li><li>Sentence-BERT</li></ul>
            </article>

            <article class="project-card" data-project-card>
              <div class="project-head">
                <h3>PES University Campus Virtual Tour · Interactive 3D Walkthrough</h3>
                <div class="project-actions" aria-label="PES University EC Campus Virtual Tour links">
                  <a class="project-icon-link" href="https://github.com/dhruvm-04/VirtualTour" aria-label="PES University EC Campus Virtual Tour GitHub repository">
                    <img src="public/githubicon.svg" alt="" aria-hidden="true" class="social-icon" />
                  </a>
                  <a class="project-icon-link" href="https://pes-virtual-tour.vercel.app/" aria-label="PES University EC Campus Virtual Tour deployed website">
                    <img src="public/websiteicon.svg" alt="" aria-hidden="true" class="social-icon" />
                  </a>
                </div>
              </div>
              <p>Built an interactive Three.js digital twin of the PES University EC Engineering Block with first-person traversal, interior exploration, teleport hotspots, and guided navigation flow. Implemented platform-specific controls including pointer-lock + WASD for desktop and swipe-look + virtual joystick movement for mobile, with EXR-based environment lighting and fullscreen support.</p>
              <ul class="tags"><li>Three.js</li><li>GLB Models</li><li>EXR Lighting</li><li>Pointer Lock</li><li>Mobile Joystick</li><li>Digital Twin</li></ul>
            </article>

            <article class="project-card" data-project-card>
              <div class="project-head">
                <h3>MusiConvert · Secure Playlist Conversion and Sharing (Jun 2025)</h3>
                <div class="project-actions" aria-label="MusiConvert links">
                  <a class="project-icon-link" href="https://github.com/dhruvm-04/MusiConvert" aria-label="MusiConvert GitHub repository">
                    <img src="public/githubicon.svg" alt="" aria-hidden="true" class="social-icon" />
                  </a>
                </div>
              </div>
              <p>Built an encrypted peer-to-peer playlist sharing platform using a custom Selective Repeat ARQ protocol over raw UDP/TCP sockets and a clean Tkinter GUI.</p>
              <ul class="tags"><li>Python</li><li>Sockets</li><li>Fernet</li><li>Selective Repeat ARQ</li><li>Multithreading</li></ul>
            </article>

            <article class="project-card" data-project-card>
              <div class="project-head">
                <h3>StockPrediction · Short-Interval Forecasting (Oct 2025)</h3>
                <div class="project-actions" aria-label="StockPrediction links">
                  <a class="project-icon-link" href="https://github.com/dhruvm-04/StockPredictionLSTM" aria-label="StockPrediction GitHub repository">
                    <img src="public/githubicon.svg" alt="" aria-hidden="true" class="social-icon" />
                  </a>
                </div>
              </div>
              <p>Designed a deep learning financial time-series forecasting tool to improve short-interval predictive performance with practical model experimentation and data preprocessing workflows.</p>
              <ul class="tags"><li>TensorFlow</li><li>scikit-learn</li><li>Pandas</li><li>NumPy</li><li>Gradio</li></ul>
            </article>
          </div>
        </div>
      </section>
    `,
  },
  extracurricular: {
    heroLabel: "Extracurricular",
    heroTitle: "Creative work beyond engineering: photography, 3D art, drumming and automotive culture.",
    heroBody:
      "Outside academics and projects, I spend my time on drumming, photography, 3D art, and automotive culture. These interests shape how I think about composition, motion, and storytelling.",
    body: `
      <section class="section">
        <div class="extra-tabs" data-extra-tabs>
          <div class="extra-tab-nav" role="tablist" aria-label="Extracurricular subtabs">
            <button class="extra-tab-btn is-active" type="button" role="tab" aria-selected="true" data-extra-target="profile">About Me</button>
            <button class="extra-tab-btn" type="button" role="tab" aria-selected="false" data-extra-target="photography">Photography Showcase</button>
            <a class="project-icon-link extra-drive-link" href="https://drive.google.com/drive/u/0/folders/1vbbEK7c75QB5ycgSYwX32Vawv56_W5b4" aria-label="Photography portfolio drive">
              <img src="public/websiteicon.svg" alt="" aria-hidden="true" class="social-icon" />
            </a>
          </div>

          <section class="extra-panel is-active" data-extra-panel="profile" role="tabpanel" aria-label="About Me">
            <div class="hobby-pills" data-hobby-pills>
              <button type="button" class="hobby-pill is-active" data-hobby="drummer">Drummer</button>
              <button type="button" class="hobby-pill" data-hobby="photographer">Photographer</button>
              <button type="button" class="hobby-pill" data-hobby="artist3d">3D Artist</button>
              <button type="button" class="hobby-pill" data-hobby="automotive">Automotives</button>
            </div>
            <article class="hobby-spotlight" data-hobby-spotlight>
              <h3>Drummer</h3>
              <p>I enjoy playing drums as a creative reset and a discipline in timing, consistency, and control.</p>
            </article>
          </section>

          <section class="extra-panel" data-extra-panel="photography" role="tabpanel" aria-label="Photography Showcase">
            <div class="photo-mosaic" data-photo-mosaic>
              <div class="photo-mosaic-grid" data-photo-grid></div>
              <div class="photo-more-wrap" data-photo-more-wrap>
                <button type="button" class="photo-more-btn" data-photo-more>Show more</button>
              </div>
              <div class="photo-lightbox" data-photo-lightbox aria-hidden="true">
                <button type="button" class="photo-lightbox-nav photo-lightbox-prev" data-photo-lightbox-prev aria-label="Previous image">&#8592;</button>
                <button type="button" class="photo-lightbox-nav photo-lightbox-next" data-photo-lightbox-next aria-label="Next image">&#8594;</button>
                <button type="button" class="photo-lightbox-close" data-photo-close aria-label="Close full-size image">&#10005;</button>
                <img src="" alt="" data-photo-lightbox-image />
              </div>
            </div>
          </section>
        </div>
      </section>
    `,
  },
};

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);
  if (themeToggle) {
    const nextTheme = theme === "light" ? "dark" : "light";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    themeToggle.setAttribute("title", `Switch to ${nextTheme} theme`);
  }
  updatePalette();
}

function initTheme() {
  const saved = localStorage.getItem("portfolio-theme");
  const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  applyTheme(saved || preferred);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      applyTheme(current === "light" ? "dark" : "light");
    });
  }
}

function updatePalette() {
  const styles = getComputedStyle(root);
  palette = {
    line: styles.getPropertyValue("--net-line-rgb").trim() || "205, 219, 255",
    glow: styles.getPropertyValue("--net-glow-rgb").trim() || "163, 190, 255",
    dot: styles.getPropertyValue("--net-dot-rgb").trim() || "245, 249, 255",
  };
}

function runIntroSplash() {
  if (!splash) {
    return;
  }

  playSplashCard();

  window.setTimeout(() => {
    splash.classList.add("is-hiding");
    window.setTimeout(() => {
      splash.classList.add("is-hidden");
      document.body.classList.remove("is-splash-active");
    }, 320);
  }, 1900);
}

function playSplashCard() {
  if (!splashCard) {
    return;
  }

  splashCard.style.animation = "none";
  void splashCard.offsetWidth;
  splashCard.style.animation = "";
}

function getSessionSeed() {
  const existing = sessionStorage.getItem("portfolio-starfield-seed");
  if (existing) {
    return Number(existing);
  }

  const seed = Math.floor(Math.random() * 2147483640) + 1;
  sessionStorage.setItem("portfolio-starfield-seed", String(seed));
  return seed;
}

function makeRandom(seed) {
  let t = seed >>> 0;
  return function random() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function forceLinksToOpenInNewTab(scope = document) {
  const links = scope.querySelectorAll("a[href]");
  links.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}

function getWrappedIndex(index, size) {
  if (!size) {
    return 0;
  }
  return ((index % size) + size) % size;
}

function initProjectStack() {
  if (typeof projectStackCleanup === "function") {
    projectStackCleanup();
    projectStackCleanup = null;
  }

  if (!panelHost) {
    return;
  }

  const stackRoot = panelHost.querySelector("[data-project-stack]");
  if (!stackRoot) {
    return;
  }

  const viewport = stackRoot.querySelector("[data-project-viewport]");
  const prevBtn = stackRoot.querySelector("[data-project-prev]");
  const nextBtn = stackRoot.querySelector("[data-project-next]");
  const cards = Array.from(stackRoot.querySelectorAll("[data-project-card]"));

  if (!viewport || cards.length === 0) {
    return;
  }

  let activeIndex = 0;
  let wheelLocked = false;
  let wheelLockTimer = null;
  const wheelReleaseMs = reducedMotionMedia.matches ? 150 : 300;

  const setStates = () => {
    cards.forEach((card, index) => {
      card.classList.remove("is-active", "is-prev", "is-next", "is-far-left", "is-far-right");

      const rightDistance = getWrappedIndex(index - activeIndex, cards.length);
      const leftDistance = getWrappedIndex(activeIndex - index, cards.length);

      if (index === activeIndex) {
        card.classList.add("is-active");
      } else if (leftDistance === 1) {
        card.classList.add("is-prev");
      } else if (rightDistance === 1) {
        card.classList.add("is-next");
      } else if (leftDistance < rightDistance) {
        card.classList.add("is-far-left");
      } else {
        card.classList.add("is-far-right");
      }
    });
  };

  const move = (direction) => {
    activeIndex = getWrappedIndex(activeIndex + direction, cards.length);
    setStates();
  };

  const onPrev = () => move(-1);
  const onNext = () => move(1);

  const onWheel = (event) => {
    const activeCard = cards[activeIndex];
    if (!activeCard) {
      return;
    }

    const canScrollWithinCard =
      (event.deltaY > 0 && activeCard.scrollTop + activeCard.clientHeight < activeCard.scrollHeight - 1) ||
      (event.deltaY < 0 && activeCard.scrollTop > 0);

    if (canScrollWithinCard) {
      event.stopPropagation();
      return;
    }

    if (Math.abs(event.deltaY) < 8 || wheelLocked) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    wheelLocked = true;
    if (wheelLockTimer) {
      window.clearTimeout(wheelLockTimer);
    }
    wheelLockTimer = window.setTimeout(() => {
      wheelLocked = false;
      wheelLockTimer = null;
    }, wheelReleaseMs);

    event.preventDefault();
    event.stopPropagation();
    move(event.deltaY > 0 ? 1 : -1);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  };

  prevBtn?.addEventListener("click", onPrev);
  nextBtn?.addEventListener("click", onNext);
  viewport.addEventListener("wheel", onWheel, { passive: false });
  viewport.addEventListener("keydown", onKeyDown);

  setStates();

  projectStackCleanup = () => {
    prevBtn?.removeEventListener("click", onPrev);
    nextBtn?.removeEventListener("click", onNext);
    viewport.removeEventListener("wheel", onWheel);
    viewport.removeEventListener("keydown", onKeyDown);
    if (wheelLockTimer) {
      window.clearTimeout(wheelLockTimer);
      wheelLockTimer = null;
    }
  };
}

function initExtracurricularSubtabs() {
  if (!panelHost) {
    return;
  }

  const rootTabs = panelHost.querySelector("[data-extra-tabs]");
  if (!rootTabs) {
    return;
  }

  const buttons = Array.from(rootTabs.querySelectorAll("[data-extra-target]"));
  const panels = Array.from(rootTabs.querySelectorAll("[data-extra-panel]"));

  const setActive = (target) => {
    buttons.forEach((button) => {
      const active = button.dataset.extraTarget === target;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.extraPanel === target);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.extraTarget;
      if (target) {
        setActive(target);
      }
    });
  });

  const hobbyButtons = Array.from(rootTabs.querySelectorAll("[data-hobby]"));
  const hobbySpotlight = rootTabs.querySelector("[data-hobby-spotlight]");
  const hobbyDetails = {
    photographer: {
      title: "Photography",
      body: "I like capturing street scenes, architecture, and automotive moments with attention to light and framing.",
    },
    artist3d: {
      title: "3D Modelling & Art",
      body: "I experiment with 3D environments and visual scenes, combining technical tools with artistic composition.",
    },
    drummer: {
      title: "Drums",
      body: "I enjoy playing drums as a creative reset and a discipline in timing, consistency, and control.",
    },
    automotive: {
      title: "Automotive Enthusiast",
      body: "I am deeply into automotive design and engineering, from body language and aerodynamics to driving culture.",
    },
    design: {
      title: "Design",
      body: "I am passionate about creating visually appealing interfaces and experiences, combining aesthetics with functionality.",
    }
  };

  const setHobby = (key) => {
    const detail = hobbyDetails[key];
    if (!detail || !hobbySpotlight) {
      return;
    }

    hobbyButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.hobby === key);
    });

    hobbySpotlight.innerHTML = `<h3>${detail.title}</h3><p>${detail.body}</p>`;
  };

  hobbyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.hobby;
      if (key) {
        setHobby(key);
      }
    });
  });

  const mosaicRoot = rootTabs.querySelector("[data-photo-mosaic]");
  const supportedPhotoExtensions = ["jpg", "jpeg", "png", "webp", "avif"];
  const photoGrid = mosaicRoot?.querySelector("[data-photo-grid]");
  const moreWrap = mosaicRoot?.querySelector("[data-photo-more-wrap]");
  const moreButton = mosaicRoot?.querySelector("[data-photo-more]");
  const lightbox = mosaicRoot?.querySelector("[data-photo-lightbox]");
  const lightboxImage = mosaicRoot?.querySelector("[data-photo-lightbox-image]");
  const lightboxClose = mosaicRoot?.querySelector("[data-photo-close]");
  const lightboxPrev = mosaicRoot?.querySelector("[data-photo-lightbox-prev]");
  const lightboxNext = mosaicRoot?.querySelector("[data-photo-lightbox-next]");
  const photoBaseNames = Array.from({ length: 40 }, (_, index) => `public/photo${String(index + 1).padStart(2, "0")}`);
  const initialPhotoCount = 10;
  const photoBatchCount = 10;
  let renderedPhotoCount = 0;
  let photoItems = [];
  let activeLightboxIndex = -1;

  const prepareImageItem = (item, index) => {
    item.style.setProperty("--photo-stagger", `${index * 40}ms`);

    const image = item.querySelector("img[data-photo-base]");
    const base = image?.dataset.photoBase;
    if (!image || !base) {
      return;
    }

    let extensionIndex = 0;

    const tryNextExtension = () => {
      if (extensionIndex >= supportedPhotoExtensions.length) {
        image.removeAttribute("src");
        image.style.opacity = "0";
        item.classList.add("is-photo-ready");
        return;
      }

      image.src = `${base}.${supportedPhotoExtensions[extensionIndex]}`;
      extensionIndex += 1;
    };

    image.addEventListener("load", () => {
      item.classList.add("is-photo-ready");
    });
    image.addEventListener("error", tryNextExtension);
    tryNextExtension();
  };

  const buildPhotoCard = (baseName, number) => {
    const article = document.createElement("article");
    article.className = "photo-mosaic-item";
    article.dataset.photoItem = "";

    const image = document.createElement("img");
    image.dataset.photoBase = baseName;
    image.alt = `Photography upload ${number}`;
    image.loading = "lazy";
    image.decoding = "async";
    article.appendChild(image);

    return article;
  };

  const renderNextPhotoBatch = () => {
    if (!photoGrid) {
      return;
    }

    const nextCount = Math.min(photoBaseNames.length, renderedPhotoCount + photoBatchCount);
    for (let i = renderedPhotoCount; i < nextCount; i += 1) {
      const card = buildPhotoCard(photoBaseNames[i], i + 1);
      photoGrid.appendChild(card);
      photoItems.push(card);
      prepareImageItem(card, i);
      revealObserver.observe(card);
    }
    renderedPhotoCount = nextCount;

    if (moreWrap) {
      moreWrap.classList.toggle("is-hidden", renderedPhotoCount >= photoBaseNames.length);
    }
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  if (photoGrid) {
    renderedPhotoCount = 0;
    photoItems = [];
    const startCount = Math.min(initialPhotoCount, photoBaseNames.length);
    for (let i = 0; i < startCount; i += 1) {
      const card = buildPhotoCard(photoBaseNames[i], i + 1);
      photoGrid.appendChild(card);
      photoItems.push(card);
      prepareImageItem(card, i);
      revealObserver.observe(card);
    }
    renderedPhotoCount = startCount;

    if (moreWrap) {
      moreWrap.classList.toggle("is-hidden", renderedPhotoCount >= photoBaseNames.length);
    }
    moreButton?.addEventListener("click", renderNextPhotoBatch);
  }

  if (mosaicRoot && photoGrid && photoItems.length > 0) {
    mosaicRoot.addEventListener("mouseover", () => {
      mosaicRoot.classList.add("is-hovering");
    });
    mosaicRoot.addEventListener("mouseleave", () => {
      mosaicRoot.classList.remove("is-hovering");
    });

    const setLightboxImageByIndex = (index) => {
      if (!lightboxImage) {
        return;
      }

      const validItems = Array.from(photoGrid.querySelectorAll("[data-photo-item]")).filter((item) => {
        const image = item.querySelector("img");
        return Boolean(image && image.src);
      });

      if (validItems.length === 0) {
        return;
      }

      activeLightboxIndex = getWrappedIndex(index, validItems.length);
      const activeImage = validItems[activeLightboxIndex]?.querySelector("img");
      if (!activeImage) {
        return;
      }

      lightboxImage.src = activeImage.currentSrc || activeImage.src;
      lightboxImage.alt = activeImage.alt || "Full-size photograph";
    };

    const openLightbox = (source, index) => {
      if (!lightbox || !lightboxImage || !source) {
        return;
      }

      setLightboxImageByIndex(index);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-photo-lightbox-open");
    };

    const closeLightbox = () => {
      if (!lightbox || !lightboxImage) {
        return;
      }
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImage.src = "";
      activeLightboxIndex = -1;
      document.body.classList.remove("is-photo-lightbox-open");
    };

    const stepLightbox = (direction) => {
      setLightboxImageByIndex(activeLightboxIndex + direction);
    };

    photoGrid.addEventListener("click", (event) => {
      const item = event.target instanceof Element ? event.target.closest("[data-photo-item]") : null;
      if (!item) {
        return;
      }
      const image = item.querySelector("img");
      if (image && image.src) {
        const validItems = Array.from(photoGrid.querySelectorAll("[data-photo-item]")).filter((entry) => {
          const img = entry.querySelector("img");
          return Boolean(img && img.src);
        });
        const validIndex = validItems.indexOf(item);
        openLightbox(image, validIndex >= 0 ? validIndex : 0);
      }
    });

    lightboxClose?.addEventListener("click", closeLightbox);
    lightboxPrev?.addEventListener("click", () => stepLightbox(-1));
    lightboxNext?.addEventListener("click", () => stepLightbox(1));
    lightbox?.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (lightbox?.classList.contains("is-open")) {
        if (event.key === "Escape") {
          closeLightbox();
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          stepLightbox(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          stepLightbox(1);
        }
      }
    });
  }

  setActive("profile");
  setHobby("drummer");
}

function renderTabPanel(tabKey, animate = true) {
  const content = TAB_CONTENT[tabKey];
  if (!content || !panelHost) {
    return;
  }

  const panel = document.createElement("article");
  panel.className = "tab-panel";
  panel.innerHTML = `
    <section class="section hero">
      <p class="eyebrow">${content.heroLabel}</p>
      <h2>${content.heroTitle}</h2>
      <p>${content.heroBody}</p>
    </section>
    ${content.body}
  `;
  forceLinksToOpenInNewTab(panel);

  const canAnimatePanelTransition =
    animate && !reducedMotionMedia.matches && !window.matchMedia("(max-width: 1080px)").matches;

  const oldPanel = panelHost.firstElementChild;
  if (!oldPanel || !canAnimatePanelTransition) {
    panelHost.innerHTML = "";
    panelHost.appendChild(panel);
    resetPaneScroll();
    initProjectStack();
    initExtracurricularSubtabs();
    tabAnimating = false;
    return;
  }

  oldPanel.classList.add("is-leaving");
  panel.classList.add("is-entering");
  panelHost.appendChild(panel);
  resetPaneScroll();

  panel.addEventListener(
    "animationend",
    () => {
      panel.classList.remove("is-entering");
    },
    { once: true },
  );

  oldPanel.addEventListener(
    "animationend",
    () => {
      oldPanel.remove();
    },
    { once: true },
  );

  window.setTimeout(() => {
    tabAnimating = false;
  }, PANEL_ANIMATION_MS + 30);

  initProjectStack();
  initExtracurricularSubtabs();
}

function setActiveTab(tabKey, animate = true) {
  if (!TAB_CONTENT[tabKey] || (tabKey === currentTab && animate) || tabAnimating) {
    return;
  }

  if (animate) {
    tabAnimating = true;
  }

  const targetTheme = tabKey === "extracurricular" ? "light" : "dark";
  document.body.classList.add("is-theme-fading");
  applyTheme(targetTheme);
  window.setTimeout(() => {
    document.body.classList.remove("is-theme-fading");
  }, 320);

  currentTab = tabKey;
  resetPaneScroll();
  tabButtons.forEach((button) => {
    const active = button.dataset.tab === tabKey;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  renderTabPanel(tabKey, animate);
}

function wireTabNavigation() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      if (!tab) {
        return;
      }
      setActiveTab(tab, true);
    });
  });
}

function wireStaticLinks() {
  forceLinksToOpenInNewTab(document);
}

function runSmoothScrollLoop() {
  if (!rightPane) {
    smoothScrollRunning = false;
    smoothScrollFrameId = null;
    return;
  }

  const delta = smoothScrollTarget - rightPane.scrollTop;
  if (Math.abs(delta) < 0.4) {
    rightPane.scrollTop = smoothScrollTarget;
    smoothScrollRunning = false;
    smoothScrollFrameId = null;
    return;
  }

  rightPane.scrollTop += delta * 0.12;
  smoothScrollFrameId = requestAnimationFrame(runSmoothScrollLoop);
}

function resetPaneScroll() {
  smoothScrollTarget = 0;
  if (smoothScrollFrameId !== null) {
    cancelAnimationFrame(smoothScrollFrameId);
    smoothScrollFrameId = null;
  }
  smoothScrollRunning = false;
  if (rightPane) {
    rightPane.scrollTop = 0;
  }
}

function wireSlowedScroll() {
  if (!rightPane) {
    return;
  }

  rightPane.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const max = Math.max(0, rightPane.scrollHeight - rightPane.clientHeight);
      smoothScrollTarget = Math.max(0, Math.min(max, smoothScrollTarget + event.deltaY * 0.68));

      if (!smoothScrollRunning) {
        smoothScrollRunning = true;
        smoothScrollFrameId = requestAnimationFrame(runSmoothScrollLoop);
      }
    },
    { passive: false },
  );
}

function pointCountForArea(area) {
  if (area < 280000) {
    return 28;
  }
  if (area < 700000) {
    return 42;
  }
  return 58;
}

function createPoint(random) {
  const speed = 0.14 + random() * 0.3;
  const angle = random() * Math.PI * 2;

  return {
    x: random() * width,
    y: random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    pulse: random() * Math.PI * 2,
    pulseSpeed: 0.008 + random() * 0.02,
    radius: 1.4 + random() * 1.6,
    respawnProgress: 1,
  };
}

function respawnPoint(p) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.06 + Math.random() * 0.14;
  p.x = Math.random() * width;
  p.y = Math.random() * height;
  p.vx = Math.cos(angle) * speed;
  p.vy = Math.sin(angle) * speed;
  p.respawnProgress = 0;
}

function setup() {
  dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const target = pointCountForArea(width * height);
  const random = makeRandom(getSessionSeed());
  points = Array.from({ length: target }, () => createPoint(random));
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function updatePoints() {
  const mouseActive = performance.now() < mouseActiveUntil;

  for (const p of points) {
    p.x += p.vx;
    p.y += p.vy;
    p.pulse += p.pulseSpeed;
    p.respawnProgress = Math.min(1, p.respawnProgress + 0.02);

    if (p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
      respawnPoint(p);
      continue;
    }

    const mx = mouse.x - p.x;
    const my = mouse.y - p.y;
    const mouseDist = Math.sqrt(mx * mx + my * my);

    if (mouseActive && mouseDist < 140) {
      const force = (140 - mouseDist) / 760;
      p.vx -= (mx / (mouseDist || 1)) * force;
      p.vy -= (my / (mouseDist || 1)) * force;
    }

    const maxSpeed = 0.9;
    p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx));
    p.vy = Math.max(-maxSpeed, Math.min(maxSpeed, p.vy));

    p.vx *= 0.992;
    p.vy *= 0.992;
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  const maxDistance = Math.min(185, Math.max(130, width * 0.13));

  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];

    for (let j = i + 1; j < points.length; j += 1) {
      const b = points[j];
      const dist = distance(a, b);

      if (dist < maxDistance) {
        const t = 1 - dist / maxDistance;
        const visibility = Math.min(a.respawnProgress, b.respawnProgress);
        ctx.strokeStyle = `rgba(${palette.line}, ${(0.04 + t * 0.2) * visibility})`;
        ctx.lineWidth = 0.65 + t * 0.45;
        ctx.shadowBlur = 8 * t;
        ctx.shadowColor = `rgba(${palette.glow}, ${0.58 * t * visibility})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    const pulse = 0.25 + (Math.sin(a.pulse) + 1) * 0.35;
    const dotAlpha = (0.36 + pulse * 0.5) * a.respawnProgress;
    ctx.fillStyle = `rgba(${palette.dot}, ${dotAlpha})`;
    ctx.shadowBlur = 9 + pulse * 8;
    ctx.shadowColor = `rgba(${palette.glow}, ${0.55 * a.respawnProgress})`;
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.radius + pulse * 0.32, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
}

function frame() {
  updatePoints();
  draw();
  requestAnimationFrame(frame);
}

window.addEventListener("resize", setup);
window.addEventListener("pointermove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouseActiveUntil = performance.now() + 120;
});
window.addEventListener("pointerleave", () => {
  mouse.x = -9999;
  mouse.y = -9999;
  mouseActiveUntil = 0;
});

initTheme();
wireStaticLinks();
wireTabNavigation();
wireSlowedScroll();
setActiveTab("home", false);
runIntroSplash();
setup();
frame();