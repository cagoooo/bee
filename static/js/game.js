const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const movesDisplay = document.getElementById('moves');
const restartButton = document.getElementById('restart');
const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');
const mismatchSound = document.getElementById('mismatchSound');
const restartSound = document.getElementById('restartSound');

const cardBackImage = 'card-back.jpg';
const cardImages = ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg'];
const totalCards = 20;

let cards = [];
let flippedCards = [];
let score = 0;
let moves = 0;

function preloadImages() {
    const images = [cardBackImage, ...cardImages];
    images.forEach((image) => {
        const img = new Image();
        img.src = `/static/images/${image}`;
    });
    console.log('Loading audio:', '/static/audio/card-flip.mp3');
    console.log('Loading audio:', '/static/audio/card-match.mp3');
    console.log('Loading audio:', '/static/audio/card-mismatch.mp3');
    console.log('Loading audio:', '/static/audio/restart.mp3');
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
        console.log('Playing flip sound');
        flipSound.play();

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = `移動次數: ${moves}`;
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.style.backgroundImage === card2.style.backgroundImage) {
        score++;
        scoreDisplay.textContent = `配對成功: ${score}`;
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        console.log('Playing match sound');
        matchSound.play();
        if (score === totalCards / 2) {
            alert(`恭喜！你完成了遊戲，總共移動 ${moves} 次。`);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.style.backgroundImage = `url('/static/images/${cardBackImage}')`;
            card2.style.backgroundImage = `url('/static/images/${cardBackImage}')`;
            console.log('Playing mismatch sound');
            mismatchSound.play();
        }, 500);
    }
    flippedCards = [];
}

function restartGame() {
    console.log('Playing restart sound');
    restartSound.play();
    score = 0;
    moves = 0;
    scoreDisplay.textContent = '配對成功: 0';
    movesDisplay.textContent = '移動次數: 0';
    createBoard();
}

flipSound.onerror = () => console.error('Error loading flip sound');
matchSound.onerror = () => console.error('Error loading match sound');
mismatchSound.onerror = () => console.error('Error loading mismatch sound');
restartSound.onerror = () => console.error('Error loading restart sound');

restartButton.addEventListener('click', restartGame);
preloadImages();
createBoard();
