// Existing code...

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);
        playSound(flipSound);

        this.style.animation = 'flipAnimation 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
        
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
    
    const isMatch = (Math.min(card1Number, card2Number) % 2 === 1) && 
                    (Math.max(card1Number, card2Number) - Math.min(card1Number, card2Number) === 1);

    if (isMatch) {
        playSound(matchSound);
        card1.classList.add('matched');
        card2.classList.add('matched');
        score++;
        scoreDisplay.textContent = `配對成功: ${score}`;
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        
        card1.style.animation = 'matchAnimation 1.5s ease-in-out, matchedPulse 2s infinite';
        card2.style.animation = 'matchAnimation 1.5s ease-in-out, matchedPulse 2s infinite';
        
        if (score === totalCards / 2) {
            setTimeout(() => {
                alert(`恭喜！你完成了遊戲，總共移動 ${moves} 次。`);
            }, 1500);
        }
    } else {
        card1.classList.add('mismatch');
        card2.classList.add('mismatch');
        playSound(mismatchSound);
        setTimeout(() => {
            card1.classList.remove('flipped', 'mismatch');
            card2.classList.remove('flipped', 'mismatch');
            card1.style.animation = 'flipBackAnimation 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
            card2.style.animation = 'flipBackAnimation 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
        }, 1000);
    }
    flippedCards = [];
}

// Existing code...
