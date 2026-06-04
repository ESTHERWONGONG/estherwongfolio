gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lenis = new Lenis({
  duration: reduceMotion ? 0.2 : 1.35,
  smoothWheel: true,
  lerp: 0.08,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const debugPanel = document.getElementById("debugPanel");

const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#page1",
    start: "top top",
    end: "+=180%",
    scrub: 1.15,
    pin: true,
    anticipatePin: 1,
  },
});

heroTl
  .to(".hero-scene", { "--sceneScale": 1.08, ease: "none" }, 0)
  .to(".hero-scene", { opacity: 0, ease: "power2.inOut" }, 0.78);

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

function setAlignmentMode(active) {
  if (active) {
    heroTl.pause(0);
  } else {
    heroTl.resume();
  }
}

const pendulums = [
  gsap.to(".circle-rig-001", { rotate: 8, duration: 2.7, repeat: -1, yoyo: true, ease: "sine.inOut" }),
  gsap.to(".circle-rig-002", { rotate: -7, duration: 2.35, repeat: -1, yoyo: true, ease: "sine.inOut" }),
  gsap.to(".circle-rig-003", { rotate: 9, duration: 3.1, repeat: -1, yoyo: true, ease: "sine.inOut" }),
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

const modals = [...document.querySelectorAll(".modal")];
let lastFocus = null;

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  lastFocus = document.activeElement;
  modal.hidden = false;
  gsap.fromTo(modal.querySelector(".modal-panel"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" });
  modal.querySelector("[data-modal-close]").focus();
}

function closeModal(modal) {
  modal.hidden = true;
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

document.querySelectorAll("[data-modal-open]").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.modalOpen));
});

document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", () => closeModal(button.closest(".modal")));
});

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") modals.filter((modal) => !modal.hidden).forEach(closeModal);
  if (event.key.toLowerCase() === "d") {
    debugPanel.hidden = !debugPanel.hidden;
    setAlignmentMode(!debugPanel.hidden);
  }
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.closest(".modal"));
    lenis.scrollTo(button.dataset.jump, { duration: 1.45 });
  });
});

const muteToggle = document.getElementById("muteToggle");
muteToggle.addEventListener("click", () => {
  muteToggle.textContent = "No Video";
  muteToggle.setAttribute("aria-pressed", "true");
});

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

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
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

document.documentElement.dataset.motionRuntime = "gsap-lenis-ready";
document.documentElement.dataset.scrollTriggers = String(ScrollTrigger.getAll().length);
