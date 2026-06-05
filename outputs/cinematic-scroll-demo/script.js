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

const lenis = new Lenis({
  duration: reduceMotion ? 0.2 : 1.35,
  smoothWheel: true,
  lerp: 0.08,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

window.addEventListener("scroll", () => {
  const progress = Math.min(window.scrollY / window.innerHeight, 1);
  const lakeScale = 1 + progress * 0.05;
  document.documentElement.style.setProperty("--lakeScale", lakeScale.toFixed(3));
});

const debugPanel = document.getElementById("debugPanel");
/* =========================================================
   【这里是全局滚动初始化】替换结束
   ========================================================= */


/* =========================================================
   【这里是page1视频层】替换开始
   说明：创建 page1 的 hero 视频层。
   视频路径：assets/videos/hero-video.mp4
   ========================================================= */
const heroPage = document.querySelector("#page1");

const heroVideoLayer = document.createElement("div");
heroVideoLayer.className = "hero-video-layer";
heroVideoLayer.setAttribute("aria-hidden", "true");

const heroVideo = document.createElement("video");
heroVideo.className = "hero-video";
heroVideo.src = "assets/videos/hero-video.mp4";
heroVideo.muted = true;
heroVideo.playsInline = true;
heroVideo.preload = "auto";

heroVideoLayer.appendChild(heroVideo);
heroPage.appendChild(heroVideoLayer);
/* =========================================================
   【这里是page1视频层】替换结束
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

showHeroTitle();
/* =========================================================
   【这里是page1标题图层】替换结束
   ========================================================= */


/* =========================================================
   【这里是page1视频播放/重置函数】替换开始
   说明：
   - 向下滚动进入视频段时播放视频。
   - 向上滚回 page1 顶部时重置视频。
   ========================================================= */
let heroVideoStarted = false;
let heroVideoEnded = false;
let heroInitialStateVisible = true;

function playHeroVideo() {
  if (heroVideoStarted || reduceMotion) return;

  heroVideoStarted = true;
  heroVideoEnded = false;
  heroVideo.currentTime = 0;

  const playPromise = heroVideo.play();

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }
}

function resetHeroVideo() {
  heroVideo.pause();

  try {
    heroVideo.currentTime = 0;
  } catch (error) {
    // 某些浏览器在视频还没 ready 时设置 currentTime 可能报错，忽略即可。
  }

  heroVideoStarted = false;
  heroVideoEnded = false;
}
/* =========================================================
   【这里是page1视频播放/重置函数】替换结束
   ========================================================= */


/* =========================================================
   【这里是page1视频结束跳转】替换开始
   说明：视频播放结束后，如果还停留在 page1，则自动滚到 page2。
   ========================================================= */
heroVideo.addEventListener("ended", () => {
  heroVideoEnded = true;

  const page2 = document.querySelector("#page2");
  if (!page2) return;

  const page2Top = page2.getBoundingClientRect().top + window.scrollY;

  if (window.scrollY < page2Top - 20) {
    lenis.scrollTo("#page2", {
      duration: 1.25,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  }
});
/* =========================================================
   【这里是page1视频结束跳转】替换结束
   ========================================================= */


/* =========================================================
   【这里是page1初始状态重置】替换开始
   说明：
   - 解决问题 1：从 page2 往回滚 page1 时，不再停在视频最后一帧。
   - 解决问题 2：回到 page1 顶部时，标题图重新显示。
   ========================================================= */
function resetHeroToInitialState() {
  resetHeroVideo();

  gsap.set(".hero-scene", {
    opacity: 1,
  });

  gsap.set(".hero-video-layer", {
    opacity: 0,
  });

  gsap.set(".hero-title-layer", {
    opacity: 1,
    y: 0,
  });

  showHeroTitle();

  heroInitialStateVisible = true;
}

function leaveHeroInitialState() {
  if (!heroInitialStateVisible) return;

  heroInitialStateVisible = false;
  hideHeroTitle();
}
/* =========================================================
   【这里是page1初始状态重置】替换结束
   ========================================================= */

/* =========================================================
   【这里是page1滚动动画时间线】替换开始
   说明：
   - page1 pin 住。
   - 湖面场景轻微放大。
   - 标题淡出。
   - 视频层淡入。
   - 从 page2 往回滚时，直接跳回 page1 初始画面，不经过视频最后一帧。
   ========================================================= */

let isJumpingBackToHeroStart = false;

function jumpBackToHeroStart() {
  if (isJumpingBackToHeroStart) return;

  isJumpingBackToHeroStart = true;

  resetHeroToInitialState();

  const heroTop = heroPage.getBoundingClientRect().top + window.scrollY;

  // 先隐藏视频层，避免最后一帧闪烁
  gsap.set(".hero-video-layer", { opacity: 0 });
  gsap.set(".hero-scene", { opacity: 1 });
  gsap.set(".hero-title-layer", { opacity: 1, y: 0 });
  showHeroTitle();

  // 立即跳回 page1 顶部
  lenis.scrollTo(heroTop, { duration: 0.01, immediate: true });
  window.scrollTo(0, heroTop);

  requestAnimationFrame(() => {
    isJumpingBackToHeroStart = false;
  });
}

const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#page1",
    start: "top top",
    end: "+=280%",
    scrub: 1.15,
    pin: true,
    anticipatePin: 1,

    onUpdate: (self) => {
      if (isJumpingBackToHeroStart) return;

      // 滚回顶部，直接恢复初始状态
      if (self.progress <= 0.015) {
        resetHeroToInitialState();
        return;
      }

      // 离开第一页初始状态，标题淡出
      if (self.progress > 0.04) {
        leaveHeroInitialState();
      }

      // 向下滚动才播放视频
      if (self.progress > 0.34 && self.direction > 0) {
        playHeroVideo();
      }

      // 靠近开头时，视频重置
      if (self.progress < 0.08) {
        resetHeroVideo();
        gsap.set(".hero-video-layer", { opacity: 0 });
        gsap.set(".hero-scene", { opacity: 1 });
      }
    },

    // 从 page2 滚回 page1
    onEnterBack: () => {
      jumpBackToHeroStart();
    },

    onLeaveBack: () => {
      resetHeroToInitialState();
    },
  },
});

