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
const cardImages = ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg'];
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
    const shuffledCards = [...cardImages, ...cardImages].sort(() => Math.random() - 0.5);
    shuffledCards.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.cardNumber = image.replace('card', '').replace('.jpg', '');
        
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
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);
        playSound(flipSound);

        // Add flip animation
        this.style.animation = 'flipAnimation 0.6s ease-out';
        
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = `移動次數: ${moves}`;
            setTimeout(checkMatch, 600);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const card1Number = parseInt(card1.dataset.cardNumber);
    const card2Number = parseInt(card2.dataset.cardNumber);
    
    const isMatch = card1Number === card2Number;

    if (isMatch) {
        playSound(matchSound);
        card1.classList.add('matched');
        card2.classList.add('matched');
        score++;
        scoreDisplay.textContent = `配對成功: ${score}`;
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        
        // Add match animation
        card1.style.animation = 'matchAnimation 0.5s ease-in-out';
        card2.style.animation = 'matchAnimation 0.5s ease-in-out';
        
        createParticles(card1);
        createParticles(card2);
        if (score === 5) {  // 5 pairs
            setTimeout(() => {
                alert(`恭喜！你完成了遊戲，總共移動 ${moves} 次。`);
            }, 1000);
        }
    } else {
        playSound(mismatchSound);
        card1.classList.add('shake');
        card2.classList.add('shake');
        setTimeout(() => {
            card1.classList.remove('flipped', 'shake');
            card2.classList.remove('flipped', 'shake');
            
            // Add flip back animation
            card1.style.animation = 'flipBackAnimation 0.6s ease-out';
            card2.style.animation = 'flipBackAnimation 0.6s ease-out';
        }, 600);
    }
    flippedCards = [];
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
        particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
        particle.style.setProperty('--distance', `${Math.random() * 100 + 50}px`);
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    return colors[Math.floor(Math.random() * colors.length)];
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

function createFloatingFlowers() {
    const container = document.querySelector('.container');
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

    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

restartButton.addEventListener('click', (event) => {
    addRippleEffect(event);
    restartGame();
});
muteButton.addEventListener('click', toggleMute);

window.addEventListener('load', () => {
    backgroundMusic.play().catch(error => console.error('Error playing background music:', error));
    createFloatingFlowers();
});

preloadImages();
createBoard();
