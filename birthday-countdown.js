// Set target to tomorrow at 3:15 PM for demo purposes
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
tomorrow.setHours(15, 15, 0, 0);

const TARGET = tomorrow;
const ONTIME_DURATION = 30 * 1000;

const musicBefore = document.getElementById("musicBefore");
const musicOnTime = document.getElementById("musicOnTime");
const musicAfter = document.getElementById("musicAfter");
const autoplayNote = document.getElementById("autoplayNote");

let reached = false;
let confettiInterval = null;
let stage = "before"; // before | ontime | after

// ===== PLAY HELPER =====
async function tryPlay(audio) {
  try {
    await audio.play();
  } catch {
    console.log("Autoplay blocked, waiting for user interaction.");
  }
}

// Unlock audio on user gesture if blocked
function primeAudioOnGesture() {
  if (stage === "before") tryPlay(musicBefore);
  else if (stage === "ontime") tryPlay(musicOnTime);
  else if (stage === "after") tryPlay(musicAfter);
  window.removeEventListener("click", primeAudioOnGesture);
  window.removeEventListener("touchend", primeAudioOnGesture);
}

const overlay = document.getElementById("overlay");

overlay.addEventListener("click", () => {
  // Remove overlay
  overlay.remove();
});

window.addEventListener("click", primeAudioOnGesture);
window.addEventListener("touchend", primeAudioOnGesture);

// ===== COUNTDOWN =====
function pad(n) {
  return String(n).padStart(2, "0");
}
function renderCountdown(diffMs) {
  const totalSec = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSec / 86400);
  const hrs = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  document.getElementById("d").textContent = days;
  document.getElementById("h").textContent = hrs;
  document.getElementById("m").textContent = mins;
  document.getElementById("s").textContent = secs;
  const bigH = days * 24 + hrs;
  document.getElementById("bigTime").textContent = `${pad(bigH)}:${pad(
    mins
  )}:${pad(secs)}`;
}

// --- 15-word counter + submit to Netlify Function ---
(function () {
  const form = document.getElementById("guestbookForm");
  if (!form) return;

  const nameEl = document.getElementById("guestName");
  const msgEl = document.getElementById("guestMessage");
  const helpEl = document.getElementById("wordHelp");
  const submitBtn = document.getElementById("guestSubmit");
  const noteEl = document.getElementById("guestNote");

  function countWords(s) {
    return s.trim().split(/\s+/).filter(Boolean).length;
  }

  function updateCounter() {
    const wc = countWords(msgEl.value);
    helpEl.textContent = `${wc} / 15 words`;
    helpEl.style.color = wc > 15 ? "#ff6b9e" : "var(--muted)";
    submitBtn.disabled = wc === 0 || wc > 15;
  }

  msgEl.addEventListener("input", updateCounter);
  updateCounter();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameEl.value.trim();
    const message = msgEl.value.trim();
    if (!name || !message) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      // Use LocalStorage for demo purposes instead of Netlify
      // const res = await fetch("/.netlify/functions/saveMessage", ...);
      
      const DEMO_KEY = "birthday_demo_messages";
      const messages = JSON.parse(localStorage.getItem(DEMO_KEY) || "[]");
      messages.push({
          name: name,
          message: message,
          createdAt: new Date().toISOString()
      });
      localStorage.setItem(DEMO_KEY, JSON.stringify(messages));

      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));

      form.reset();
      updateCounter();
      noteEl.hidden = false;
      noteEl.textContent = "Thanks! Your wish is saved 💖 (Demo Mode)";
      submitBtn.textContent = "Sent ✅";
      setTimeout(() => {
        submitBtn.textContent = "Send Wish 💌";
        submitBtn.disabled = false;
        noteEl.hidden = true;
      }, 2000);
    } catch (err) {
      noteEl.hidden = false;
      noteEl.textContent = "Couldn’t send. Please try again.";
      submitBtn.textContent = "Send Wish 💌";
      submitBtn.disabled = false;
      console.error(err);
    }
  });
})();

// ===== MUSIC CONTROL =====
function startBeforeMusic() {
  stage = "before";
  localStorage.setItem("stage", stage);
  tryPlay(musicBefore);
}

function onReachMidnight() {
  stage = "ontime";
  localStorage.setItem("stage", stage);

  musicBefore.pause();
  musicBefore.currentTime = 0;
  musicOnTime.currentTime = 0;
  musicOnTime.play().catch(() => autoplayNote?.removeAttribute("hidden"));

  // After ONTIME_DURATION, go to AFTER stage
  setTimeout(() => {
    if (stage === "ontime") startAfterMusic();
  }, ONTIME_DURATION);

  switchToBirthdayScreen();
  startConfettiContinuous();
}

function startAfterMusic() {
  stage = "after";
  localStorage.setItem("stage", stage);

  musicOnTime.pause();
  musicOnTime.currentTime = 0;
  musicAfter.currentTime = 0;
  musicAfter.play().catch(() => autoplayNote?.removeAttribute("hidden"));
}

// ===== SCREEN =====
function switchToBirthdayScreen() {
  const tpl = document
    .getElementById("birthdayTemplate")
    .content.cloneNode(true);
  document.getElementById("app").replaceWith(tpl);
  const giftBtn = document.getElementById("giftBtn");
  if (giftBtn) {
    giftBtn.addEventListener("click", () => {
      musicAfter.pause();
      startConfettiContinuous();
      window.open("gift.html", "_blank");
    });
  }
}

// ===== CONFETTI =====
const EMOJIS = ["🎉", "🎈", "🎂", "✨", "💖", "🎊", "🧁", "⭐", "💫"];
function spawnEmoji() {
  const el = document.createElement("div");
  el.className = "confetti";
  el.textContent = EMOJIS[(Math.random() * EMOJIS.length) | 0];
  const startX = Math.random() * window.innerWidth;
  const xEnd = Math.random() * 120 - 60;
  const duration = (6 + Math.random() * 5).toFixed(2) + "s";
  el.style.left = startX + "px";
  el.style.setProperty("--x", "0px");
  el.style.setProperty("--x-end", xEnd + "px");
  el.style.setProperty("--dur", duration);
  document.getElementById("confetti-container").appendChild(el);
  el.addEventListener("animationend", () => el.remove());
  setTimeout(() => el.remove(), 15000);
}
function startConfettiContinuous() {
  for (let i = 0; i < 40; i++) spawnEmoji();
  confettiInterval = setInterval(() => {
    for (let i = 0; i < 5; i++) spawnEmoji();
  }, 500);
  setTimeout(() => {
    clearInterval(confettiInterval);
    confettiInterval = null;
  }, 30000);
}

// ===== INITIAL LOAD CHECK =====
(function init() {
  const now = Date.now();
  const targetTime = TARGET.getTime();

  if (now >= targetTime + ONTIME_DURATION) {
    // AFTER stage
    startAfterMusic();
    switchToBirthdayScreen();
  } else if (now >= targetTime) {
    // ONTIME stage
    onReachMidnight();
  } else {
    // BEFORE stage
    startBeforeMusic();
    const timer = setInterval(() => {
      const diff = TARGET.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        onReachMidnight();
      } else renderCountdown(diff);
    }, 1000);
    renderCountdown(targetTime - now);
  }
})();
