// ============================================================
// 蜂勤耘友配對消消樂 — 主題包驅動版本
// 透過 themes.json 抽出卡片資料，支援圖片卡與文字卡
// URL 參數：?theme=xxx&level=xxx 可切換主題或難度
// ============================================================

const SUPPORTS_WEBP = (() => {
    try {
        const c = document.createElement('canvas');
        return !!(c.getContext && c.getContext('2d') &&
            c.toDataURL('image/webp').indexOf('data:image/webp') === 0);
    } catch (e) { return false; }
})();
function imgUrl(name) {
    if (SUPPORTS_WEBP) return `images/${name}`;
    return `images/${name.replace(/\.webp$/i, '.jpg').replace(/\.png$/i, '.png')}`;
}

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

const params = new URLSearchParams(location.search);
const themeKey = params.get('theme') || 'bees';
let levelKey = params.get('level') || document.body.dataset.level || 'beginner';

let theme = null;
let levelData = null;
let totalPairs = 0;
let cardBack = { image: 'card-back.webp' };

let flippedCards = [];
let score = 0;
let moves = 0;
let isMuted = false;

let timerInterval = null;
let startTime = 0;
let elapsedSeconds = 0;
let timerStarted = false;

const BEST_KEY = `bee-best-${themeKey}-${levelKey}`;
const LEGACY_BEST_KEY = `bee-best-${levelKey}`;

// ----------- 主題載入 -----------
async function loadTheme() {
    const res = await fetch('themes.json', { cache: 'no-cache' });
    const data = await res.json();
    theme = data.themes[themeKey] || data.themes[data.defaultTheme];
    if (!theme) throw new Error(`Theme "${themeKey}" not found`);
    levelData = theme.levels[levelKey] || theme.levels.beginner;
    totalPairs = levelData.pairs.length;
    if (theme.cardBack) cardBack = theme.cardBack;
    document.title = `${theme.name} - ${levelData.label}`;
}

// ----------- 渲染卡片正反面 -----------
function renderFace(faceEl, faceData) {
    if (!faceData) return;
    if (faceData.image) {
        faceEl.style.backgroundImage = `url('${imgUrl(faceData.image)}')`;
        faceEl.style.backgroundSize = 'cover';
        faceEl.style.backgroundPosition = 'center';
    } else if (faceData.text) {
        faceEl.textContent = faceData.text;
        faceEl.classList.add('card-face--text');
        if (faceData.bg) faceEl.style.backgroundColor = faceData.bg;
    }
}

function preloadImages() {
    const urls = new Set();
    if (cardBack.image) urls.add(imgUrl(cardBack.image));
    levelData.pairs.forEach(([a, b]) => {
        if (a && a.image) urls.add(imgUrl(a.image));
        if (b && b.image) urls.add(imgUrl(b.image));
    });
    urls.forEach((u) => { const img = new Image(); img.src = u; });
}

// ----------- 建立棋盤 -----------
function createBoard() {
    if (!gameBoard) return;
    gameBoard.innerHTML = '';
    const totalCards = totalPairs * 2;
    const gridColumns = Math.min(5, Math.ceil(Math.sqrt(totalCards * 1.25)));
    gameBoard.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;

    const deck = [];
    levelData.pairs.forEach((pair, pairId) => {
        deck.push({ pairId, face: pair[0] });
        deck.push({ pairId, face: pair[1] });
    });
    deck.sort(() => Math.random() - 0.5);

    deck.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.pairId = item.pairId;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `第 ${index + 1} 張卡片，未翻開`);

        const front = document.createElement('div');
        front.classList.add('front');
        renderFace(front, item.face);

        const back = document.createElement('div');
        back.classList.add('back');
        renderFace(back, cardBack);

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

// ----------- 翻牌 / 配對 -----------
function flipCard() {
    if (flippedCards.length >= 2 || this.classList.contains('flipped')) return;
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

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.pairId === card2.dataset.pairId;

    if (isMatch) {
        playSound(matchSound);
        [card1, card2].forEach((c) => {
            c.classList.add('matched');
            c.setAttribute('aria-label', '已配對');
            c.removeEventListener('click', flipCard);
            c.removeEventListener('keydown', handleCardKey);
            c.setAttribute('tabindex', '-1');
            c.style.animation = 'matchAnimation 1.5s ease-in-out, glowAnimation 2s infinite';
        });
        score++;
        updateScoreDisplay();
        createParticles(card1);
        createParticles(card2);

        if (score === totalPairs) {
            stopTimer();
            setTimeout(showWinModal, 800);
        }
    } else {
        card1.classList.add('mismatch');
        card2.classList.add('mismatch');
        playSound(mismatchSound);
        setTimeout(() => {
            [card1, card2].forEach((c) => {
                c.classList.remove('flipped', 'mismatch');
                c.setAttribute('aria-label', `第 ${parseInt(c.dataset.index) + 1} 張卡片，未翻開`);
                c.style.animation = 'shakeAnimation 0.5s ease-in-out, flipBackAnimation 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
            });
        }, 1000);
    }
    flippedCards = [];
}

