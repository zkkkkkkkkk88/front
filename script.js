const video = document.querySelector("#heroVideo");
const soundToggle = document.querySelector("#soundToggle");
const pauseToggle = document.querySelector("#pauseToggle");
const pauseLabel = pauseToggle.querySelector("span");
const sceneKicker = document.querySelector("#sceneKicker");
const sceneLead = document.querySelector("#sceneLead");
const sceneTitle = document.querySelector("#sceneTitle");
const sceneAltitude = document.querySelector("#sceneAltitude");
const scenePass = document.querySelector("#scenePass");
const sceneLight = document.querySelector("#sceneLight");
const timeFill = document.querySelector("#timeFill");
const timeCue = document.querySelector("#timeCue");
const routeCards = Array.from(document.querySelectorAll(".route-card"));

const sceneCues = [
  {
    key: "awakening",
    at: 0,
    cue: "觉醒",
    kicker: "云上之境",
    lead: "白龙掠过云海的瞬间，打开一座漂浮城堡的序章。",
    title: "天穹之桥",
    altitude: "9,860m",
    pass: "西北",
    light: "黄金时刻",
  },
  {
    key: "citadel",
    at: 3.6,
    cue: "城堡辉光",
    kicker: "日光城堡",
    lead: "当日光落在城堡尖顶，界面只保留必要信息，让画面自己发声。",
    title: "城堡辉光",
    altitude: "10,240m",
    pass: "东弧",
    light: "日冕纱幕",
  },
  {
    key: "descent",
    at: 7.1,
    cue: "云中下降",
    kicker: "云中下降",
    lead: "云桥向深处延展，滚动内容像从雾气里浮出，保持空间连续。",
    title: "云中下降",
    altitude: "8,430m",
    pass: "下旋",
    light: "珍珠薄雾",
  },
];

let activeCue = sceneCues[0];
let audioContext;
let gainNode;
let sourceNode;
let parallaxFrame = 0;

function boostVideoAudio() {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
    sourceNode = audioContext.createMediaElementSource(video);
    gainNode = audioContext.createGain();
    gainNode.gain.value = 1.8;
    sourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
  }
  audioContext.resume();
}

function syncVideoState() {
  document.body.classList.toggle("has-sound", !video.muted);
  document.body.classList.toggle("video-paused", video.paused);
  pauseLabel.textContent = video.paused ? "播放" : "暂停";
}

function setReady() {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
}

async function tryPlay() {
  video.volume = 1;
  try {
    await video.play();
  } catch {
    document.body.classList.add("video-paused");
  }
  syncVideoState();
}

function cueForTime(time) {
  return sceneCues.reduce((current, cue) => (time >= cue.at ? cue : current), sceneCues[0]);
}

function applyCue(cue) {
  if (cue === activeCue) return;
  activeCue = cue;
  sceneKicker.textContent = cue.kicker;
  sceneLead.textContent = cue.lead;
  sceneTitle.textContent = cue.title;
  sceneAltitude.textContent = cue.altitude;
  scenePass.textContent = cue.pass;
  sceneLight.textContent = cue.light;
  timeCue.textContent = cue.cue;
  routeCards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.cue === cue.key);
  });
}

function syncTimeline() {
  const duration = video.duration || 10;
  const progress = Math.min(100, Math.max(0, (video.currentTime / duration) * 100));
  document.documentElement.style.setProperty("--progress", `${progress}%`);
  if (timeFill) {
    timeFill.style.setProperty("--progress", `${progress}%`);
  }
  if (timeCue) {
    timeCue.style.setProperty("--progress", `${progress}%`);
  }
  applyCue(cueForTime(video.currentTime));
}

function setParallax(event) {
  if (parallaxFrame) cancelAnimationFrame(parallaxFrame);
  parallaxFrame = requestAnimationFrame(() => {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    document.documentElement.style.setProperty("--parallax-x", x.toFixed(2));
    document.documentElement.style.setProperty("--parallax-y", y.toFixed(2));
  });
}

soundToggle.addEventListener("click", async () => {
  video.muted = !video.muted;
  video.volume = 1;
  if (!video.muted) {
    boostVideoAudio();
  }
  if (!video.muted && video.paused) {
    await tryPlay();
  }
  syncVideoState();
});

pauseToggle.addEventListener("click", async () => {
  if (video.paused) {
    await tryPlay();
  } else {
    video.pause();
  }
  syncVideoState();
});

window.addEventListener("pointermove", setParallax, { passive: true });
video.addEventListener("loadeddata", setReady, { once: true });
video.addEventListener("canplay", setReady, { once: true });
video.addEventListener("timeupdate", syncTimeline);
video.addEventListener("play", syncVideoState);
video.addEventListener("pause", syncVideoState);
video.addEventListener("volumechange", syncVideoState);
window.setTimeout(setReady, 1800);

/* ========== 暗度控制 ========== */

const themeToggle = document.querySelector("#themeToggle");
const themeControl = document.querySelector(".theme-control");
const dimPanel = document.querySelector("#dimPanel");
const dimTrack = document.querySelector("#dimTrack");
const dimFill = document.querySelector("#dimFill");
const dimThumb = document.querySelector("#dimThumb");
const dimLabel = document.querySelector("#dimLabel");
const videoDarken = document.querySelector(".video-darken");
const dragonGlow = document.querySelector(".dragon-glow");

