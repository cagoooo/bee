const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const movesDisplay = document.getElementById('moves');
const restartButton = document.getElementById('restart');
const muteButton = document.getElementById('mute-button');
const muteIcon = document.getElementById('mute-icon');
const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');
const mismatchSound = document.getElementById('mismatchSound');
const restartSound = document.getElementById('restartSound');
const backgroundMusic = document.getElementById('backgroundMusic');

const cardBackImage = 'card-back.jpg';
const cardImages = ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg', 'card6.jpg', 'card7.jpg', 'card8.jpg', 'card9.jpg', 'card10.jpg'];
const totalCards = 10;

let cards = [];
let flippedCards = [];
let score = 0;
let moves = 0;
let isMuted = false;

function preloadImages() {
    const images = [cardBackImage, ...cardImages];
    images.forEach((image) => {
        const img = new Image();
        img.src = `/static/images/${image}`;
    });
}

function createBoard() {
    gameBoard.innerHTML = '';
    let cardPairs = cardImages.slice(0, 5);
    cards = [...cardPairs, ...cardPairs].sort(() => Math.random() - 0.5);
    cards.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        
        const front = document.createElement('div');
        front.classList.add('front');
        front.style.backgroundImage = `url('/static/images/${image}')`;
        front.style.backgroundSize = 'cover';
        front.style.backgroundPosition = 'center';
        
        const back = document.createElement('div');
        back.classList.add('back');
        
        card.appendChild(front);
        card.appendChild(back);
        
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);

        console.log('Card front image:', `/static/images/${image}`);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);
        playSound(flipSound);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = `移動次數: ${moves}`;
            setTimeout(checkMatch, 600);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.querySelector('.front').style.backgroundImage === card2.querySelector('.front').style.backgroundImage;

    if (isMatch) {
        playSound(matchSound);
        card1.classList.add('matched');
        card2.classList.add('matched');
        score++;
        scoreDisplay.textContent = `配對成功: ${score}`;
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        if (score === 5) {  // 5 pairs
            setTimeout(() => {
                alert(`恭喜！你完成了遊戲，總共移動 ${moves} 次。`);
            }, 500);
        }
    } else {
        playSound(mismatchSound);
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 600);
    }
    flippedCards = [];
}

function restartGame() {
    playSound(restartSound);
    score = 0;
    moves = 0;
    scoreDisplay.textContent = '配對成功: 0';
    movesDisplay.textContent = '移動次數: 0';
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
    if (isMuted) {
        muteIcon.classList.remove('bi-volume-up-fill');
        muteIcon.classList.add('bi-volume-mute-fill');
        backgroundMusic.pause();
    } else {
        muteIcon.classList.remove('bi-volume-mute-fill');
        muteIcon.classList.add('bi-volume-up-fill');
        backgroundMusic.play().catch(error => console.error('Error playing background music:', error));
    }
}

restartButton.addEventListener('click', restartGame);
muteButton.addEventListener('click', toggleMute);

window.addEventListener('load', () => {
    backgroundMusic.play().catch(error => console.error('Error playing background music:', error));
});

preloadImages();
createBoard();
