// Store uploaded files as base64
let uploadedFiles = {
    musicBefore: null,
    musicOnTime: null,
    musicAfter: null,
    photos: [],
    memes: []
};

let friends = [{name: 'Aarav', message: 'Happy birthday! You light up every room — keep shining ✨'}];
let generatedWindow = null;
let selectedTheme = 'galaxy';

// Theme colors mapping
const themeColors = {
    purple: { primary: '#667eea', secondary: '#764ba2' },
    pink: { primary: '#ff6b9e', secondary: '#ffa6c1' },
    blue: { primary: '#4facfe', secondary: '#00f2fe' },
    sunset: { primary: '#fa709a', secondary: '#fee140' },
    green: { primary: '#0ba360', secondary: '#3cba92' },
    galaxy: { primary: '#667eea', secondary: '#ff6b9e' }
};

// Handle theme selection
document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        selectedTheme = this.dataset.theme;
    });
});

// File to base64 converter
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Handle music uploads
document.getElementById('musicBefore').addEventListener('change', async (e) => {
    if (e.target.files[0]) {
        uploadedFiles.musicBefore = await fileToBase64(e.target.files[0]);
    }
});

document.getElementById('musicOnTime').addEventListener('change', async (e) => {
    if (e.target.files[0]) {
        uploadedFiles.musicOnTime = await fileToBase64(e.target.files[0]);
    }
});

document.getElementById('musicAfter').addEventListener('change', async (e) => {
    if (e.target.files[0]) {
        uploadedFiles.musicAfter = await fileToBase64(e.target.files[0]);
    }
});

// Handle photo uploads
document.getElementById('photos').addEventListener('change', async (e) => {
    const preview = document.getElementById('photoPreview');
    
    for (let file of e.target.files) {
        const base64 = await fileToBase64(file);
        const index = uploadedFiles.photos.length;
        uploadedFiles.photos.push(base64);
        
        const wrapper = document.createElement('div');
        wrapper.className = 'preview-wrapper';
        wrapper.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = base64;
        img.className = 'preview-item';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => removePhoto(index);
        
        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);
        preview.appendChild(wrapper);
    }
    
    // Clear the input so same file can be selected again
    e.target.value = '';
});

function removePhoto(index) {
    uploadedFiles.photos.splice(index, 1);
    renderPhotoPreviews();
}

function renderPhotoPreviews() {
    const preview = document.getElementById('photoPreview');
    preview.innerHTML = '';
    
    if (uploadedFiles.photos.length === 0) {
        preview.innerHTML = '<div class="empty-state">No photos uploaded yet 📷</div>';
        return;
    }
    
    uploadedFiles.photos.forEach((base64, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'preview-wrapper';
        wrapper.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = base64;
        img.className = 'preview-item';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => removePhoto(index);
        
        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);
        preview.appendChild(wrapper);
    });
}

// Handle meme uploads
document.getElementById('memes').addEventListener('change', async (e) => {
    const preview = document.getElementById('memePreview');
    
    for (let file of e.target.files) {
        const base64 = await fileToBase64(file);
        const index = uploadedFiles.memes.length;
        uploadedFiles.memes.push(base64);
        
        const wrapper = document.createElement('div');
        wrapper.className = 'preview-wrapper';
        wrapper.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = base64;
        img.className = 'preview-item';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => removeMeme(index);
        
        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);
        preview.appendChild(wrapper);
    }
    
    // Clear the input so same file can be selected again
    e.target.value = '';
});

function removeMeme(index) {
    uploadedFiles.memes.splice(index, 1);
    renderMemePreviews();
}

function renderMemePreviews() {
    const preview = document.getElementById('memePreview');
    preview.innerHTML = '';
    
    if (uploadedFiles.memes.length === 0) {
        preview.innerHTML = '<div class="empty-state">No memes uploaded yet 🎉</div>';
        return;
    }
    
    uploadedFiles.memes.forEach((base64, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'preview-wrapper';
        wrapper.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = base64;
        img.className = 'preview-item';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => removeMeme(index);
        
        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);
        preview.appendChild(wrapper);
    });
}

// Friend message management
function addFriend() {
    const container = document.getElementById('friendsContainer');
    const index = friends.length;
    
    const div = document.createElement('div');
    div.className = 'friend-input';
    div.innerHTML = '<div class="friend-number">' + (index + 1) + '</div>' +
                    '<input type="text" placeholder="Friend\'s Name" class="friend-name">' +
                    '<textarea placeholder="Their message..." class="friend-message"></textarea>' +
                    '<button class="btn btn-danger" onclick="removeFriend(' + index + ')">Remove</button>';
    
    container.appendChild(div);
    friends.push({ name: '', message: '' });
}

function removeFriend(index) {
    const container = document.getElementById('friendsContainer');
    container.children[index].remove();
    friends.splice(index, 1);
}

// Collect friend messages
function collectFriendMessages() {
    const container = document.getElementById('friendsContainer');
    const friendInputs = container.querySelectorAll('.friend-input');
    
    friends = [];
    friendInputs.forEach(input => {
        const name = input.querySelector('.friend-name').value;
        const message = input.querySelector('.friend-message').value;
        if (name && message) {
            friends.push({ name, message });
        }
    });
    
    return friends;
}

