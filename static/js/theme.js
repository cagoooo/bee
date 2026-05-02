// theme.js — 主題包載入、URL 參數解析、卡面渲染、WebP 偵測

export const SUPPORTS_WEBP = (() => {
    try {
        const c = document.createElement('canvas');
        return !!(c.getContext && c.getContext('2d') &&
            c.toDataURL('image/webp').indexOf('data:image/webp') === 0);
    } catch (e) { return false; }
})();

export function imgUrl(name) {
    if (SUPPORTS_WEBP) return `images/${name}`;
    return `images/${name.replace(/\.webp$/i, '.jpg')}`;
}

export function parseUrlParams(defaultLevel = 'beginner') {
    const params = new URLSearchParams(location.search);
    return {
        themeKey: params.get('theme') || 'bees',
        levelKey: params.get('level') || document.body.dataset.level || defaultLevel,
    };
}

export async function loadTheme(themeKey, levelKey) {
    const res = await fetch('/static/themes.json', { cache: 'no-cache' });
    const data = await res.json();
    const theme = data.themes[themeKey] || data.themes[data.defaultTheme];
    if (!theme) throw new Error(`Theme "${themeKey}" not found`);
    const levelData = theme.levels[levelKey] || theme.levels.beginner;
    const cardBack = theme.cardBack || { image: 'card-back.webp' };
    return { theme, themeKey, levelKey, levelData, cardBack, totalPairs: levelData.pairs.length };
}

export function renderFace(faceEl, faceData) {
    if (!faceData) return;
    if (faceData.image) {
        faceEl.style.backgroundImage = `url('${imgUrl(faceData.image)}')`;
        faceEl.style.backgroundSize = 'cover';
        faceEl.style.backgroundPosition = 'center';
    } else if (faceData.text) {
        faceEl.textContent = faceData.text;
        faceEl.classList.add('card-face--text');
        if (faceData.bg) faceEl.style.backgroundColor = faceData.bg;
    }
}
