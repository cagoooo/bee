const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const movesDisplay = document.getElementById('moves');
const restartButton = document.getElementById('restart');
const toggleMusicButton = document.getElementById('toggleMusic');
const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');
const mismatchSound = document.getElementById('mismatchSound');
const restartSound = document.getElementById('restartSound');
const backgroundMusic = document.getElementById('backgroundMusic');

const cardBackImage = 'card-back.jpg';
const cardImages = ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg'];
const totalCards = 20;

let cards = [];
let flippedCards = [];
let score = 0;
let moves = 0;
let isMusicPlaying = false;

function preloadImages() {
    const images = [cardBackImage, ...cardImages];
    images.forEach((image) => {
        const img = new Image();
        img.src = `/static/images/${image}`;
    });
}

function createBoard() {
    gameBoard.innerHTML = '';
    cards = [...cardImages, ...cardImages, ...cardImages, ...cardImages].sort(() => Math.random() - 0.5);
    cards.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.style.backgroundImage = `url('/static/images/${cardBackImage}')`;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.style.backgroundImage = `url('/static/images/${cards[this.dataset.index]}')`;
        flippedCards.push(this);
        if (flipSound) flipSound.play();

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = `移動次數: ${moves}`;
            setTimeout(checkMatch, 300);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.style.backgroundImage === card2.style.backgroundImage) {
        if (matchSound) matchSound.play();
        score++;
        scoreDisplay.textContent = `配對成功: ${score}`;
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        if (score === totalCards / 2) {
            alert(`恭喜！你完成了遊戲，總共移動 ${moves} 次。`);
        }
    } else {
        if (mismatchSound) mismatchSound.play();
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.style.backgroundImage = `url('/static/images/${cardBackImage}')`;
            card2.style.backgroundImage = `url('/static/images/${cardBackImage}')`;
        }, 300);
    }
    flippedCards = [];
}

function restartGame() {
    if (restartSound) restartSound.play();
    score = 0;
    moves = 0;
    scoreDisplay.textContent = '配對成功: 0';
    movesDisplay.textContent = '移動次數: 0';
    createBoard();
}

function toggleMusic() {
    if (isMusicPlaying) {
        fadeOutMusic();
    } else {
        fadeInMusic();
    }
    isMusicPlaying = !isMusicPlaying;
    toggleMusicButton.textContent = isMusicPlaying ? '🔊' : '🔇';
}

function fadeInMusic() {
    backgroundMusic.play();
    let volume = 0;
    const fadeInterval = setInterval(() => {
        if (volume < 1) {
            volume += 0.1;
            backgroundMusic.volume = volume;
        } else {
            clearInterval(fadeInterval);
        }
    }, 100);
}

function fadeOutMusic() {
    let volume = 1;
    const fadeInterval = setInterval(() => {
        if (volume > 0) {
            volume -= 0.1;
            backgroundMusic.volume = volume;
        } else {
            clearInterval(fadeInterval);
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
    }, 100);
}

if (flipSound) flipSound.onerror = () => console.error('Error loading flip sound');
if (matchSound) matchSound.onerror = () => console.error('Error loading match sound');
if (mismatchSound) mismatchSound.onerror = () => console.error('Error loading mismatch sound');
if (restartSound) restartSound.onerror = () => console.error('Error loading restart sound');
if (backgroundMusic) backgroundMusic.onerror = () => console.error('Error loading background music');

restartButton.addEventListener('click', restartGame);
toggleMusicButton.addEventListener('click', toggleMusic);

preloadImages();
createBoard();