// ----------- 顯示更新 -----------
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

// ----------- 計時器 -----------
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
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}
function resetTimer() {
    stopTimer();
    timerStarted = false;
    elapsedSeconds = 0;
    updateTimerDisplay();
}

// ----------- 個人最佳紀錄 -----------
function readBest() {
    try {
        let raw = localStorage.getItem(BEST_KEY);
        if (!raw) {
            // legacy migration: bees 主題從舊 key 讀
            if (themeKey === 'bees') raw = localStorage.getItem(LEGACY_BEST_KEY);
        }
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
        bestEl.textContent = isNewRecord
            ? `🏆 新紀錄！個人最佳 ${record.moves} 步 / ${formatTime(record.time)}`
            : `個人最佳：${record.moves} 步 / ${formatTime(record.time)}`;
    }

    modal.hidden = false;
    modal.classList.add('is-open');

    if (typeof confetti === 'function') {
        const end = Date.now() + 2500;
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

// ----------- 粒子特效 / 漂浮花朵 -----------
function createParticles(card) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.backgroundColor = getRandomColor();
        p.style.left = `${cx}px`;
        p.style.top = `${cy}px`;
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 100 + 50;
        p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}
function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD700', '#FF69B4', '#00CED1'];
    return colors[Math.floor(Math.random() * colors.length)];
}
function createFloatingFlowers() {
    const container = document.querySelector('.container');
    if (!container) return;
    for (let i = 0; i < 10; i++) {
        const flower = document.createElement('div');
        flower.classList.add('flower', Math.random() < 0.5 ? 'left-to-right' : 'right-to-left');
        flower.style.top = `${Math.random() * 100}vh`;
        flower.style.animationDuration = `${15 + Math.random() * 10}s`;
        container.appendChild(flower);
    }
}

// ----------- 控制 -----------
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
        sound.play().catch(() => {});
    }
}
function toggleMute() {
    isMuted = !isMuted;
    if (muteIcon) {
        if (isMuted) {
            muteIcon.classList.remove('bi-volume-up-fill');
            muteIcon.classList.add('bi-volume-mute-fill');
            backgroundMusic && backgroundMusic.pause();
        } else {
            muteIcon.classList.remove('bi-volume-mute-fill');
            muteIcon.classList.add('bi-volume-up-fill');
            playBackgroundMusic();
        }
    }
}
function addRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}
function playBackgroundMusic() {
    if (backgroundMusic && !isMuted) {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().catch(() => createPlayMusicButton());
    }
}
function createPlayMusicButton() {
    if (document.getElementById('play-music-button')) return;
    const btn = document.createElement('button');
    btn.id = 'play-music-button';
    btn.textContent = '播放背景音樂';
    btn.classList.add('btn', 'btn-secondary', 'mt-2', 'ms-2');
    btn.addEventListener('click', () => {
        backgroundMusic.play().then(() => btn.remove()).catch(() => {});
    });
    const stats = document.querySelector('#game-stats');
    if (stats) stats.appendChild(btn);
}

// ----------- 主題標題顯示 -----------
function renderThemeBadge() {
    const titleEl = document.querySelector('.colorful-title');
    if (!titleEl || !theme) return;
    const existing = document.querySelector('.theme-badge');
    if (existing) existing.remove();
    if (themeKey !== 'bees' || levelKey !== (document.body.dataset.level || 'beginner')) {
        const badge = document.createElement('div');
        badge.className = 'theme-badge';
        badge.innerHTML = `<span class="theme-badge__icon">${theme.icon || '🎴'}</span> ${theme.name} · ${levelData.label}`;
        titleEl.insertAdjacentElement('afterend', badge);
    }
}

// ----------- 初始化 -----------
async function initializeGame() {
    try {
        await loadTheme();
    } catch (e) {
        console.error('Failed to load theme:', e);
        if (gameBoard) gameBoard.innerHTML = '<p class="text-center text-light p-4">主題載入失敗，請重新整理頁面。</p>';
        return;
    }
    renderThemeBadge();
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

document.addEventListener('DOMContentLoaded', initializeGame);
window.addEventListener('error', (e) => console.error('Caught error:', e.error));
