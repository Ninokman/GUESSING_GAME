// ==========================================
// MIND READER GAME - JavaScript Logic
// ==========================================

// Game State Variables
let targetNumber = 0;
let maxLimit = 100;
let attemptsLeft = 3;
const maxAttempts = 3;
let gameActive = false;

// DOM Element References
const setupPhase = document.getElementById('setup-phase');
const gameplayPhase = document.getElementById('gameplay-phase');
const resultPhase = document.getElementById('result-phase');
const gameCard = document.querySelector('.glass-panel');
const subtitle = document.getElementById('game-subtitle');

const maxLimitInput = document.getElementById('max-limit-input');
const guessInput = document.getElementById('guess-input');
const attemptsContainer = document.getElementById('attempts-container');
const feedbackMsg = document.getElementById('feedback-msg');

const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resultIcon = document.getElementById('result-icon');

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================

function showSection(section) {
    const landing = document.getElementById('landing-section');
    const game = document.getElementById('game-section');
    const navHome = document.getElementById('nav-home');

    if (section === 'game') {
        landing.classList.remove('active-section');
        landing.classList.add('hidden-section');
        game.classList.remove('hidden-section');
        game.classList.add('active-section');
        navHome.classList.remove('hidden');
    } else {
        game.classList.remove('active-section');
        game.classList.add('hidden-section');
        landing.classList.remove('hidden-section');
        landing.classList.add('active-section');
        navHome.classList.add('hidden');
        resetGame();
    }
}

function startGameFlow() {
    showSection('game');
}

function scrollToHowToPlay() {
    document.getElementById('how-to-play').scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// GAME LOGIC FUNCTIONS
// ==========================================

function initGame() {
    const limit = parseInt(maxLimitInput.value);
    
    if (!limit || limit < 1) {
        shakeElement(maxLimitInput);
        subtitle.textContent = "Please enter a valid number greater than 0";
        subtitle.classList.add('text-red-400');
        return;
    }

    maxLimit = limit;
    targetNumber = Math.floor(Math.random() * maxLimit) + 1;
    attemptsLeft = maxAttempts;
    gameActive = true;

    // UI Transition
    setupPhase.classList.add('hidden');
    gameplayPhase.classList.remove('hidden');
    gameplayPhase.classList.add('animate-pop');
    
    subtitle.textContent = `Guess a number between 1 and ${maxLimit}`;
    subtitle.classList.remove('text-red-400');
    
    updateAttemptsUI();
    guessInput.focus();
    
    console.log(`Debug: Target number is ${targetNumber}`);
}

function submitGuess() {
    if (!gameActive) return;

    const guess = parseInt(guessInput.value);

    // Validation
    if (isNaN(guess) || guess < 1 || guess > maxLimit) {
        feedbackMsg.textContent = `Enter a number between 1 and ${maxLimit}`;
        feedbackMsg.className = "h-8 text-center text-sm font-medium mb-4 text-amber-400";
        shakeElement(guessInput);
        return;
    }

    // Check Logic
    if (guess === targetNumber) {
        handleWin();
    } else {
        handleWrongGuess(guess);
    }
}

function handleWrongGuess(guess) {
    attemptsLeft--;
    updateAttemptsUI();
    
    // Visual Feedback
    shakeElement(gameCard);
    guessInput.value = '';
    guessInput.focus();

    // Hint Logic
    const hint = guess < targetNumber ? "To Low! Bro" : "Too High! Bro";
    feedbackMsg.textContent = `${hint} Try again.`;
    feedbackMsg.className = "h-8 text-center text-sm font-medium mb-4 text-rose-400";

    if (attemptsLeft === 0) {
        handleGameOver();
    }
}

function handleWin() {
    gameActive = false;
    gameplayPhase.classList.add('hidden');
    resultPhase.classList.remove('hidden');
    
    resultTitle.textContent = "You Win!";
    resultTitle.className = "text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400";
    resultMessage.textContent = `You guessed ${targetNumber} correctly!`;
    resultIcon.textContent = "🎉";
    
    fireConfetti();
}

function handleGameOver() {
    gameActive = false;
    gameplayPhase.classList.add('hidden');
    resultPhase.classList.remove('hidden');

    resultTitle.textContent = "Game Over";
    resultTitle.className = "text-3xl font-bold mb-2 text-slate-200";
    resultMessage.innerHTML = `The number was <span class="text-indigo-400 font-bold text-xl">${targetNumber}</span>. Better luck next time!`;
    resultIcon.textContent = "💀";
}

function resetGame() {
    // Reset State
    gameActive = false;
    maxLimitInput.value = '';
    guessInput.value = '';
    feedbackMsg.textContent = '';
    
    // UI Reset
    resultPhase.classList.add('hidden');
    gameplayPhase.classList.add('hidden');
    setupPhase.classList.remove('hidden');
    setupPhase.classList.add('animate-pop');
    
    subtitle.textContent = "Set the difficulty to begin";
    subtitle.classList.remove('text-red-400');
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function updateAttemptsUI() {
    attemptsContainer.innerHTML = '';
    for (let i = 0; i < maxAttempts; i++) {
        const dot = document.createElement('div');
        if (i < attemptsLeft) {
            dot.className = "w-3 h-3 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/50 transition-all duration-300";
        } else {
            dot.className = "w-3 h-3 rounded-full bg-slate-700 transition-all duration-300";
        }
        attemptsContainer.appendChild(dot);
    }
}

function shakeElement(element) {
    element.classList.remove('animate-shake');
    void element.offsetWidth; // Trigger reflow
    element.classList.add('animate-shake');
}

// ==========================================
// EVENT LISTENERS
// ==========================================

maxLimitInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') initGame();
});

guessInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') submitGuess();
});

// ==========================================
// CONFETTI EFFECT (Canvas)
// ==========================================

const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        this.vx = (Math.random() - 0.5) * 20;
        this.vy = (Math.random() - 0.5) * 20 - 5;
        this.gravity = 0.5;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.size = Math.random() * 8 + 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.life = 100;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;
        this.life -= 1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function fireConfetti() {
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
    animateConfetti();
}

function animateConfetti() {
    if (particles.length === 0) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0 || particles[i].y > canvas.height) {
            particles.splice(i, 1);
            i--;
        }
    }
    
    requestAnimationFrame(animateConfetti);
}
