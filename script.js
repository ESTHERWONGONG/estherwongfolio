gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   script.js
   结构说明：
   - 以后不要整份重写时，就按下面的“替换开始 / 替换结束”区块替换。
   - 全局 / page1 / page2 / page3 / modal / debug / snow 都已经拆开。
   ========================================================= */


/* =========================================================
   【这里是全局滚动初始化】替换开始
   ========================================================= */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ENABLE_PAGE1_VIDEO_SCRUB = true;
const ENABLE_PAGE1_ZOOM = false;
const ENABLE_PAGE1_THREE = false;
const ENABLE_LENIS_FOR_VIDEO_TEST = false;
const VIDEO_PATH = "assets/videos/hero-scroll-video.mp4";
const PAGE_1_VIDEO_START = 0;
const PAGE_1_VIDEO_END = 5;
const PAGE_2_VIDEO_START = 5;
const PAGE_2_VIDEO_END = 10;
const PAGE_1_SCROLL_LENGTH = "400vh";
const PAGE_1_ZOOM_AMOUNT = 0.06;

document.body.classList.toggle("is-page1-video-test", ENABLE_PAGE1_VIDEO_SCRUB);
document.documentElement.dataset.page1VideoScrub = String(ENABLE_PAGE1_VIDEO_SCRUB);
document.documentElement.dataset.page1Zoom = String(ENABLE_PAGE1_ZOOM);
document.documentElement.dataset.page1Three = String(ENABLE_PAGE1_THREE);
document.documentElement.dataset.lenisActive = String(ENABLE_LENIS_FOR_VIDEO_TEST);

let lenis = null;

if (ENABLE_LENIS_FOR_VIDEO_TEST) {
  lenis = new Lenis({
    duration: reduceMotion ? 0.2 : 0.75,
    smoothWheel: true,
    lerp: 0.12,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
}

gsap.ticker.lagSmoothing(0);

if (ENABLE_PAGE1_ZOOM) {
  window.addEventListener("scroll", () => {
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    const lakeScale = 1 + progress * 0.05;
    document.documentElement.style.setProperty("--lakeScale", lakeScale.toFixed(3));
  });
}

const debugPanel = document.getElementById("debugPanel");
let heroTl = null;
let targetVideoTime = PAGE_1_VIDEO_START;
let currentVideoTime = PAGE_1_VIDEO_START;
let videoRafId = null;
/* =========================================================
   【这里是全局滚动初始化】替换结束
   ========================================================= */


/* =========================================================
   【这里是page1根节点】替换开始
   ========================================================= */
const heroPage = document.querySelector("#page1");
const heroScene = document.querySelector(".hero-scene");
const heroScrollVideo = document.querySelector(".hero-scroll-video");
/* =========================================================
   【这里是page1根节点】替换结束
   ========================================================= */


/* =========================================================
   【这里是page1标题图层】替换开始
   说明：创建 page1 居中的标题图。
   标题路径：assets/images/title_p1.png
   ========================================================= */
const heroTitleLayer = document.createElement("div");
heroTitleLayer.className = "hero-title-layer";
heroTitleLayer.setAttribute("aria-hidden", "true");

const heroTitleImg = document.createElement("img");
heroTitleImg.className = "hero-title";
heroTitleImg.src = "assets/images/title_p1.png";
heroTitleImg.alt = "";

heroTitleLayer.appendChild(heroTitleImg);
heroPage.appendChild(heroTitleLayer);

function showHeroTitle() {
  gsap.killTweensOf(heroTitleLayer);

  gsap.fromTo(
    heroTitleLayer,
    {
      opacity: 0,
      y: 18,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
      overwrite: "auto",
    }
  );
}

function hideHeroTitle() {
  gsap.killTweensOf(heroTitleLayer);

  gsap.to(heroTitleLayer, {
    opacity: 0,
    y: -18,
    duration: 0.45,
    ease: "power2.inOut",
    overwrite: "auto",
  });
}

if (!ENABLE_PAGE1_VIDEO_SCRUB) {
  showHeroTitle();
}
/* =========================================================
   【这里是page1标题图层】替换结束
   ========================================================= */


/* =========================================================
   【这里是page1滚动驱动视频】替换开始
   ========================================================= */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function scrollLengthToPixels(value) {
  if (typeof value === "number") return value;
  if (value.endsWith("vh")) {
    return (Number.parseFloat(value) / 100) * window.innerHeight;
  }
  if (value.endsWith("px")) {
    return Number.parseFloat(value);
  }
  return window.innerHeight * 4;
}

function waitForVideoMetadata(video) {
  if (video.readyState >= 1) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    video.addEventListener("loadedmetadata", resolve, { once: true });
  });
}

