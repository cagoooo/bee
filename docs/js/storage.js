// storage.js — 個人最佳紀錄持久化（localStorage）

function key(themeKey, levelKey) { return `bee-best-${themeKey}-${levelKey}`; }
function legacyKey(levelKey) { return `bee-best-${levelKey}`; }

export function readBest(themeKey, levelKey) {
    try {
        let raw = localStorage.getItem(key(themeKey, levelKey));
        if (!raw && themeKey === 'bees') raw = localStorage.getItem(legacyKey(levelKey));
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

export function writeBest(themeKey, levelKey, record) {
    try { localStorage.setItem(key(themeKey, levelKey), JSON.stringify(record)); } catch (e) {}
}

export function maybeUpdateBest(themeKey, levelKey, currentMoves, currentTime) {
    const prev = readBest(themeKey, levelKey);
    let updated = false;
    const next = prev ? { ...prev } : { moves: Infinity, time: Infinity };
    if (currentMoves < next.moves) { next.moves = currentMoves; updated = true; }
    if (currentTime < next.time) { next.time = currentTime; updated = true; }
    if (updated) writeBest(themeKey, levelKey, next);
    return { record: next, isNewRecord: updated };
}
