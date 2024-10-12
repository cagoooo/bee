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
const cardImagesByDifficulty = {
    beginner: ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg', 'card6.jpg', 'card7.jpg', 'card8.jpg', 'card9.jpg', 'card10.jpg'],
    intermediate: ['card11.jpg', 'card12.jpg', 'card13.jpg', 'card14.jpg', 'card15.jpg', 'card16.jpg', 'card17.jpg', 'card18.jpg', 'card19.jpg', 'card20.jpg'],
    advanced: ['card21.jpg', 'card22.jpg', 'card23.jpg', 'card24.jpg', 'card25.jpg', 'card26.jpg', 'card27.jpg', 'card28.jpg', 'card29.jpg', 'card30.jpg']
};

let currentDifficulty = 'beginner';
let cards = [];
let flippedCards = [];
let score = 0;
let moves = 0;
let isMuted = false;

function preloadImages() {
    const allImages = [cardBackImage, ...Object.values(cardImagesByDifficulty).flat()];
    allImages.forEach((image) => {
        const img = new Image();
        img.src = `/static/images/${image}`;
    });
}

function createBoard() {
    gameBoard.innerHTML = '';
    const cardImages = cardImagesByDifficulty[currentDifficulty];
    cards = [...cardImages, ...cardImages].sort(() => Math.random() - 0.5);
    cards.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.cardNumber = parseInt(image.replace('card', '').replace('.jpg', ''));
        
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
    
    let isMatch;
    if (currentDifficulty === 'beginner') {
        isMatch = (Math.min(card1Number, card2Number) % 2 === 1) && 
                  (Math.max(card1Number, card2Number) - Math.min(card1Number, card2Number) === 1);
    } else {
        isMatch = Math.abs(card1Number - card2Number) === 1 && Math.floor((card1Number - 1) / 2) === Math.floor((card2Number - 1) / 2);
    }

    if (isMatch) {
        playSound(matchSound);
        card1.classList.add('matched');
        card2.classList.add('matched');
        score++;
        scoreDisplay.textContent = `配對成功: ${score}`;
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        createParticles(card1);
        createParticles(card2);
        if (score === cards.length / 2) {
            setTimeout(() => {
                alert(`恭喜！你完成了${getDifficultyName()}難度，總共移動 ${moves} 次。`);
            }, 1000);
        }
    } else {
        playSound(mismatchSound);
        card1.classList.add('shake');
        card2.classList.add('shake');
        setTimeout(() => {
            card1.classList.remove('flipped', 'shake');
            card2.classList.remove('flipped', 'shake');
        }, 600);
    }
    flippedCards = [];
}

function getDifficultyName() {
    switch (currentDifficulty) {
        case 'beginner':
            return '初級';
        case 'intermediate':
            return '中級';
        case 'advanced':
            return '高級';
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
    updateFloatingFlowers();
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
    container.querySelectorAll('.flower').forEach(flower => flower.remove());
    const flowerCount = getDifficultyFlowerCount();
    for (let i = 0; i < flowerCount; i++) {
        const flower = document.createElement('div');
        flower.classList.add('flower');
        
        const direction = Math.random() < 0.5 ? 'left-to-right' : 'right-to-left';
        flower.classList.add(direction);
        
        flower.style.top = `${Math.random() * 100}vh`;
        flower.style.animationDuration = `${getDifficultyFlowerSpeed()}s`;
        
        container.appendChild(flower);
    }
}

function getDifficultyFlowerCount() {
    switch (currentDifficulty) {
        case 'beginner':
            return 10;
        case 'intermediate':
            return 15;
        case 'advanced':
            return 20;
    }
}

function getDifficultyFlowerSpeed() {
    switch (currentDifficulty) {
        case 'beginner':
            return 15 + Math.random() * 10;
        case 'intermediate':
            return 10 + Math.random() * 8;
        case 'advanced':
            return 5 + Math.random() * 5;
    }
}

function updateFloatingFlowers() {
    createFloatingFlowers();
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

function changeDifficulty(difficulty) {
    currentDifficulty = difficulty;
    restartGame();
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

// Expose changeDifficulty function to global scope
window.changeDifficulty = changeDifficulty;