function getVideoMaxTime(video) {
  return Number.isFinite(video.duration) ? Math.min(video.duration, PAGE_2_VIDEO_END) : PAGE_2_VIDEO_END;
}

function clampVideoTime(video, time) {
  return clamp(time, 0, getVideoMaxTime(video));
}

function setVideoTime(video, time) {
  const safeTime = clampVideoTime(video, time);
  targetVideoTime = safeTime;
  currentVideoTime = safeTime;
  video.currentTime = safeTime;
}

function updateVideoTime() {
  if (!heroScrollVideo || !Number.isFinite(heroScrollVideo.duration)) {
    videoRafId = requestAnimationFrame(updateVideoTime);
    return;
  }

  currentVideoTime += (targetVideoTime - currentVideoTime) * 0.25;
  currentVideoTime = clampVideoTime(heroScrollVideo, currentVideoTime);

  if (Math.abs(heroScrollVideo.currentTime - currentVideoTime) > 0.03) {
    heroScrollVideo.currentTime = currentVideoTime;
  }

  document.documentElement.dataset.targetVideoTime = targetVideoTime.toFixed(3);
  document.documentElement.dataset.currentVideoTime = currentVideoTime.toFixed(3);

  videoRafId = requestAnimationFrame(updateVideoTime);
}

function startVideoTimeLoop() {
  if (videoRafId !== null) return;
  videoRafId = requestAnimationFrame(updateVideoTime);
}

function stopVideoTimeLoop() {
  if (videoRafId === null) return;
  cancelAnimationFrame(videoRafId);
  videoRafId = null;
}

function setTargetVideoTime(video, time) {
  const maxTime = Number.isFinite(video.duration) ? Math.min(video.duration, PAGE_2_VIDEO_END) : PAGE_2_VIDEO_END;
  targetVideoTime = clamp(time, 0, maxTime);
  document.documentElement.dataset.targetVideoTime = targetVideoTime.toFixed(3);
}

function setPageOneProgress(progress) {
  const safeProgress = clamp(progress, 0, 1);
  const videoTime = PAGE_1_VIDEO_START + (PAGE_1_VIDEO_END - PAGE_1_VIDEO_START) * safeProgress;

  if (ENABLE_PAGE1_VIDEO_SCRUB) {
    setTargetVideoTime(heroScrollVideo, videoTime);
  }

  if (ENABLE_PAGE1_ZOOM) {
    const zoomScale = 1 + PAGE_1_ZOOM_AMOUNT * safeProgress;
    document.documentElement.style.setProperty("--sceneScale", zoomScale.toFixed(4));
  }
}

function initScrollDrivenVideo() {
  if (!heroPage || !heroScrollVideo) return;

  heroScrollVideo.pause();
  document.documentElement.style.setProperty("--sceneScale", "1");
  setVideoTime(heroScrollVideo, PAGE_1_VIDEO_START);
  setPageOneProgress(0);
  startVideoTimeLoop();

  heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#page1",
      start: "top top",
      end: () => `+=${scrollLengthToPixels(PAGE_1_SCROLL_LENGTH)}`,
      scrub: true,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setPageOneProgress(self.progress);
      },
      onLeave: () => {
        setVideoTime(heroScrollVideo, PAGE_2_VIDEO_START);
      },
      onEnterBack: () => {
        setVideoTime(heroScrollVideo, PAGE_2_VIDEO_START);
      },
      onLeaveBack: () => {
        setPageOneProgress(0);
      },
    },
  });

  heroTl.to({}, { duration: 1 });
  ScrollTrigger.refresh();
}

function syncPageOneProgressFromScroll() {
  if (!heroTl || !heroTl.scrollTrigger) return;
  setPageOneProgress(heroTl.scrollTrigger.progress);
}

if (!ENABLE_LENIS_FOR_VIDEO_TEST) {
  window.addEventListener(
    "scroll",
    () => {
      ScrollTrigger.update();
      syncPageOneProgressFromScroll();
    },
    { passive: true }
  );
}

if (heroScrollVideo) {
  heroScrollVideo.src = VIDEO_PATH;
  heroScrollVideo.muted = true;
  heroScrollVideo.playsInline = true;
  heroScrollVideo.preload = "auto";
  heroScrollVideo.addEventListener("loadedmetadata", initScrollDrivenVideo, { once: true });
  heroScrollVideo.load();

  if (heroScrollVideo.readyState >= 1) {
    initScrollDrivenVideo();
  }
}
/* =========================================================
   【这里是page1滚动驱动视频】替换结束
   ========================================================= */