// Generate the complete website
function generateWebsite() {
    const recipientName = document.getElementById('recipientName').value || 'Special Person';
    const birthdayDate = document.getElementById('birthdayDate').value;
    const creatorName = document.getElementById('creatorName').value || 'Someone Special';
    const poem = document.getElementById('poem').value;
    const letter = document.getElementById('letter').value;
    
    if (!birthdayDate) {
        alert('Please select a birthday date and time!');
        return;
    }
    
    collectFriendMessages();
    
    // Generate configuration object
    const config = {
        recipientName,
        birthdayDate,
        creatorName,
        poem,
        letter,
        theme: selectedTheme,
        friends: friends.map(f => ({ name: f.name, message: f.message })),
        // Include base64 images if present (assuming file inputs read them into uploadedFiles)
        photos: uploadedFiles.photos,
        memes: uploadedFiles.memes
        // Music handles are typically URLs or Base64. 
        // If they are local blobs, they can't be sent easily without converting to Base64 first in editor logic.
        // Assuming current editor.js reads them as DataURLs (which it likely does for preview).
        // If not, we might need to adjust, but for now we pass what we have.
    };
    
    // Show Loading
    const resultDiv = document.getElementById('result');
    resultDiv.classList.add('show');
    resultDiv.innerHTML = '<p>⏳ Saving your website...</p>';

    // Send to Server
    fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const shareUrl = window.location.origin + '/view/' + data.id;
             resultDiv.innerHTML = `
                <h3>🎉 Your Link is Ready!</h3>
                <p>Copy this link and send it to ${recipientName}:</p>
                <div style="background:#fff;padding:10px;border-radius:8px;color:#333;word-break:break-all;margin:10px 0;font-family:monospace;font-size:0.9rem">
                    ${shareUrl}
                </div>
                <div style="display:flex;gap:10px;justify-content:center">
                    <button onclick="navigator.clipboard.writeText('${shareUrl}').then(()=>alert('Copied!'))" class="cta-button" style="padding:10px 20px;font-size:1rem">📋 Copy Link</button>
                    <a href="${shareUrl}" target="_blank" class="cta-button cta-secondary" style="padding:10px 20px;font-size:1rem;text-decoration:none">👀 View Site</a>
                </div>
            `;
        } else {
             resultDiv.innerHTML = `<p style="color:red">Error: ${data.error || 'Failed to save'}</p>`;
        }
    })
    .catch(err => {
        console.error(err);
        resultDiv.innerHTML = `<p style="color:red">Network Error: Could not save.</p>`;
    });
}



function showPreview() {
    const recipientName = document.getElementById('recipientName').value || 'Special Person';
    const birthdayDate = document.getElementById('birthdayDate').value;
    const creatorName = document.getElementById('creatorName').value || 'Someone Special';
    const poem = document.getElementById('poem').value;
    const letter = document.getElementById('letter').value;
    
    if (!birthdayDate) {
        alert('Please select a birthday date and time!');
        return;
    }
    
    collectFriendMessages();
    
    // Generate both pages
    const giftHTML = generateGiftHTML(recipientName, creatorName, poem, letter, friends, uploadedFiles.photos, uploadedFiles.memes, uploadedFiles.musicAfter, birthdayDate);
    const indexHTML = generateIndexHTML(recipientName, birthdayDate, creatorName, giftHTML);
    
    // Open phone-sized preview window
    const previewWindow = window.open('', 'preview', 'width=375,height=667,resizable=yes,scrollbars=yes');
    previewWindow.document.write(indexHTML);
    previewWindow.document.close();
}


