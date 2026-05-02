const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart');
const muteButton = document.getElementById('mute-button');
const muteIcon = document.getElementById('mute-icon');
const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');
const mismatchSound = document.getElementById('mismatchSound');
const restartSound = document.getElementById('restartSound');
const backgroundMusic = document.getElementById('backgroundMusic');

const cardBackImage = 'card-back.jpg';
let gameLevel = document.body.dataset.level || 'beginner';
const cardImages = {
    beginner: ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg', 'card6.jpg', 'card7.jpg', 'card8.jpg', 'card9.jpg', 'card10.jpg'],
    medium: ['card11.jpg', 'card12.jpg', 'card13.jpg', 'card14.jpg', 'card15.jpg', 'card16.jpg', 'card17.jpg', 'card18.jpg', 'card19.jpg', 'card20.jpg'],
    advanced: ['card21.jpg', 'card22.jpg', 'card23.jpg', 'card24.jpg', 'card25.jpg', 'card26.jpg', 'card27.jpg', 'card28.jpg', 'card29.jpg', 'card30.jpg']
};

const gameLevels = {
    beginner: { totalCards: 20, gridColumns: 5 },
    medium: { totalCards: 20, gridColumns: 5 },
    advanced: { totalCards: 20, gridColumns: 5 }
};

let { totalCards, gridColumns } = gameLevels[gameLevel];
let cards = [];
let flippedCards = [];
let score = 0;
let moves = 0;
let isMuted = false;

let timerInterval = null;
let startTime = 0;
let elapsedSeconds = 0;
let timerStarted = false;

const BEST_KEY = `bee-best-${gameLevel}`;

function preloadImages() {
    const images = [cardBackImage, ...cardImages[gameLevel]];
    images.forEach((image) => {
        const img = new Image();
        img.src = `images/${image}`;
    });
}

function createBoard() {
    if (!gameBoard) return;
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
    const levelCards = cardImages[gameLevel].slice(0, totalCards / 2);
    const shuffledCards = [...levelCards, ...levelCards].sort(() => Math.random() - 0.5);
    shuffledCards.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.cardNumber = image.replace('card', '').replace('.jpg', '');

        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `第 ${index + 1} 張卡片，未翻開`);

        const front = document.createElement('div');
        front.classList.add('front');
        front.style.backgroundImage = `url('images/${image}')`;
        front.style.backgroundSize = 'cover';
        front.style.backgroundPosition = 'center';

        const back = document.createElement('div');
        back.classList.add('back');

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener('click', flipCard);
        card.addEventListener('keydown', handleCardKey);
        gameBoard.appendChild(card);
    });
}

function handleCardKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flipCard.call(this);
    }
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        if (!timerStarted) startTimer();
        this.classList.add('flipped');
        this.setAttribute('aria-label', `第 ${parseInt(this.dataset.index) + 1} 張卡片，已翻開`);
        flippedCards.push(this);
        playSound(flipSound);

        this.style.animation = 'flipAnimation 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';

        if (flippedCards.length === 2) {
            moves++;
            updateMovesDisplay();
            setTimeout(checkMatch, 600);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const card1Number = parseInt(card1.dataset.cardNumber);
    const card2Number = parseInt(card2.dataset.cardNumber);

    let isMatch = false;

    if (gameLevel === 'beginner') {
        isMatch = Math.ceil(card1Number / 2) === Math.ceil(card2Number / 2);
    } else if (gameLevel === 'medium') {
        isMatch = Math.ceil((card1Number - 10) / 2) === Math.ceil((card2Number - 10) / 2);
    } else if (gameLevel === 'advanced') {
        isMatch = Math.ceil((card1Number - 20) / 2) === Math.ceil((card2Number - 20) / 2);
    }

    if (isMatch) {
        playSound(matchSound);
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.setAttribute('aria-label', '已配對');
        card2.setAttribute('aria-label', '已配對');
        score++;
        updateScoreDisplay();
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        card1.removeEventListener('keydown', handleCardKey);
        card2.removeEventListener('keydown', handleCardKey);
        card1.setAttribute('tabindex', '-1');
        card2.setAttribute('tabindex', '-1');

        card1.style.animation = 'matchAnimation 1.5s ease-in-out, glowAnimation 2s infinite';
        card2.style.animation = 'matchAnimation 1.5s ease-in-out, glowAnimation 2s infinite';

        createParticles(card1);
        createParticles(card2);

        if (score === totalCards / 2) {
            stopTimer();
            setTimeout(showWinModal, 800);
        }
    } else {
        card1.classList.add('mismatch');
        card2.classList.add('mismatch');
        playSound(mismatchSound);
        setTimeout(() => {
            card1.classList.remove('flipped', 'mismatch');
            card2.classList.remove('flipped', 'mismatch');
            card1.setAttribute('aria-label', `第 ${parseInt(card1.dataset.index) + 1} 張卡片，未翻開`);
            card2.setAttribute('aria-label', `第 ${parseInt(card2.dataset.index) + 1} 張卡片，未翻開`);
            card1.style.animation = 'shakeAnimation 0.5s ease-in-out, flipBackAnimation 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
            card2.style.animation = 'shakeAnimation 0.5s ease-in-out, flipBackAnimation 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
        }, 1000);
    }
    flippedCards = [];
}