/* =========================================================
   【这里是对齐调试模式】替换开始
   ========================================================= */
function setAlignmentMode(active) {
  if (!heroTl) return;

  if (active) {
    heroTl.pause(0);
  } else {
    heroTl.resume();
  }
}
/* =========================================================
   【这里是对齐调试模式】替换结束
   ========================================================= */


/* =========================================================
   【这里是modal弹窗逻辑】替换开始
   ========================================================= */
const modals = [...document.querySelectorAll(".modal")];
let lastFocus = null;

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  lastFocus = document.activeElement;
  modal.hidden = false;

  gsap.fromTo(
    modal.querySelector(".modal-panel"),
    {
      y: 18,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.25,
      ease: "power2.out",
    }
  );

  modal.querySelector("[data-modal-close]").focus();
}

function closeModal(modal) {
  modal.hidden = true;

  if (lastFocus && typeof lastFocus.focus === "function") {
    lastFocus.focus();
  }
}

document.querySelectorAll("[data-modal-open]").forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.modalOpen);
  });
});

document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.closest(".modal"));
  });
});

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modals.filter((modal) => !modal.hidden).forEach(closeModal);
  }

  if (event.key.toLowerCase() === "d") {
    debugPanel.hidden = !debugPanel.hidden;
    setAlignmentMode(!debugPanel.hidden);
  }
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.closest(".modal"));

    if (lenis) {
      lenis.scrollTo(button.dataset.jump, {
        duration: 1.45,
      });
      return;
    }

    document.querySelector(button.dataset.jump)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});
/* =========================================================
   【这里是modal弹窗逻辑】替换结束
   ========================================================= */


/* =========================================================
   【这里是顶部按钮逻辑】替换开始
   ========================================================= */
const muteButton = document.querySelector(".global-mute-button");
const muteImg = document.querySelector(".global-mute-img");
let isMutedVisual = false;

if (muteButton && muteImg) {
  muteButton.addEventListener("click", () => {
    isMutedVisual = !isMutedVisual;

    muteButton.setAttribute("aria-pressed", String(isMutedVisual));
    muteImg.src = isMutedVisual
      ? "assets/images/buttons/buttons_p1/mute_2.png"
      : "assets/images/buttons/buttons_p1/mute_1.png";
    muteImg.alt = isMutedVisual ? "Muted" : "Mute";
  });
}
/* =========================================================
   【这里是顶部按钮逻辑】替换结束
   ========================================================= */


/* =========================================================
   【这里是debug参数配置】替换开始
   ========================================================= */
const topLeftLogoDebugConfig = [
  { label: "x", name: "top-left-x", min: 0, max: 30, step: 0.1, unit: "vw" },
  { label: "y", name: "top-left-y", min: 0, max: 20, step: 0.1, unit: "vh" },
  { label: "scale", name: "top-left-scale", min: 0.3, max: 2, step: 0.01, unit: "" },
  { label: "opacity", name: "top-left-opacity", min: 0, max: 1, step: 0.01, unit: "" },
];

const debugConfig = [
  { name: "lakeX", min: -700, max: 700, step: 1, unit: "px" },
  { name: "lakeY", min: -400, max: 400, step: 1, unit: "px" },
  { name: "lakeScale", min: 0.2, max: 3, step: 0.01, unit: "" },

  { name: "sceneX", min: -700, max: 700, step: 1, unit: "px" },
  { name: "sceneY", min: -400, max: 400, step: 1, unit: "px" },
  { name: "sceneScale", min: 0.2, max: 2, step: 0.01, unit: "" },
];
/* =========================================================
   【这里是debug参数配置】替换结束
   ========================================================= */


/* =========================================================
   【这里是debug工具函数】替换开始
   ========================================================= */
function cssVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim();
}

function setCssVar(name, value, unit) {
  document.documentElement.style.setProperty(`--${name}`, `${value}${unit}`);
}

function renderDebugValues() {
  const topLeftValues = topLeftLogoDebugConfig
    .map(({ name }) => `--${name}: ${cssVar(name)};`)
    .join("\n");

  const existingValues = debugConfig
    .map(({ name }) => `--${name}: ${cssVar(name)};`)
    .join("\n");

  document.getElementById("debugValues").textContent = `${topLeftValues}\n\n${existingValues}`;
}

