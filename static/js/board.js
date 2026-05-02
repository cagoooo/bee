// board.js — 棋盤建立、翻牌、配對判定

import { renderFace } from './theme.js';
import { playSound } from './audio.js';
import { createParticles, isTimerStarted, startTimer, stopTimer } from './ui.js';

let gameBoard, scoreDisplay, movesDisplay;
let levelData, cardBack;
let totalPairs = 0;
let flippedCards = [];
let score = 0;
let moves = 0;
let onComplete = null;

export function initBoard({ levelData: ld, cardBack: cb, onComplete: cb2 }) {
    gameBoard = document.getElementById('game-board');
    scoreDisplay = document.getElementById('score');
    movesDisplay = document.getElementById('moves');
    levelData = ld;
    cardBack = cb;
    totalPairs = ld.pairs.length;
    onComplete = cb2;
}

export function getScore() { return score; }
export function getMoves() { return moves; }

export function resetState() {
    score = 0;
    moves = 0;
    flippedCards = [];
    updateScoreDisplay();
    updateMovesDisplay();
}

function updateScoreDisplay() {
    if (scoreDisplay) scoreDisplay.textContent = `配對成功: ${score}`;
}
function updateMovesDisplay() {
    if (movesDisplay) movesDisplay.textContent = `移動次數: ${moves}`;
}

export function createBoard() {
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

function flipCard() {
    if (flippedCards.length >= 2 || this.classList.contains('flipped')) return;
    if (!isTimerStarted()) startTimer();
    this.classList.add('flipped');
    this.setAttribute('aria-label', `第 ${parseInt(this.dataset.index) + 1} 張卡片，已翻開`);
    flippedCards.push(this);
    playSound('flip');
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
        playSound('match');
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
            setTimeout(() => onComplete && onComplete({ moves, totalPairs }), 800);
        }
    } else {
        card1.classList.add('mismatch');
        card2.classList.add('mismatch');
        playSound('mismatch');
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
