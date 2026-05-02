// audio.js — 音效播放、靜音切換、背景音樂

let isMuted = false;
let flipSound, matchSound, mismatchSound, restartSound, backgroundMusic, muteIcon;

export function initAudio() {
    flipSound = document.getElementById('flipSound');
    matchSound = document.getElementById('matchSound');
    mismatchSound = document.getElementById('mismatchSound');
    restartSound = document.getElementById('restartSound');
    backgroundMusic = document.getElementById('backgroundMusic');
    muteIcon = document.getElementById('mute-icon');
}

const SOUND_MAP = () => ({
    flip: flipSound, match: matchSound, mismatch: mismatchSound, restart: restartSound,
});

export function playSound(name) {
    const sound = SOUND_MAP()[name];
    if (!isMuted && sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

export function toggleMute() {
    isMuted = !isMuted;
    if (muteIcon) {
        if (isMuted) {
            muteIcon.classList.remove('fa-volume-up');
            muteIcon.classList.add('fa-volume-mute');
            backgroundMusic && backgroundMusic.pause();
        } else {
            muteIcon.classList.remove('fa-volume-mute');
            muteIcon.classList.add('fa-volume-up');
            playBackgroundMusic();
        }
    }
}

export function playBackgroundMusic() {
    if (backgroundMusic && !isMuted) {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().catch(() => createPlayMusicButton());
    }
}

export function createPlayMusicButton() {
    if (document.getElementById('play-music-button')) return;
    const btn = document.createElement('button');
    btn.id = 'play-music-button';
    btn.textContent = '播放背景音樂';
    btn.classList.add('btn', 'btn-secondary', 'mt-2', 'ms-2');
    btn.addEventListener('click', () => {
        if (backgroundMusic) backgroundMusic.play().then(() => btn.remove()).catch(() => {});
    });
    const stats = document.querySelector('#game-stats');
    if (stats) stats.appendChild(btn);
}
