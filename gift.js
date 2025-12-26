/* ========= Configuration ========= */
// 1. Theme Configuration
const themeColors = {
    purple: { primary: '#667eea', secondary: '#764ba2' },
    pink: { primary: '#ff6b9e', secondary: '#ffa6c1' },
    blue: { primary: '#4facfe', secondary: '#00f2fe' },
    sunset: { primary: '#fa709a', secondary: '#fee140' },
    green: { primary: '#0ba360', secondary: '#3cba92' },
    galaxy: { primary: '#667eea', secondary: '#ff6b9e' }
};

// 2. Parse URL/Storage Config
async function getAppConfig() {
    const params = new URLSearchParams(window.location.search);
    
    // A. Check for Database ID (?id=...)
    const id = params.get('id');
    if (id) {
        try {
            const res = await fetch('/api/get/' + id);
            if (res.ok) return await res.json();
        } catch (e) { console.error("API load failed", e); }
    }

    // B. Check for Legacy Data (?data=...)
    const data = params.get('data');
    if (data) {
        try {
            const json = decodeURIComponent(escape(atob(data)));
            return JSON.parse(json);
        } catch (e) { }
    }
    
    // C. Fallback to localStorage from index.html (if navigated from there)
    try {
        const stored = localStorage.getItem('birthday_share_config');
        if (stored) return JSON.parse(stored);
    } catch(e) {}
    return null;
}

// Global config container
let config = {};

// Initialization
async function initGift() {
    config = (await getAppConfig()) || {};
    applyConfig();
}

function applyConfig() {
    // 3. Apply Theme
    const configTheme = config.theme || config.t;
    // ... (logic continues below, we wrap it)



// 4. Hydrate Content
    const rName = config.recipientName || config.n;
    if (rName) {
        // Update recipient name in DOM
        document.querySelectorAll('h1').forEach(h => {
             if(h.textContent.includes('Tulip')) h.textContent = h.textContent.replace('Tulip', rName);
        });
    }

    // 5. Apply Text Content (Poem, Letter)
    if (config.poem) poemText = config.poem;
    if (config.letter) letterText = config.letter;
    
    // 6. Apply Media (Music, Photos, Memes)
    if (config.musicAfter) {
        const bgm = document.getElementById("bgmSong");
        if(bgm) bgm.src = config.musicAfter;
    }
    
    if (config.photos && config.photos.length > 0) {
        // Map base64 strings to objects expected by gallery
        photos = config.photos.map(p => ({ src: p, caption: "Beautiful Memory 💖" }));
    }
    
    if (config.memes && config.memes.length > 0) {
        memes = config.memes;
    }
    
    if (config.friends && config.friends.length > 0) {
        friendMessages = config.friends.map(f => ({
            name: f.name,
            text: f.message,
            createdAt: new Date().toISOString()
        }));
    }

    // FINAL: Unhide the page
    setTimeout(() => {
        const wrap = document.querySelector('.wrap');
        if(wrap) wrap.style.opacity = '1';
    }, 100);
}

const memes = [
  "image/adorable-cute.gif",
  "image/icegif-191.gif",
  "image/image.png",
  "image/love.gif",
  "image/tenor.gif",
  "image/5ea9969298974d0168463d6cd2642374.gif",
  "image/a01e1414b6628df4c8fa76da33a37c35.gif",
  "image/tenor (1).gif",
];

const friendMessages = (config.friends || config.f) ? 
    (config.friends || config.f).map(f => ({ name: f.name || f.n, text: f.message || f.m })) 
    : [
  {
    name: "Aarav",
    text: "Happy birthday! You light up every room — keep shining ✨",
  },
  {
    name: "Meera",
    text: "Hope this year brings you all the laughter and cake 🍰",
  },
  {
    name: "Rohan",
    text: "To more game nights and late chats — love you bro! 🥳",
  },
  {
    name: "Tara",
    text: "Your kindness inspires me. Have a magical birthday 💖",
  },
  {
    name: "Kabir",
    text: "Another year of epic memories — let's make more soon! 🚀",
  },
  {
    name: "Nisha",
    text: "You deserve the whole world. Happiest of birthdays! 🌟",
  },
];

const photos = [
  {
    src: "picture/7d685178-8d37-4ba5-a88b-ef71c0bf6e37.png",
    caption: "1st pic you shared to me 🤌🫶",
  },
  {
    src: "picture/02140ca8-319b-4bf4-83f6-68b8cf18bfbe.png",
    caption: "my LOVE💕",
  },
  {
    src: "picture/a9f19f15-fe55-4c47-a6d6-294b5f49fafa.png",
    caption: "Cutie 😍",
  },
  {
    src: "picture/b706d3d0-0a29-4ae4-b67c-c7c88d320d49.png",
    caption: "Meri Jaaneman",
  },
  {
    src: "picture/ChatGPT Image Aug 11, 2025, 09_21_49 PM.png",
    caption: "Mine FOREVER 😽😻😽",
  },
];