function generateIndexHTML(recipientName, birthdayDate, creatorName, giftHTMLContent, selectedTheme) {
    const musicBeforeSrc = uploadedFiles.musicBefore || '';
    const musicOnTimeSrc = uploadedFiles.musicOnTime || '';
    const musicAfterSrc = uploadedFiles.musicAfter || '';
    
    // Use btoa to encode the gift HTML as base64
    const giftHTMLBase64 = btoa(unescape(encodeURIComponent(giftHTMLContent)));
    
    const colors = themeColors[selectedTheme] || themeColors.galaxy;

    return '<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'<meta charset="utf-8">' +
'<meta name="viewport" content="width=device-width, initial-scale=1">' +
'<title>Happy Birthday ' + recipientName + '</title>' +
'<style>' +
':root{--bg:#0f0f14;--card:#171a27;--text:#f7f7fb;--muted:#b7b7c9;--accent:' + colors.primary + ';--accent2:' + colors.secondary + '}' +
'html,body{height:100%}' +
'body{margin:0;background:radial-gradient(1200px 1200px at 50% -200px,#1c2034,#0f0f14);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;overflow:hidden}' +
'.center-wrap{position:relative;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}' +
'.card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:28px 24px;max-width:780px;width:100%;box-shadow:0 10px 40px rgba(0,0,0,0.3)}' +
'h1.title{font-size:clamp(1.5rem,3vw,2rem);margin:0 0 10px;color:var(--accent)}' +
'.muted{color:var(--muted);margin:0 0 18px}' +
'.countdown{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin:6px 0 10px}' +
'.timebox{min-width:110px;background:#141826;border:1px solid #262b45;border-radius:14px;padding:14px}' +
'.num{font-size:2.2rem;font-weight:800;color:var(--accent2)}' +
'.label{font-size:0.9rem;color:var(--muted)}' +
'.big-time{font-size:clamp(2.2rem,8vw,4rem);font-weight:900;letter-spacing:1px;color:#eaf9ff}' +
'.actions{margin-top:12px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}' +
'button,.btn{appearance:none;border:none;border-radius:12px;padding:12px 16px;cursor:pointer;font-weight:700;background:linear-gradient(135deg,var(--accent),#ffa6c1);color:#0b0b0f}' +
'.ghost{background:#23273a;color:var(--text);border:1px solid #2d3250}' +
'.happy{font-size:clamp(2.2rem,7vw,4.2rem);font-weight:900;margin:6px 0 10px;background:linear-gradient(135deg,#ffd166,#ff6b9e 40%,#7cf6d7 80%);-webkit-background-clip:text;background-clip:text;color:transparent}' +
'.subtitle{color:var(--muted);margin-top:6px}' +
'#confetti-container{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:10}' +
'.confetti{position:absolute;top:-2.5rem;font-size:1.8rem;animation:fall linear var(--dur) forwards;transform:translateY(-100%);will-change:transform}' +
'@keyframes fall{0%{transform:translate3d(var(--x,0),-10%,0) rotate(0deg);opacity:1}100%{transform:translate3d(var(--x-end,0),110vh,0) rotate(720deg);opacity:0.95}}' +
'.notice{margin-top:8px;font-size:0.95rem;color:var(--muted)}' +
'.gift-box{font-size:2rem;background:linear-gradient(135deg,gold,orange);border:none;border-radius:12px;padding:16px 20px;cursor:pointer;transition:transform 0.2s ease}' +
'.gift-box:hover{transform:scale(1.1) rotate(5deg)}' +
'</style>' +
'</head>' +
'<body>' +
'<div id="overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer">' +
'<span style="color:white;font-size:1.5rem;font-weight:700;text-align:center"><h2>TAP</h2><h4>to get in</h4></span>' +
'</div>' +
'<div id="confetti-container" aria-hidden="true"></div>' +
'<div class="center-wrap">' +
'<div class="card" id="app">' +
'<h1 class="title">Countdown to Midnight</h1>' +
'<p class="muted">We\'re counting down to 00:00 for the big surprise.</p>' +
'<div id="bigTime" class="big-time">00:00:00</div>' +
'<div class="countdown" aria-live="polite" role="timer">' +
'<div class="timebox"><div class="num" id="d">0</div><div class="label">Days</div></div>' +
'<div class="timebox"><div class="num" id="h">0</div><div class="label">Hours</div></div>' +
'<div class="timebox"><div class="num" id="m">0</div><div class="label">Minutes</div></div>' +
'<div class="timebox"><div class="num" id="s">0</div><div class="label">Seconds</div></div>' +
'</div>' +
'<form id="guestbookForm" style="margin:12px 0 18px;text-align:left">' +
'<div style="display:grid;gap:8px">' +
'<input id="guestName" type="text" placeholder="Your name" required maxlength="40" style="padding:10px;border-radius:10px;border:1px solid #2d3250;background:#141826;color:#eaf9ff">' +
'<textarea id="guestMessage" placeholder="Your message (max 15 words)" required rows="2" style="padding:10px;border-radius:10px;border:1px solid #2d3250;background:#141826;color:#eaf9ff;resize:vertical"></textarea>' +
'<div class="muted" id="wordHelp">0 / 15 words</div>' +
'<button type="submit" class="btn" id="guestSubmit">Send Wish 💌</button>' +
'<div class="muted" id="guestNote" hidden>Thanks! Your wish is saved.</div>' +
'</div>' +
'</form>' +
'</div>' +
'</div>' +
'<template id="birthdayTemplate">' +
'<div class="card">' +
'<div class="happy">Happy Birthday!</div>' +
'<h1>🎂🎉</h1>' +
'<p class="subtitle">Wishing you a day filled with love, laughter, and sweet surprises.</p>' +
'<div class="actions">' +
'<button id="giftBtn" class="gift-box" aria-label="Open your gift">🎁</button>' +
'</div>' +
'</div>' +
'</template>' +
'<audio id="musicBefore" src="' + musicBeforeSrc + '" preload="auto"></audio>' +
'<audio id="musicOnTime" src="' + musicOnTimeSrc + '" preload="auto"></audio>' +
'<audio id="musicAfter" src="' + musicAfterSrc + '" preload="auto"></audio>' +
'<script>' +
generateIndexJS(birthdayDate, recipientName, creatorName, giftHTMLBase64) +
'<\/script>' +
'</body>' +
'</html>';
}