function numberVar(name) {
  return Number.parseFloat(cssVar(name)) || 0;
}
/* =========================================================
   【这里是debug工具函数】替换结束
   ========================================================= */


/* =========================================================
   【这里是debug面板渲染】替换开始
   ========================================================= */
const controls = document.getElementById("debugControls");
const debugCollapse = document.getElementById("debugCollapse");

function setDebugCollapsed(collapsed) {
  debugPanel.dataset.collapsed = String(collapsed);
  debugCollapse.textContent = collapsed ? "+" : "−";
  debugCollapse.setAttribute("aria-expanded", String(!collapsed));
}

debugCollapse.addEventListener("click", () => {
  setDebugCollapsed(debugPanel.dataset.collapsed !== "true");
});

const topLeftGroup = document.createElement("fieldset");
topLeftGroup.className = "debug-group";

const topLeftLegend = document.createElement("legend");
topLeftLegend.textContent = "Top Left Logo";
topLeftGroup.append(topLeftLegend);

topLeftLogoDebugConfig.forEach(({ label, name, min, max, step, unit }) => {
  const row = document.createElement("label");
  row.className = "debug-control";

  const input = document.createElement("input");
  const value = document.createElement("span");

  input.type = "range";
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = Number.parseFloat(cssVar(name));
  value.textContent = cssVar(name);

  input.addEventListener("input", () => {
    setCssVar(name, input.value, unit);
    value.textContent = `${input.value}${unit}`;
    renderDebugValues();
  });

  row.append(label, input, value);
  topLeftGroup.append(row);
});

controls.append(topLeftGroup);

debugConfig.forEach(({ name, min, max, step, unit }) => {
  const row = document.createElement("label");
  row.className = "debug-control";

  const input = document.createElement("input");
  const value = document.createElement("span");

  input.type = "range";
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = Number.parseFloat(cssVar(name));
  value.textContent = cssVar(name);

  input.addEventListener("input", () => {
    setCssVar(name, input.value, unit);
    value.textContent = `${input.value}${unit}`;
    renderDebugValues();
  });

  row.append(name, input, value);
  controls.append(row);
});

renderDebugValues();
setAlignmentMode(!debugPanel.hidden);
/* =========================================================
   【这里是debug面板渲染】替换结束
   ========================================================= */


/* =========================================================
   【这里是page1雪花生成逻辑】替换开始
   ========================================================= */
function initSnow() {
  if (ENABLE_PAGE1_VIDEO_SCRUB) return;

  const heroScene = document.querySelector(".hero-scene");
  if (!heroScene) return;

  const snowLayer = document.createElement("div");
  snowLayer.className = "snow-layer";
  snowLayer.setAttribute("aria-hidden", "true");

  const SNOW_COUNT = reduceMotion ? 10 : 23;

  for (let i = 0; i < SNOW_COUNT; i += 1) {
    const flake = document.createElement("span");
    flake.className = "snowflake";

    const random = Math.random;
    const size = ((2 + random() * 4) * 2).toFixed(1);
    const duration = (10 + random() * 8).toFixed(1);
    const delay = (-random() * 18).toFixed(1);
    const drift = (14 + random() * 42).toFixed(1);
    const opacity = (0.12 + random() * 0.22).toFixed(2);
    const blur = (random() * 1.4).toFixed(1);

    flake.style.setProperty("--left", `${(random() * 100).toFixed(1)}%`);
    flake.style.setProperty("--size", `${size}px`);
    flake.style.setProperty("--duration", `${duration}s`);
    flake.style.setProperty("--delay", `${delay}s`);
    flake.style.setProperty("--drift", `${drift}px`);
    flake.style.setProperty("--opacity", opacity);
    flake.style.setProperty("--blur", `${blur}px`);

    snowLayer.appendChild(flake);
  }

  heroScene.appendChild(snowLayer);
}

initSnow();
/* =========================================================
   【这里是page1雪花生成逻辑】替换结束
   ========================================================= */


/* =========================================================
   【这里是运行状态标记】替换开始
   说明：用于确认 GSAP / Lenis / ScrollTrigger 已初始化。
   ========================================================= */
document.documentElement.dataset.motionRuntime = lenis ? "gsap-lenis-ready" : "gsap-native-scroll-ready";
document.documentElement.dataset.scrollTriggers = String(ScrollTrigger.getAll().length);
/* =========================================================
   【这里是运行状态标记】替换结束
   ========================================================= */