// 颜色定义 [r, g, b]
const colorDefs = {
  ink:        [[255, 248, 235], [168, 210, 235]],
  muted:      [[255, 248, 235], [180, 210, 235]],
  soft:       [[255, 248, 235], [180, 210, 235]],
  line:       [[255, 248, 235], [170, 210, 232]],
  glass:      [[24, 31, 38],   [6, 14, 30]],
  gold:       [[255, 217, 138], [88, 165, 218]],
  aqua:       [[183, 241, 255], [110, 185, 225]],
  rose:       [[243, 173, 192], [120, 160, 210]],
  shadow:     [[0, 0, 0],      [0, 10, 30]],
  bodyBg:     [[17, 24, 32],   [3, 10, 22]],
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(day, night, t) {
  const r = Math.round(lerp(day[0], night[0], t));
  const g = Math.round(lerp(day[1], night[1], t));
  const b = Math.round(lerp(day[2], night[2], t));
  return `${r}, ${g}, ${b}`;
}

function applyDim(value) {
  const t = value / 100;
  const root = document.documentElement;

  // 插值颜色变量
  root.style.setProperty("--ink", `rgb(${lerpColor(colorDefs.ink[0], colorDefs.ink[1], t)})`);
  root.style.setProperty("--muted", `rgba(${lerpColor(colorDefs.muted[0], colorDefs.muted[1], t)}, ${lerp(0.72, 0.58, t).toFixed(2)})`);
  root.style.setProperty("--soft", `rgba(${lerpColor(colorDefs.soft[0], colorDefs.soft[1], t)}, ${lerp(0.12, 0.07, t).toFixed(2)})`);
  root.style.setProperty("--line", `rgba(${lerpColor(colorDefs.line[0], colorDefs.line[1], t)}, ${lerp(0.24, 0.14, t).toFixed(2)})`);
  root.style.setProperty("--glass", `rgba(${lerpColor(colorDefs.glass[0], colorDefs.glass[1], t)}, ${lerp(0.42, 0.58, t).toFixed(2)})`);
  root.style.setProperty("--glass-strong", `rgba(${lerpColor(colorDefs.glass[0], colorDefs.glass[1], t)}, ${lerp(0.62, 0.78, t).toFixed(2)})`);
  root.style.setProperty("--gold", `rgb(${lerpColor(colorDefs.gold[0], colorDefs.gold[1], t)})`);
  root.style.setProperty("--aqua", `rgb(${lerpColor(colorDefs.aqua[0], colorDefs.aqua[1], t)})`);
  root.style.setProperty("--rose", `rgb(${lerpColor(colorDefs.rose[0], colorDefs.rose[1], t)})`);
  root.style.setProperty("--shadow", `0 28px 90px rgba(${lerpColor(colorDefs.shadow[0], colorDefs.shadow[1], t)}, ${lerp(0.42, 0.58, t).toFixed(2)})`);
  root.style.setProperty("--body-bg", `rgb(${lerpColor(colorDefs.bodyBg[0], colorDefs.bodyBg[1], t)})`);

  // 场景变暗
  const darkAlpha = (t * 0.55).toFixed(3);
  videoDarken.style.background = `rgba(2, 8, 24, ${darkAlpha})`;

  // 龙影光晕 - 与暗度反向
  const glowAlpha = (t * 0.85).toFixed(3);
  dragonGlow.style.opacity = glowAlpha;

  // 刻度 UI 更新
  dimFill.style.height = `${value}%`;
  dimThumb.style.bottom = `${value}%`;
  dimLabel.textContent = `暗度 ${Math.round(value)}`;

  // 图标切换
  themeControl.classList.toggle("is-dimmed", value > 10);

  // 存储
  localStorage.setItem("dim", value);
}

// 面板开关
themeToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  dimPanel.classList.toggle("is-open");
});

// 点击外部关闭
document.addEventListener("click", (e) => {
  if (!themeControl.contains(e.target)) {
    dimPanel.classList.remove("is-open");
  }
});

// 拖拽交互
let isDragging = false;

function dimFromEvent(e) {
  const rect = dimTrack.getBoundingClientRect();
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  const ratio = 1 - (y - rect.top) / rect.height;
  return Math.round(Math.min(100, Math.max(0, ratio * 100)));
}

dimTrack.addEventListener("mousedown", (e) => {
  isDragging = true;
  applyDim(dimFromEvent(e));
});

dimThumb.addEventListener("mousedown", (e) => {
  isDragging = true;
  e.stopPropagation();
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  applyDim(dimFromEvent(e));
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

// 触摸支持
dimTrack.addEventListener("touchstart", (e) => {
  isDragging = true;
  applyDim(dimFromEvent(e));
}, { passive: true });

window.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  applyDim(dimFromEvent(e));
}, { passive: true });

window.addEventListener("touchend", () => {
  isDragging = false;
});

// 初始化
const savedDim = localStorage.getItem("dim");
applyDim(savedDim !== null ? Number(savedDim) : 0);

applyCue(sceneCues[0]);
tryPlay();