function generateIndexJS(birthdayDate, recipientName, creatorName, giftHTMLBase64) {
    return 'const GIFT_HTML_B64="' + giftHTMLBase64 + '";' +
'function decodeGiftHTML(){return decodeURIComponent(escape(atob(GIFT_HTML_B64)))}' +
'const TARGET=new Date("' + birthdayDate + '");' +
'const MESSAGES_KEY="birthday_messages_"+TARGET.getTime();' +
'const ONTIME_DURATION=30*1000;' +
'const musicBefore=document.getElementById("musicBefore");' +
'const musicOnTime=document.getElementById("musicOnTime");' +
'const musicAfter=document.getElementById("musicAfter");' +
'let reached=false;' +
'let confettiInterval=null;' +
'let stage="before";' +
'async function tryPlay(audio){try{await audio.play()}catch{console.log("Autoplay blocked")}}' +
'function primeAudioOnGesture(){if(stage==="before")tryPlay(musicBefore);else if(stage==="ontime")tryPlay(musicOnTime);else if(stage==="after")tryPlay(musicAfter);window.removeEventListener("click",primeAudioOnGesture);window.removeEventListener("touchend",primeAudioOnGesture)}' +
'const overlay=document.getElementById("overlay");' +
'overlay.addEventListener("click",()=>{overlay.remove()});' +
'window.addEventListener("click",primeAudioOnGesture);' +
'window.addEventListener("touchend",primeAudioOnGesture);' +
'function pad(n){return String(n).padStart(2,"0")}' +
'function renderCountdown(diffMs){const totalSec=Math.max(0,Math.floor(diffMs/1000));const days=Math.floor(totalSec/86400);const hrs=Math.floor((totalSec%86400)/3600);const mins=Math.floor((totalSec%3600)/60);const secs=totalSec%60;document.getElementById("d").textContent=days;document.getElementById("h").textContent=hrs;document.getElementById("m").textContent=mins;document.getElementById("s").textContent=secs;const bigH=days*24+hrs;document.getElementById("bigTime").textContent=pad(bigH)+":"+pad(mins)+":"+pad(secs)}' +
'function startBeforeMusic(){stage="before";localStorage.setItem("stage",stage);tryPlay(musicBefore)}' +
'function onReachMidnight(){stage="ontime";localStorage.setItem("stage",stage);musicBefore.pause();musicBefore.currentTime=0;musicOnTime.currentTime=0;musicOnTime.play().catch(()=>{});setTimeout(()=>{if(stage==="ontime")startAfterMusic()},ONTIME_DURATION);switchToBirthdayScreen();startConfettiContinuous()}' +
'function startAfterMusic(){stage="after";localStorage.setItem("stage",stage);musicOnTime.pause();musicOnTime.currentTime=0;musicAfter.currentTime=0;musicAfter.play().catch(()=>{})}' +
'function switchToBirthdayScreen(){const tpl=document.getElementById("birthdayTemplate").content.cloneNode(true);document.getElementById("app").replaceWith(tpl);const giftBtn=document.getElementById("giftBtn");if(giftBtn){giftBtn.addEventListener("click",()=>{musicAfter.pause();startConfettiContinuous();openGiftPage()})}}' +
'const EMOJIS=["🎉","🎈","🎂","✨","💖","🎊","🧁","⭐","💫"];' +
'function spawnEmoji(){const el=document.createElement("div");el.className="confetti";el.textContent=EMOJIS[(Math.random()*EMOJIS.length)|0];const startX=Math.random()*window.innerWidth;const xEnd=Math.random()*120-60;const duration=(6+Math.random()*5).toFixed(2)+"s";el.style.left=startX+"px";el.style.setProperty("--x","0px");el.style.setProperty("--x-end",xEnd+"px");el.style.setProperty("--dur",duration);document.getElementById("confetti-container").appendChild(el);el.addEventListener("animationend",()=>el.remove());setTimeout(()=>el.remove(),15000)}' +
'function startConfettiContinuous(){for(let i=0;i<40;i++)spawnEmoji();confettiInterval=setInterval(()=>{for(let i=0;i<5;i++)spawnEmoji()},500);setTimeout(()=>{clearInterval(confettiInterval);confettiInterval=null},30000)}' +
'function openGiftPage(){const giftWin=window.open("","_blank");giftWin.document.write(decodeGiftHTML());giftWin.document.close()}' +
'(function(){const form=document.getElementById("guestbookForm");if(form){const nameEl=document.getElementById("guestName");const msgEl=document.getElementById("guestMessage");const helpEl=document.getElementById("wordHelp");const submitBtn=document.getElementById("guestSubmit");const noteEl=document.getElementById("guestNote");function countWords(s){const words=s.trim().split(" ").filter(w=>w.length>0);return words.length}function updateCounter(){const wc=countWords(msgEl.value);helpEl.textContent=wc+" / 15 words";helpEl.style.color=wc>15?"#ff6b9e":"var(--muted)";submitBtn.disabled=wc===0||wc>15}msgEl.addEventListener("input",updateCounter);updateCounter();form.addEventListener("submit",async(e)=>{e.preventDefault();const name=nameEl.value.trim();const message=msgEl.value.trim();if(!name||!message)return;submitBtn.disabled=true;submitBtn.textContent="Sending…";try{const messages=JSON.parse(localStorage.getItem(MESSAGES_KEY)||"[]");messages.push({name,message,createdAt:new Date().toISOString()});localStorage.setItem(MESSAGES_KEY,JSON.stringify(messages));form.reset();updateCounter();noteEl.hidden=false;noteEl.textContent="Thanks! Your wish is saved 💖";submitBtn.textContent="Sent ✅";setTimeout(()=>{submitBtn.textContent="Send Wish 💌";submitBtn.disabled=false;noteEl.hidden=true},2000)}catch(err){noteEl.hidden=false;noteEl.textContent="Could not save. Please try again.";submitBtn.textContent="Send Wish 💌";submitBtn.disabled=false;console.error(err)}})}})();' +
'(function init(){const now=Date.now();const targetTime=TARGET.getTime();if(now>=targetTime+ONTIME_DURATION){startAfterMusic();switchToBirthdayScreen()}else if(now>=targetTime){onReachMidnight()}else{startBeforeMusic();const timer=setInterval(()=>{const diff=TARGET.getTime()-Date.now();if(diff<=0){clearInterval(timer);onReachMidnight()}else renderCountdown(diff)},1000);renderCountdown(targetTime-now)}})();';
}


