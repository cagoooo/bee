// ui.js — 視覺特效、計時器、完成彈窗、主題徽章

import { maybeUpdateBest } from './storage.js';

const PARTICLE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD700', '#FF69B4', '#00CED1'];

// ----- 粒子 / 漂浮花朵 / Ripple -----
export function createParticles(card) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.backgroundColor = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
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

export function createFloatingFlowers() {
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

export function addRippleEffect(event) {
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

// ----- 計時器 -----
let timerInterval = null;
let startTime = 0;
let elapsedSeconds = 0;
let timerStarted = false;
let timerDisplay = null;

export function initTimer() { timerDisplay = document.getElementById('timer'); }

export function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

export function updateTimerDisplay() {
    if (timerDisplay) timerDisplay.textContent = `時間: ${formatTime(elapsedSeconds)}`;
}

export function startTimer() {
    timerStarted = true;
    startTime = Date.now();
    elapsedSeconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        updateTimerDisplay();
    }, 1000);
}

export function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

export function resetTimer() {
    stopTimer();
    timerStarted = false;
    elapsedSeconds = 0;
    updateTimerDisplay();
}

export function isTimerStarted() { return timerStarted; }
export function getElapsedSeconds() { return elapsedSeconds; }

// ----- 完成彈窗 + 彩帶 -----
export function showWinModal({ themeKey, levelKey, moves, onAgain }) {
    const time = elapsedSeconds;
    const modal = document.getElementById('win-modal');
    if (!modal) {
        alert(`恭喜！你完成了遊戲，總共移動 ${moves} 次。`);
        return;
    }
    document.getElementById('win-moves').textContent = moves;
    document.getElementById('win-time').textContent = formatTime(time);

    const { record, isNewRecord } = maybeUpdateBest(themeKey, levelKey, moves, time);
    const bestEl = document.getElementById('win-best');
    if (bestEl) {
        bestEl.textContent = isNewRecord
            ? `🏆 新紀錄！個人最佳 ${record.moves} 步 / ${formatTime(record.time)}`
            : `個人最佳：${record.moves} 步 / ${formatTime(record.time)}`;
    }

    modal.hidden = false;
    modal.classList.add('is-open');
    fireConfetti();

    const againBtn = document.getElementById('win-again');
    if (againBtn) {
        againBtn.onclick = () => {
            modal.hidden = true;
            modal.classList.remove('is-open');
            onAgain && onAgain();
        };
    }
}

function fireConfetti() {
    if (typeof window.confetti !== 'function') return;
    const end = Date.now() + 2500;
    (function frame() {
        window.confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 } });
        window.confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

// ----- 主題徽章 -----
export function renderThemeBadge(theme, themeKey, levelData, levelKey) {
    const titleEl = document.querySelector('.colorful-title');
    if (!titleEl || !theme) return;
    const existing = document.querySelector('.theme-badge');
    if (existing) existing.remove();
    const defaultLevel = document.body.dataset.level || 'beginner';
    if (themeKey !== 'bees' || levelKey !== defaultLevel) {
        const badge = document.createElement('div');
        badge.className = 'theme-badge';
        badge.innerHTML = `<span class="theme-badge__icon">${theme.icon || '🎴'}</span> ${theme.name} · ${levelData.label}`;
        titleEl.insertAdjacentElement('afterend', badge);
    }
}
