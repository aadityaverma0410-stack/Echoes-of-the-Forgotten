// --- Global State ---
let isAlternate = false;

// --- Canvas Arrakis Sand Animation ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 1.5 - 0.5; 
        this.speedY = Math.random() * 1 + 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
    }
    draw() {
        ctx.fillStyle = isAlternate 
            ? 'rgba(157, 78, 221, 0.5)' // Alternate Purple
            : 'rgba(212, 175, 55, 0.5)'; // Dune Sand
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 7000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// --- Gate 1: Math Logic ---
const mathInput = document.getElementById('math-input');
const mathMsg = document.getElementById('math-msg');

mathInput.addEventListener('input', (e) => {
    if(e.target.value.trim() === '25') {
        mathInput.disabled = true;
        mathInput.style.borderColor = "var(--system-green)";
        mathMsg.innerText = "Correct. Logical processing confirmed.";
        setTimeout(() => {
            document.getElementById('gate-1').classList.add('hidden');
            document.getElementById('gate-2').classList.remove('hidden');
        }, 1500);
    }
});

// --- Gate 2: Chemistry Logic ---
function checkChem(btnElement, answer) {
    const errorMsg = document.getElementById('chem-error');
    const successMsg = document.getElementById('chem-msg');
    
    errorMsg.innerText = "";
    successMsg.innerText = "";

    if(answer === 'Oxytocin') {
        successMsg.innerText = "Bond detected. Access granted twinn.";
        btnElement.style.backgroundColor = "var(--system-green)";
        btnElement.style.color = "#000";
        
        const buttons = btnElement.parentElement.querySelectorAll('button');
        buttons.forEach(b => b.disabled = true);

        setTimeout(() => {
            document.getElementById('gate-2').classList.add('hidden');
            document.getElementById('main-site').classList.remove('hidden');
            document.getElementById('universe-toggle').classList.remove('hidden');
        }, 1800);
    } else {
        errorMsg.innerText = "Incorrect compound detected.";
        btnElement.style.borderColor = "var(--system-red)";
        setTimeout(() => btnElement.style.borderColor = "var(--accent-color)", 1000);
    }
}

// --- Navigation & Hidden Star Logic ---
let mouseDistance = 0;
let lastX = null;
let lastY = null;

document.addEventListener('mousemove', (e) => {
    if (!document.getElementById('main-site').classList.contains('hidden')) {
        if (lastX !== null && lastY !== null) {
            let dx = e.clientX - lastX;
            let dy = e.clientY - lastY;
            mouseDistance += Math.sqrt(dx*dx + dy*dy);
            
            // Unlock hidden star after roughly 3000px of mouse movement
            if (mouseDistance > 3000) {
                document.getElementById('hidden-star').classList.remove('hidden');
            }
        }
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

function openSection(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    document.getElementById('universe-toggle').classList.add('hidden');
}

function returnToMap() {
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    document.getElementById('main-site').classList.remove('hidden');
    document.getElementById('universe-toggle').classList.remove('hidden');
}

// --- Mood Generator Logic ---
const moods = [
    { text: "> Frank Ocean midnight sadness", audioId: "audio-frank" },
    { text: "> TV Girl chaotic nostalgia", audioId: "audio-tvgirl" },
    { text: "> Daniel Caesar soft romance", audioId: "audio-daniel" }
];

function generateMood() {
    const display = document.getElementById('mood-display');
    const randomObj = moods[Math.floor(Math.random() * moods.length)];
    
    display.innerText = randomObj.text;
    display.classList.remove('hidden');
    
    // Stop all audio first
    document.querySelectorAll('audio').forEach(a => {
        a.pause();
        a.currentTime = 0;
    });
    
    // Play selected audio (requires local mp3 files to work)
    const audioEl = document.getElementById(randomObj.audioId);
    if(audioEl) audioEl.play().catch(e => console.log("Audio requires interaction or files missing."));
}

// --- Droid Translator Logic ---
let isTranslating = false;
function translateDroid() {
    if(isTranslating) return;
    isTranslating = true;
    
    const translatedElement = document.getElementById('droid-translated');
    const message = "> Translation: someone here thinks you’re incredibly cool.";
    
    translatedElement.innerText = "";
    let i = 0;
    
    const typeInterval = setInterval(() => {
        translatedElement.innerText += message.charAt(i);
        i++;
        if (i >= message.length) {
            clearInterval(typeInterval);
            isTranslating = false;
        }
    }, 60);
}

// --- Compliment Machine Logic ---
const compliments = [
    "Certified main character energy.",
    "Performative divaa",
    "Scientifically proven kooool.",
    "Rare niche personality detected."
];
function generateCompliment() {
    const output = document.getElementById('compliment-output');
    output.innerHTML = `> Processing request...`;
    
    setTimeout(() => {
        const comp = compliments[Math.floor(Math.random() * compliments.length)];
        output.innerHTML = `> Match found:<br>> "${comp}"`;
    }, 800);
}

// --- Parallel Universe Logic ---
function toggleUniverse() {
    isAlternate = !isAlternate;
    const btn = document.getElementById('universe-toggle');
    
    if (isAlternate) {
        document.body.classList.add('alternate-universe');
        btn.innerText = "Alternate Timeline";
    } else {
        document.body.classList.remove('alternate-universe');
        btn.innerText = "Normal Universe";
    }
}

// --- Keyboard Easter Eggs Logic ---
let r2Sequence = '';
document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === "INPUT") return;

    const key = e.key.toLowerCase();
    
    if (key === 'a') {
        customAlert("> Anakin Protocol Initiated. May the force be with you.");
    }
    if (key === 'f') {
        openSection('music-section');
    }
    
    r2Sequence += key;
    if (r2Sequence.length > 2) r2Sequence = r2Sequence.substring(1);
    if (r2Sequence === 'r2') {
        customAlert("> 🤖 BEEP BOOP. Droid presence acknowledged.");
        r2Sequence = '';
    }
});

function customAlert(msg) {
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: var(--accent-color); color: var(--bg-color);
        padding: 15px 30px; border-radius: 4px; font-weight: bold;
        z-index: 9999; box-shadow: var(--accent-glow);
        animation: slideDownOut 3.5s forwards;
    `;
    alertBox.innerText = msg;
    document.body.appendChild(alertBox);

    if (!document.getElementById('alert-style')) {
        const style = document.createElement('style');
        style.id = 'alert-style';
        style.innerHTML = `
            @keyframes slideDownOut {
                0% { opacity: 0; top: -50px; }
                10% { opacity: 1; top: 20px; }
                90% { opacity: 1; top: 20px; }
                100% { opacity: 0; top: -50px; }
            }
        `;
        document.head.appendChild(style);
    }
    setTimeout(() => alertBox.remove(), 3500);
}

// --- Cinematic Ending Logic ---
function startEnding() {
    document.getElementById('cinema-panel').classList.add('hidden');
    const container = document.getElementById('cinema-text-container');
    container.innerHTML = "";
    
    const lines = isAlternate ? 
        ["In every universe I’d still think you’re amazing. Master OBI-WAN. "] : 
        [
            "This little corner of the internet exists because I’m glad that I recognised the GOAT inside youu पाकgya.",
            "Happyyyy birthdayy twinnn 🎀🦄🍎"
        ];

    let delay = 0;
    lines.forEach((line) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.innerText = line;
            p.className = 'movie-fade';
            container.appendChild(p);
        }, delay);
        delay += 4500; 
    });

    setTimeout(() => {
        document.getElementById('cinema-panel').classList.remove('hidden');
        container.innerHTML = "";
    }, delay + 4000);
}

