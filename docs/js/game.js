// game.js — 入口模組（協調各 module，由 HTML <script type="module"> 載入）

import { parseUrlParams, loadTheme, imgUrl } from './theme.js';
import { initAudio, playSound, toggleMute, createPlayMusicButton } from './audio.js';
import { initBoard, createBoard, resetState, getMoves } from './board.js';
import {
    initTimer, resetTimer, startTimer, updateTimerDisplay,
    createFloatingFlowers, addRippleEffect, showWinModal, renderThemeBadge,
} from './ui.js';

const { themeKey, levelKey } = parseUrlParams();

function preloadImages(cardBack, levelData) {
    const urls = new Set();
    if (cardBack && cardBack.image) urls.add(imgUrl(cardBack.image));
    levelData.pairs.forEach(([a, b]) => {
        if (a && a.image) urls.add(imgUrl(a.image));
        if (b && b.image) urls.add(imgUrl(b.image));
    });
    urls.forEach((u) => { const img = new Image(); img.src = u; });
}

function restartGame() {
    playSound('restart');
    resetState();
    resetTimer();
    createBoard();
}

async function init() {
    initAudio();
    initTimer();
    let context;
    try {
        context = await loadTheme(themeKey, levelKey);
    } catch (e) {
        console.error('Failed to load theme:', e);
        const board = document.getElementById('game-board');
        if (board) board.innerHTML = '<p class="text-center text-light p-4">主題載入失敗，請重新整理頁面。</p>';
        return;
    }

    document.title = `${context.theme.name} - ${context.levelData.label}`;
    renderThemeBadge(context.theme, context.themeKey, context.levelData, context.levelKey);
    preloadImages(context.cardBack, context.levelData);

    initBoard({
        levelData: context.levelData,
        cardBack: context.cardBack,
        onComplete: ({ moves }) => showWinModal({
            themeKey: context.themeKey,
            levelKey: context.levelKey,
            moves,
            onAgain: restartGame,
        }),
    });
    createBoard();
    createFloatingFlowers();
    createPlayMusicButton();

    const restartButton = document.getElementById('restart');
    const muteButton = document.getElementById('mute-button');
    if (restartButton) {
        restartButton.addEventListener('click', (e) => {
            addRippleEffect(e);
            restartGame();
        });
    }
    if (muteButton) muteButton.addEventListener('click', toggleMute);

    resetState();
    updateTimerDisplay();
}

window.addEventListener('error', (e) => console.error('Caught error:', e.error));
init();