function updateScoreDisplay() {
    if (scoreDisplay) scoreDisplay.textContent = `配對成功: ${score}`;
}

function updateMovesDisplay() {
    if (movesDisplay) movesDisplay.textContent = `移動次數: ${moves}`;
}

function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateTimerDisplay() {
    if (timerDisplay) timerDisplay.textContent = `時間: ${formatTime(elapsedSeconds)}`;
}

function startTimer() {
    timerStarted = true;
    startTime = Date.now();
    elapsedSeconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    timerStarted = false;
    elapsedSeconds = 0;
    updateTimerDisplay();
}

function readBest() {
    try {
        const raw = localStorage.getItem(BEST_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

function writeBest(record) {
    try { localStorage.setItem(BEST_KEY, JSON.stringify(record)); } catch (e) {}
}

function maybeUpdateBest(currentMoves, currentTime) {
    const prev = readBest();
    let updated = false;
    const next = prev ? { ...prev } : { moves: Infinity, time: Infinity };
    if (currentMoves < next.moves) { next.moves = currentMoves; updated = true; }
    if (currentTime < next.time) { next.time = currentTime; updated = true; }
    if (updated) writeBest(next);
    return { record: next, isNewRecord: updated };
}

function showWinModal() {
    const modal = document.getElementById('win-modal');
    if (!modal) {
        alert(`恭喜！你完成了遊戲，總共移動 ${moves} 次。`);
        return;
    }
    document.getElementById('win-moves').textContent = moves;
    document.getElementById('win-time').textContent = formatTime(elapsedSeconds);

    const { record, isNewRecord } = maybeUpdateBest(moves, elapsedSeconds);
    const bestEl = document.getElementById('win-best');
    if (bestEl) {
        if (isNewRecord) {
            bestEl.textContent = `🏆 新紀錄！個人最佳 ${record.moves} 步 / ${formatTime(record.time)}`;
        } else {
            bestEl.textContent = `個人最佳：${record.moves} 步 / ${formatTime(record.time)}`;
        }
    }

    modal.hidden = false;
    modal.classList.add('is-open');

    if (typeof confetti === 'function') {
        const duration = 2500;
        const end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 } });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    }

    const againBtn = document.getElementById('win-again');
    if (againBtn) {
        againBtn.onclick = () => {
            modal.hidden = true;
            modal.classList.remove('is-open');
            restartGame();
        };
    }
}

function createParticles(card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.backgroundColor = getRandomColor();
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        document.body.appendChild(particle);

        setTimeout(() => { particle.remove(); }, 1000);
    }
}

function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD700', '#FF69B4', '#00CED1'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function restartGame() {
    playSound(restartSound);
    score = 0;
    moves = 0;
    resetTimer();
    updateScoreDisplay();
    updateMovesDisplay();
    createBoard();
}

function playSound(sound) {
    if (!isMuted && sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.error('Error playing sound:', error));
    }
}

function toggleMute() {
    isMuted = !isMuted;
    if (muteIcon) {
        if (isMuted) {
            muteIcon.classList.remove('bi-volume-up-fill');
            muteIcon.classList.add('bi-volume-mute-fill');
            backgroundMusic.pause();
        } else {
            muteIcon.classList.remove('bi-volume-mute-fill');
            muteIcon.classList.add('bi-volume-up-fill');
            playBackgroundMusic();
        }
    }
}

function createFloatingFlowers() {
    const container = document.querySelector('.container');
    if (!container) return;
    for (let i = 0; i < 10; i++) {
        const flower = document.createElement('div');
        flower.classList.add('flower');

        const direction = Math.random() < 0.5 ? 'left-to-right' : 'right-to-left';
        flower.classList.add(direction);

        flower.style.top = `${Math.random() * 100}vh`;
        flower.style.animationDuration = `${15 + Math.random() * 10}s`;

        container.appendChild(flower);
    }
}

function addRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    ripple.addEventListener('animationend', () => { ripple.remove(); });
}

function playBackgroundMusic() {
    if (backgroundMusic && !isMuted) {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().catch(error => {
            console.error('Error playing background music:', error);
            createPlayMusicButton();
        });
    }
}

function createPlayMusicButton() {
    const existingButton = document.getElementById('play-music-button');
    if (existingButton) return;

    const playButton = document.createElement('button');
    playButton.id = 'play-music-button';
    playButton.textContent = '播放背景音樂';
    playButton.classList.add('btn', 'btn-secondary', 'mt-2', 'ms-2');
    playButton.addEventListener('click', () => {
        backgroundMusic.play().then(() => { playButton.remove(); })
            .catch(error => { console.error('Error playing background music:', error); });
    });

    const gameStats = document.querySelector('#game-stats');
    if (gameStats) gameStats.appendChild(playButton);
}

function initializeGame() {
    preloadImages();
    createBoard();
    createFloatingFlowers();
    createPlayMusicButton();

    if (restartButton) {
        restartButton.addEventListener('click', (event) => {
            addRippleEffect(event);
            restartGame();
        });
    }

    if (muteButton) muteButton.addEventListener('click', toggleMute);

    updateScoreDisplay();
    updateMovesDisplay();
    updateTimerDisplay();
}

document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

window.addEventListener('error', function(event) {
    console.error('Caught error:', event.error);
});