function generateGiftHTML(recipientName, creatorName, poem, letter, friends, photos, memes, musicAfterSrc, birthdayDate, selectedTheme) {
    // Generate arrays as strings for embedding in JS
    let memesArrayStr = '[';
    for (let i = 0; i < memes.length; i++) {
        memesArrayStr += '"' + memes[i] + '"';
        if (i < memes.length - 1) memesArrayStr += ',';
    }
    memesArrayStr += ']';
    
    let friendsArrayStr = '[';
    for (let i = 0; i < friends.length; i++) {
        friendsArrayStr += '{name:"' + friends[i].name.replace(/"/g, '\\"') + '",text:"' + friends[i].message.replace(/"/g, '\\"') + '"}';
        if (i < friends.length - 1) friendsArrayStr += ',';
    }
    friendsArrayStr += ']';
    
    let photosArrayStr = '[';
    for (let i = 0; i < photos.length; i++) {
        photosArrayStr += '{src:"' + photos[i] + '",caption:"Memory ' + (i + 1) + '"}';
        if (i < photos.length - 1) photosArrayStr += ',';
    }
    photosArrayStr += ']';
    
    const poemEscaped = poem.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    const letterEscaped = letter.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    
    const colors = themeColors[selectedTheme] || themeColors.galaxy;

    return '<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'<meta charset="utf-8">' +
'<meta name="viewport" content="width=device-width,initial-scale=1">' +
'<title>Birthday Gift — Surprise</title>' +
'<style>' +
':root{--bg1:#fff0f7;--accent-pink:' + colors.primary + ';--accent-pink-2:' + colors.secondary + ';--muted:#6b6b78;--card:#ffffffcc}' +
'*{box-sizing:border-box}' +
'body{margin:0;min-height:100vh;font-family:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial;background:linear-gradient(180deg,#fff6fb 0%,#fff0f5 100%);color:#222;overflow-x:hidden}' +
'.wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:28px}' +
'.stage{width:100%;max-width:1000px;min-height:70vh;margin:0 auto;padding:28px;border-radius:20px;background:var(--card);box-shadow:0 10px 40px rgba(12,12,20,0.08);position:relative;overflow:hidden;display:none;flex-direction:column;align-items:center}' +
'.stage.active{display:flex}' +
'h1{margin:0 0 8px;font-size:1.8rem;color:#222}' +
'p.lead{color:var(--muted);margin:6px 0 16px}' +
'.next-btn{display:inline-flex;align-items:center;gap:10px;padding:12px 22px;font-weight:800;border-radius:999px;border:none;cursor:pointer;color:white;font-size:1.05rem;background:linear-gradient(135deg,var(--accent-pink),var(--accent-pink-2));box-shadow:0 8px 30px rgba(255,155,189,0.35);transition:transform 0.18s ease,box-shadow 0.18s ease;position:relative;z-index:20;animation:pulseGlow 1.6s infinite alternate}' +
'.next-btn:hover{transform:scale(1.05) rotate(-2deg)}' +
'@keyframes pulseGlow{0%{box-shadow:0 8px 18px rgba(255,155,189,0.35)}100%{box-shadow:0 16px 36px rgba(255,155,189,0.55)}}' +
'.sparkle{position:absolute;pointer-events:none;transform:translate(-50%,-50%) scale(0.9);animation:sparkle 0.7s ease forwards;font-size:18px;z-index:30}' +
'@keyframes sparkle{0%{opacity:1;transform:translate(-50%,-50%) scale(0.6) translateY(0)}100%{opacity:0;transform:translate(-50%,-120%) scale(1.6)}}' +
'.meme{position:absolute;width:160px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.12);transform-origin:center;animation:pop 0.45s cubic-bezier(0.2,0.9,0.3,1) both}' +
'@keyframes pop{from{transform:scale(0.2) rotate(-12deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}' +
'.confetti-soft{position:absolute;inset:0;pointer-events:none;z-index:5}' +
'#messages-container{width:100%;max-width:760px;display:flex;flex-direction:column;gap:12px;align-items:center;margin-top:12px}' +
'.msg{width:100%;background:linear-gradient(180deg,#fff,#fff3f8);border-radius:14px;padding:14px 16px;box-shadow:0 8px 24px rgba(20,20,30,0.06);opacity:0;transform:translateY(12px) scale(0.99);display:flex;gap:12px;align-items:flex-start;animation:showMsg 0.8s forwards}' +
'@keyframes showMsg{to{opacity:1;transform:translateY(0) scale(1)}}' +
'.avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#ffdbe6,#ffb6d0);display:flex;align-items:center;justify-content:center;font-weight:800;color:#7a084a;flex-shrink:0}' +
'.msg .who{font-weight:800;color:#8b2b4a}' +
'.msg .text{color:#333;margin-top:4px}' +
'.gallery-wrap{width:100%;max-width:880px;position:relative;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08)}' +
'.gallery-img{width:100%;display:block;object-fit:cover;height:520px;transition:opacity 0.9s ease}' +
'.gallery-caption{padding:12px 16px;background:linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.95));font-weight:700;color:#6b2b4a}' +
'.poem-box{max-width:800px;padding:26px;border-radius:16px;background:linear-gradient(180deg,#fff6fb,#fff0f5);box-shadow:0 12px 40px rgba(150,60,120,0.06);text-align:center;font-size:1.1rem;line-height:1.6}' +
'.petal{position:absolute;font-size:20px;opacity:0.95;animation:floatPetal linear infinite;pointer-events:none}' +
'@keyframes floatPetal{from{transform:translateY(0) rotate(0)}to{transform:translateY(-110vh) rotate(360deg)}}' +
'.letter-wrap{max-width:760px;display:flex;flex-direction:column;align-items:center;gap:12px}' +
'.sealed{width:180px;height:120px;border-radius:12px;background:linear-gradient(180deg,#ffecf3,#ffdfe9);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,0.08)}' +
'.seal{width:68px;height:68px;border-radius:50%;background:linear-gradient(180deg,#b2185b,#7a0b38);display:flex;align-items:center;justify-content:center;color:white;font-weight:900;box-shadow:0 6px 18px rgba(0,0,0,0.18)}' +
'.paper{width:90%;max-width:680px;background:#fffaf4;border-radius:12px;padding:20px;margin-top:8px;box-shadow:0 10px 30px rgba(0,0,0,0.06);transform-origin:top center;transform:scaleY(0);opacity:0;transition:transform 0.6s cubic-bezier(0.2,0.9,0.3,1),opacity 0.4s ease 0.05s;font-family:"Georgia",serif;white-space:pre-wrap;color:#2b1a1a}' +
'.paper.open{transform:scaleY(1);opacity:1}' +
'.typewriter{overflow:hidden;border-right:0.12em solid rgba(200,100,140,0.9);white-space:pre-wrap;font-family:"Courier New",monospace;font-size:1rem}' +
'.music-wrap{display:flex;flex-direction:column;align-items:center;gap:12px}' +
'.balloon{position:absolute;font-size:26px;animation:rise linear infinite;pointer-events:none}' +
'@keyframes rise{from{transform:translateY(0)}to{transform:translateY(-120vh)}}' +
'.center-row{display:flex;gap:12px;align-items:center;justify-content:center;margin-top:18px}' +
'.hidden{display:none!important}' +
'footer{margin-top:18px;color:var(--muted);font-size:0.9rem}' +
'@media (max-width:720px){.gallery-img{height:320px}.poem-box{font-size:1rem;padding:18px}.meme{width:120px}}' +
'</style>' +
'</head>' +
'<body>' +
'<div class="wrap">' +
'<div id="st1" class="stage active" aria-hidden="false">' +
'<h2>🎁HAPPY BIRTHDAY💖</h2>' +
'<h1 style="font-family:cursive">💕' + recipientName + '🌷</h1>' +
'<p>💕may this day be as special as you are💕</p>' +
'<br>' +
'<div class="confetti-soft" aria-hidden="true" id="confetti-soft"></div>' +
'<div style="margin-top:18px">' +
'<button class="next-btn" id="nextBtn1">🎁 Next</button>' +
'</div>' +
'</div>' +
'<div id="st2" class="stage" aria-hidden="true">' +
'<h1>💌Wishes from Friends😍</h1>' +
'<p class="lead">Some warm wishes from people who care 💖</p>' +
'<div id="messages-container"></div>' +
'<div class="center-row">' +
'<button class="next-btn" id="nextBtn2">🎁 Next Surprise</button>' +
'</div>' +
'</div>' +
'<div id="st3" class="stage" aria-hidden="true">' +
'<h1>📸 Memory Gallery</h1>' +
'<p class="lead">A slideshow of favorite memories</p>' +
'<div class="gallery-wrap" id="galleryWrap">' +
'<img id="galleryImg" class="gallery-img" src="" alt="memory photo">' +
'<div class="gallery-caption" id="galleryCaption">Memory caption here</div>' +
'</div>' +
'<div class="center-row">' +
'<button class="next-btn" id="nextBtn3">🎁 Next</button>' +
'</div>' +
'</div>' +
'<div id="st4" class="stage" aria-hidden="true">' +
'<h1>📜 Poem</h1>' +
'<p class="lead">A little poem only for You 💕</p>' +
'<div class="poem-box" id="poemBox"></div>' +
'<div class="center-row">' +
'<button class="next-btn" id="nextBtn4">🎁 Next</button>' +
'</div>' +
'</div>' +
'<div id="st5" class="stage" aria-hidden="true">' +
'<h1>💌Letter Of LOVE</h1>' +
'<p class="lead">A letter sealed with warmth</p>' +
'<div class="letter-wrap">' +
'<div class="sealed" id="sealBtn" title="Click to open the letter">' +
'<div class="seal">♥</div>' +
'</div>' +
'<div id="paper" class="paper" aria-hidden="true"></div>' +
'</div>' +
'<div class="center-row">' +
'<button class="next-btn hidden" id="nextBtn5">Next 🎁</button>' +
'</div>' +
'</div>' +
'<div id="st6" class="stage" aria-hidden="true">' +
'<h2>🎁HAPPY💖</h2>' +
'<h2>💕BIRTHDAY😽</h2>' +
'<p>MY DARLING</p>' +
'<h2 style="font-family:cursive">LOVE YOU FOREVER</h2>' +
'<p style="margin-top:20px;font-size:1.2rem">From: ' + creatorName + ' ❤️</p>' +
'</div>' +
'</div>' +
'<footer style="text-align:center">Tip: If audio doesn\'t start automatically, tap the play button.</footer>' +
'<audio id="bgmSong" src="' + musicAfterSrc + '" preload="auto"></audio>' +
'<script>' +
generateGiftJS(memesArrayStr, friendsArrayStr, photosArrayStr, poemEscaped, letterEscaped, birthdayDate) +
'<\/script>' +
'</body>' +
'</html>';
}