heroTl
  .to(".hero-scene", { "--sceneScale": 1.08, ease: "none" }, 0)
  .to(".hero-title-layer", { opacity: 0, y: -18, ease: "power2.inOut" }, 0.16)
  .to(".hero-video-layer", { opacity: 1, ease: "power2.inOut" }, 0.24)
  .to(".hero-scene", { opacity: 0, ease: "power2.inOut" }, 0.34)
  .to(".hero-video-layer", { opacity: 1, ease: "none" }, 0.78);

/* =========================================================
   【这里是page1滚动动画时间线】替换结束
   ========================================================= */


/* =========================================================
   【这里是page1船漂浮动画】替换开始
   ========================================================= */
gsap.to(":root", {
  "--boatDriftX": "11px",
  "--boatDriftY": "-7px",
  "--boatDriftRotate": "1.6deg",
  duration: 3.2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

gsap.to(":root", {
  "--boatDriftX": "-7px",
  duration: 4.7,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  delay: 0.4,
});
/* =========================================================
   【这里是page1船漂浮动画】替换结束
   ========================================================= */


/* =========================================================
   【这里是对齐调试模式】替换开始
   ========================================================= */
function setAlignmentMode(active) {
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
   【这里是page2圆形摆件动画】替换开始
   ========================================================= */
const pendulums = [
  gsap.to(".circle-rig-001", {
    rotate: 8,
    duration: 2.7,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  }),

  gsap.to(".circle-rig-002", {
    rotate: -7,
    duration: 2.35,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  }),

  gsap.to(".circle-rig-003", {
    rotate: 9,
    duration: 3.1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  }),
];

gsap.from(".circle-rig", {
  scrollTrigger: {
    trigger: "#page2",
    start: "top 70%",
    end: "top 25%",
    scrub: true,
  },
  y: -90,
  opacity: 0,
  stagger: 0.1,
  ease: "power2.out",
});

const middleCircle = document.querySelector("#portfolioCircle");

middleCircle.addEventListener("mouseenter", () => pendulums[1].pause());
middleCircle.addEventListener("mouseleave", () => pendulums[1].resume());
middleCircle.addEventListener("focus", () => pendulums[1].pause());
middleCircle.addEventListener("blur", () => pendulums[1].resume());
middleCircle.addEventListener("click", () => openModal("miniPortfolioModal"));
/* =========================================================
   【这里是page2圆形摆件动画】替换结束
   ========================================================= */


/* =========================================================
   【这里是page3内容入场动画】替换开始
   ========================================================= */
gsap.from(".static-content", {
  scrollTrigger: {
    trigger: "#page3",
    start: "top 80%",
    end: "top 35%",
    scrub: true,
  },
  opacity: 0,
  y: 80,
});
/* =========================================================
   【这里是page3内容入场动画】替换结束
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

    lenis.scrollTo(button.dataset.jump, {
      duration: 1.45,
    });
  });
});
/* =========================================================
   【这里是modal弹窗逻辑】替换结束
   ========================================================= */


/* =========================================================
   【这里是顶部按钮逻辑】替换开始
   ========================================================= */
const muteToggle = document.getElementById("muteToggle");

muteToggle.addEventListener("click", () => {
  muteToggle.textContent = "No Video";
  muteToggle.setAttribute("aria-pressed", "true");
});
/* =========================================================
   【这里是顶部按钮逻辑】替换结束
   ========================================================= */


/* =========================================================
   【这里是debug参数配置】替换开始
   ========================================================= */
const debugConfig = [
  { name: "lakeX", min: -700, max: 700, step: 1, unit: "px" },
  { name: "lakeY", min: -400, max: 400, step: 1, unit: "px" },
  { name: "lakeScale", min: 0.2, max: 3, step: 0.01, unit: "" },

  { name: "boatX", min: -700, max: 700, step: 1, unit: "px" },
  { name: "boatY", min: -60, max: 80, step: 0.5, unit: "vh" },
  { name: "boatScale", min: 0.05, max: 3, step: 0.01, unit: "" },
  { name: "boatOpacity", min: 0, max: 1, step: 0.01, unit: "" },
  { name: "boatRotate", min: -30, max: 30, step: 0.5, unit: "deg" },

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
  document.getElementById("debugValues").textContent = debugConfig
    .map(({ name }) => `--${name}: ${cssVar(name)};`)
    .join("\n");
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
  const heroScene = document.querySelector(".hero-scene");
  if (!heroScene) return;

  const snowLayer = document.createElement("div");
  snowLayer.className = "snow-layer";
  snowLayer.setAttribute("aria-hidden", "true");

  const SNOW_COUNT = reduceMotion ? 8 : 18;

  for (let i = 0; i < SNOW_COUNT; i += 1) {
    const flake = document.createElement("span");
    flake.className = "snowflake";

    const random = Math.random;
    const size = (2 + random() * 4).toFixed(1);
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
document.documentElement.dataset.motionRuntime = "gsap-lenis-ready";
document.documentElement.dataset.scrollTriggers = String(ScrollTrigger.getAll().length);
/* =========================================================
   【这里是运行状态标记】替换结束
   ========================================================= */