const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const movesDisplay = document.getElementById('moves');
const restartButton = document.getElementById('restart');

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

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = `Moves: ${moves}`;
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.style.backgroundImage === card2.style.backgroundImage) {
        score++;
        scoreDisplay.textContent = `Matches: ${score}`;
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        if (score === totalCards / 2) {
            alert(`Congratulations! You completed the game in ${moves} moves.`);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.style.backgroundImage = `url('/static/images/${cardBackImage}')`;
        card2.style.backgroundImage = `url('/static/images/${cardBackImage}')`;
    }
    flippedCards = [];
}

function restartGame() {
    score = 0;
    moves = 0;
    scoreDisplay.textContent = 'Matches: 0';
    movesDisplay.textContent = 'Moves: 0';
    createBoard();
}

restartButton.addEventListener('click', restartGame);
preloadImages();
createBoard();