const poemText = config.poem || config.p || `तेरी हँसी में खिले हैं मेरे मौसम के सारे फूल,
तेरी नज़र से ही मिलता है दिल को अपना उसूल,
थाम ले हाथ मेरा, चलें ख़्वाबों की उस राह पर,
जहाँ तू हो, मैं रहूँ—और बाकी दुनिया सब फ़ज़ूल।`;

const letterText = config.letter || config.l || `Dear Jaan,

Tumhare special din pe bas yeh kehna hai ki tum meri zindagi ka sabse khoobsurat hissa ho.
Tum meri muskaan, mera safe place, aur meri sabse pyaari adventure ho.
Har smile, har hug, aur har moment ke liye dil se thanks.
Is saal tumhe woh saari khushiyan milein jo tumne mujhe di hain — aur bhi zyada.

Hamesha tera,
— Badal ❤️`;

/* ========= Confetti & Emoji FX ========= */
const EMOJIS = ["🎉", "🎊", "✨", "💖", "🎈", "🧁", "⭐"];
function spawnConfettiBurst(x, y, count = 18) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.position = "absolute";
    el.style.left = x + (Math.random() * 180 - 90) + "px";
    el.style.top = y + (Math.random() * 80 - 40) + "px";
    el.style.fontSize = 12 + Math.random() * 22 + "px";
    el.style.opacity = 1;
    el.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;
    el.style.transition = `transform ${
      1.2 + Math.random() * 1.2
    }s cubic-bezier(.2,.8,.3,1), opacity 1.3s`;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translateY(${
        120 + Math.random() * 300
      }px) translateX(${Math.random() * 200 - 100}px) rotate(${
        Math.random() * 720
      }deg) scale(${0.9 + Math.random() * 1.4})`;
      el.style.opacity = 0;
    });
    setTimeout(() => el.remove(), 1800);
  }
}

/* ========= Stage Management ========= */
let currentStage = 1;
const totalStages = 6;

function showStage(n) {
  for (let i = 1; i <= totalStages; i++) {
    const el = document.getElementById("st" + i);
    if (!el) continue;
    if (i === n) {
      el.classList.add("active");
      el.setAttribute("aria-hidden", "false");
    } else {
      el.classList.remove("active");
      el.setAttribute("aria-hidden", "true");
    }
  }
  currentStage = n;
  // ✅ Start BGM automatically on Stage 1
  if (n === 1 && bgm.paused) {
    bgm.play().catch(() => {
      console.log("Autoplay blocked — will play after first click.");
    });
  }
}

function cuteClickSpark(btn) {
  for (let i = 0; i < 6; i++) {
    const sp = document.createElement("div");
    sp.className = "sparkle";
    sp.textContent = ["✨", "💕", "🎀", "✨", "💫", "🌸"][
      Math.floor(Math.random() * 6)
    ];
    const r = btn.getBoundingClientRect();
    sp.style.left = r.left + r.width * Math.random() + "px";
    sp.style.top = r.top + r.height * Math.random() * 0.6 + "px";
        document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 900);
  }
}


/* ---- Stage 1: Meme Explosion ---- */
let memeInterval = null;
function startMemeStage() {
  memeInterval = setInterval(() => {
    if (currentStage !== 1) return;
    const img = document.createElement("img");
    img.src = memes[Math.floor(Math.random() * memes.length)];
    img.className = "meme";
    img.style.left = Math.random() * (window.innerWidth - 180) + 40 + "px";
    img.style.top = Math.random() * (window.innerHeight - 220) + 60 + "px";
    img.style.transform = `scale(${0.9 + Math.random() * 0.7})`;
    document.body.appendChild(img);
    setTimeout(() => img.remove(), 3500);
    if (Math.random() < 0.25)
      spawnConfettiBurst(
        parseFloat(img.style.left),
        parseFloat(img.style.top),
        10
      );
  }, 700);
}
function stopMemeStage() {
  clearInterval(memeInterval);
}

/* ---- Stage 2: Messages ---- */
async function startMessagesStage() {
  const container = document.getElementById("messages-container");
  container.innerHTML = "";

  // pull remote, or fall back to local list
  let messages = await fetchRemoteMessages();
  if (!messages.length) {
    messages = friendMessages; // your defaults
  }

  let i = 0;
  function nextMsg() {
    if (currentStage !== 2) return;
    if (i >= messages.length) {
      spawnConfettiBurst(window.innerWidth / 2, 150, 28);
      return;
    }
    const m = messages[i];
    const msg = document.createElement("div");
    msg.className = "msg";
    msg.innerHTML = `
      <div class="avatar">${(m.name || "?").charAt(0).toUpperCase()}</div>
      <div style="flex:1">
        <div class="who">${m.name || "Friend"}</div>
        <div class="text">${m.text}</div>
      </div>`;
    container.appendChild(msg);
    i++;
    setTimeout(nextMsg, 1200 + Math.random() * 700);
  }
  nextMsg();
}

/* ---- Stage 3: Memory Gallery ---- */
let galleryInterval = null;
let galleryIndex = 0;
function startGallery() {
  const imgEl = document.getElementById("galleryImg");
  const capEl = document.getElementById("galleryCaption");
  imgEl.style.display = 'block'; // Unhide
  imgEl.src = photos[0].src;
  capEl.textContent = photos[0].caption;
  galleryIndex = 0;
  galleryInterval = setInterval(() => {
    if (currentStage !== 3) return;
    galleryIndex = (galleryIndex + 1) % photos.length;
    imgEl.style.opacity = 0;
    setTimeout(() => {
      imgEl.src = photos[galleryIndex].src;
      capEl.textContent = photos[galleryIndex].caption;
      imgEl.style.opacity = 1;
      spawnConfettiBurst(window.innerWidth / 2, 120, 22);
    }, 520);
  }, 2000);
}
function stopGallery() {
  clearInterval(galleryInterval);
}

/* ---- Stage 4: Poem ---- */
function showPoem() {
  const box = document.getElementById("poemBox");
  box.innerHTML = "";
  poemText.split("\n").forEach((ln, idx) => {
    const p = document.createElement("div");
    p.style.opacity = 0;
    p.style.transform = "translateY(10px)";
    p.style.transition = `opacity .6s ease ${idx * 220}ms, transform .6s ease ${
      idx * 220
    }ms`;
    p.textContent = ln;
    box.appendChild(p);
    setTimeout(() => {
      p.style.opacity = 1;
      p.style.transform = "translateY(0)";
    }, 40);
  });
}

/* ---- Stage 5: Personal Letter ---- */
let typingTimer = null;
function bindSeal() {
  const seal = document.getElementById("sealBtn");
  const paper = document.getElementById("paper");
  seal.addEventListener(
    "click",
    () => {
      paper.classList.add("open");
      const el = document.createElement("div");
      el.className = "typewriter";
      paper.innerHTML = "";
      paper.appendChild(el);
      let i = 0;
      function type() {
        if (currentStage !== 5) return;
        if (i < letterText.length) {
          el.textContent += letterText.charAt(i);
          i++;
          typingTimer = setTimeout(type, 32 + Math.random() * 22);
        } else {
          document.getElementById("nextBtn5").classList.remove("hidden");
        }
      }
      setTimeout(type, 220);
    },
    { once: true }
  );
}

function spawnBalloonLoop() {
  setInterval(() => {
    if (currentStage === 6) spawnBalloon();
  }, 600);
}

/* ---- Navigation ---- */
function goToNext() {
  cuteClickSpark(document.querySelector(".next-btn"));

  // cleanup current stage
  if (currentStage === 1) stopMemeStage();
  if (currentStage === 3) stopGallery();
  if (currentStage === 5) clearTimeout(typingTimer);

  // move forward
  const next = Math.min(totalStages, currentStage + 1);
  showStage(next);

  // activate the new stage
  if (next === 1) startMemeStage();
  if (next === 2) startMessagesStage();
  if (next === 3) startGallery();
  if (next === 4) showPoem();
  if (next === 5) bindSeal();
  if (next === 6) spawnBalloonLoop();
}

/* ---- Event Bindings ---- */
document.getElementById("nextBtn1").addEventListener("click", goToNext);
document.getElementById("nextBtn2").addEventListener("click", goToNext);
document.getElementById("nextBtn3").addEventListener("click", goToNext);
document.getElementById("nextBtn4").addEventListener("click", goToNext);
document.getElementById("nextBtn5").addEventListener("click", goToNext);

document.querySelectorAll(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => cuteClickSpark(btn));
});

/* ---- Start ---- */

// ... (The previous code ends with event listeners)

    document.getElementById("st1").addEventListener("click", (e) => {
      if (currentStage === 1 && bgm.paused) bgm.play(); // start BGM on first click
      spawnConfettiBurst(e.clientX, e.clientY, 20);
    });
    showStage(1);
    startMemeStage();


// Start the app
initGift();