function generateGiftJS(memesArrayStr, friendsArrayStr, photosArrayStr, poemText, letterText, birthdayDate) {
    return 'const bgm=document.getElementById("bgmSong");' +
'bgm.loop=true;' +
'bgm.volume=0.45;' +
'const memes=' + memesArrayStr + ';' +
'const MESSAGES_KEY="birthday_messages_"+new Date("' + birthdayDate + '").getTime();' +
'let friendMessages=' + friendsArrayStr + ';' +
'try{const stored=JSON.parse(localStorage.getItem(MESSAGES_KEY)||"[]");if(stored.length>0){friendMessages=friendMessages.concat(stored.map(m=>({name:m.name,text:m.message})))}}catch(e){console.log("No stored messages")}' +
'const photos=' + photosArrayStr + ';' +
'const poemText="' + poemText + '";' +
'const letterText="' + letterText + '";' +
'const EMOJIS=["🎉","🎊","✨","💖","🎈","🧁","⭐"];' +
'function spawnConfettiBurst(x,y,count){count=count||18;for(let i=0;i<count;i++){const el=document.createElement("div");el.textContent=EMOJIS[Math.floor(Math.random()*EMOJIS.length)];el.style.position="absolute";el.style.left=x+(Math.random()*180-90)+"px";el.style.top=y+(Math.random()*80-40)+"px";el.style.fontSize=12+Math.random()*22+"px";el.style.opacity=1;el.style.transform="translateY(0) rotate("+Math.random()*360+"deg)";el.style.transition="transform "+(1.2+Math.random()*1.2)+"s cubic-bezier(.2,.8,.3,1), opacity 1.3s";document.body.appendChild(el);requestAnimationFrame(()=>{el.style.transform="translateY("+(120+Math.random()*300)+"px) translateX("+(Math.random()*200-100)+"px) rotate("+(Math.random()*720)+"deg) scale("+(0.9+Math.random()*1.4)+")";el.style.opacity=0});setTimeout(()=>el.remove(),1800)}}' +
'let currentStage=1;' +
'const totalStages=6;' +
'function showStage(n){for(let i=1;i<=totalStages;i++){const el=document.getElementById("st"+i);if(!el)continue;if(i===n){el.classList.add("active");el.setAttribute("aria-hidden","false")}else{el.classList.remove("active");el.setAttribute("aria-hidden","true")}}currentStage=n;if(n===1&&bgm.paused){bgm.play().catch(()=>{console.log("Autoplay blocked")})}}' +
'function cuteClickSpark(btn){for(let i=0;i<6;i++){const sp=document.createElement("div");sp.className="sparkle";sp.textContent=["✨","💕","🎀","✨","💫","🌸"][Math.floor(Math.random()*6)];const r=btn.getBoundingClientRect();sp.style.left=r.left+r.width*Math.random()+"px";sp.style.top=r.top+r.height*Math.random()*0.6+"px";document.body.appendChild(sp);setTimeout(()=>sp.remove(),900)}}' +
'let memeInterval=null;' +
'function startMemeStage(){if(memes.length===0)return;memeInterval=setInterval(()=>{if(currentStage!==1)return;const img=document.createElement("img");img.src=memes[Math.floor(Math.random()*memes.length)];img.className="meme";img.style.left=Math.random()*(window.innerWidth-180)+40+"px";img.style.top=Math.random()*(window.innerHeight-220)+60+"px";img.style.transform="scale("+(0.9+Math.random()*0.7)+")";document.body.appendChild(img);setTimeout(()=>img.remove(),3500);if(Math.random()<0.25)spawnConfettiBurst(parseFloat(img.style.left),parseFloat(img.style.top),10)},700)}' +
'function stopMemeStage(){clearInterval(memeInterval)}' +
'function startMessagesStage(){const container=document.getElementById("messages-container");container.innerHTML="";let messages=friendMessages;let i=0;function nextMsg(){if(currentStage!==2)return;if(i>=messages.length){spawnConfettiBurst(window.innerWidth/2,150,28);return}const m=messages[i];const msg=document.createElement("div");msg.className="msg";msg.innerHTML="<div class=\\"avatar\\">"+((m.name||"?").charAt(0).toUpperCase())+"</div><div style=\\"flex:1\\"><div class=\\"who\\">"+(m.name||"Friend")+"</div><div class=\\"text\\">"+m.text+"</div></div>";container.appendChild(msg);i++;setTimeout(nextMsg,1200+Math.random()*700)}nextMsg()}' +
'let galleryInterval=null;' +
'let galleryIndex=0;' +
'function startGallery(){if(photos.length===0)return;const imgEl=document.getElementById("galleryImg");const capEl=document.getElementById("galleryCaption");imgEl.src=photos[0].src;capEl.textContent=photos[0].caption;galleryIndex=0;galleryInterval=setInterval(()=>{if(currentStage!==3)return;galleryIndex=(galleryIndex+1)%photos.length;imgEl.style.opacity=0;setTimeout(()=>{imgEl.src=photos[galleryIndex].src;capEl.textContent=photos[galleryIndex].caption;imgEl.style.opacity=1;spawnConfettiBurst(window.innerWidth/2,120,22)},520)},2000)}' +
'function stopGallery(){clearInterval(galleryInterval)}' +
'function showPoem(){const box=document.getElementById("poemBox");box.innerHTML="";poemText.split("\\n").forEach((ln,idx)=>{const p=document.createElement("div");p.style.opacity=0;p.style.transform="translateY(10px)";p.style.transition="opacity .6s ease "+(idx*220)+"ms, transform .6s ease "+(idx*220)+"ms";p.textContent=ln;box.appendChild(p);setTimeout(()=>{p.style.opacity=1;p.style.transform="translateY(0)"},40)})}' +
'let typingTimer=null;' +
'function bindSeal(){const seal=document.getElementById("sealBtn");const paper=document.getElementById("paper");seal.addEventListener("click",()=>{paper.classList.add("open");const el=document.createElement("div");el.className="typewriter";paper.innerHTML="";paper.appendChild(el);let i=0;function type(){if(currentStage!==5)return;if(i<letterText.length){el.textContent+=letterText.charAt(i);i++;typingTimer=setTimeout(type,32+Math.random()*22)}else{document.getElementById("nextBtn5").classList.remove("hidden")}}setTimeout(type,220)},{once:true})}' +
'function spawnBalloonLoop(){setInterval(()=>{if(currentStage===6){}},600)}' +
'function goToNext(){cuteClickSpark(document.querySelector(".next-btn"));if(currentStage===1)stopMemeStage();if(currentStage===3)stopGallery();if(currentStage===5)clearTimeout(typingTimer);const next=Math.min(totalStages,currentStage+1);showStage(next);if(next===1)startMemeStage();if(next===2)startMessagesStage();if(next===3)startGallery();if(next===4)showPoem();if(next===5)bindSeal();if(next===6)spawnBalloonLoop()}' +
'document.getElementById("nextBtn1").addEventListener("click",goToNext);' +
'document.getElementById("nextBtn2").addEventListener("click",goToNext);' +
'document.getElementById("nextBtn3").addEventListener("click",goToNext);' +
'document.getElementById("nextBtn4").addEventListener("click",goToNext);' +
'document.getElementById("nextBtn5").addEventListener("click",goToNext);' +
'document.querySelectorAll(".next-btn").forEach((btn)=>{btn.addEventListener("click",()=>cuteClickSpark(btn))});' +
'document.getElementById("st1").addEventListener("click",(e)=>{if(currentStage===1&&bgm.paused)bgm.play();spawnConfettiBurst(e.clientX,e.clientY,20)});' +
'showStage(1);' +
'startMemeStage();';
}
