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
    bodyClass: "scene-awakening",
    cue: "Awakening",
    kicker: "Cloudborne Interface",
    lead: "在白龙掠过云海的瞬间，打开一座漂浮城堡的序章。",
    title: "Celestial Bridge",
    altitude: "9,860m",
    pass: "Northwest",
    light: "Golden Hour",
  },
  {
    key: "citadel",
    at: 3.6,
    bodyClass: "scene-citadel",
    cue: "Citadel Glow",
    kicker: "Sunlit Citadel",
    lead: "当日光落在城堡尖顶，界面只保留必要信息，让画面自己发声。",
    title: "Citadel Glow",
    altitude: "10,240m",
    pass: "East Arc",
    light: "Solar Veil",
  },
  {
    key: "descent",
    at: 7.1,
    bodyClass: "scene-descent",
    cue: "Cloud Descent",
    kicker: "Cloud Descent",
    lead: "云桥向深处延展，滚动内容像从雾气里浮出，保持空间连续。",
    title: "Cloud Descent",
    altitude: "8,430m",
    pass: "Lower Spiral",
    light: "Pearl Haze",
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
  document.body.classList.remove(...sceneCues.map((item) => item.bodyClass));
  document.body.classList.add(cue.bodyClass);
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

applyCue(sceneCues[0]);
tryPlay();
