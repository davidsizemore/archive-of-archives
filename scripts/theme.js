const THEME_PALETTES = [
  { bg: "#12121a", text: "#f6f2d8" },
  { bg: "#0f1a16", text: "#d7f7df" },
  { bg: "#17131f", text: "#f3dfff" },
  { bg: "#101722", text: "#dceeff" },
  { bg: "#1a120f", text: "#ffe8d8" },
  { bg: "#121712", text: "#e0f5d8" },
  { bg: "#1a141a", text: "#ffdff4" },
  { bg: "#0d1b1b", text: "#d7ffff" },
  { bg: "#1a1710", text: "#fff1c9" },
  { bg: "#12101a", text: "#e7dcff" },
  { bg: "#19110f", text: "#ffdcca" },
  { bg: "#10151a", text: "#d9f0ff" },
];

const LAST_THEME_INDEX_KEY = "aoa-last-theme-index";

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const isShortHex = normalized.length === 3;
  const fullHex = isShortHex
    ? normalized
        .split("")
        .map((char) => char + char)
        .join("")
    : normalized;

  const r = Number.parseInt(fullHex.slice(0, 2), 16);
  const g = Number.parseInt(fullHex.slice(2, 4), 16);
  const b = Number.parseInt(fullHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function pickThemeIndex() {
  if (THEME_PALETTES.length <= 1) {
    return 0;
  }

  const lastIndex = Number.parseInt(
    window.localStorage.getItem(LAST_THEME_INDEX_KEY) ?? "",
    10
  );

  let nextIndex = Math.floor(Math.random() * THEME_PALETTES.length);
  if (!Number.isNaN(lastIndex) && nextIndex === lastIndex) {
    nextIndex = (nextIndex + 1) % THEME_PALETTES.length;
  }

  window.localStorage.setItem(LAST_THEME_INDEX_KEY, String(nextIndex));
  return nextIndex;
}

function applyTheme() {
  const palette = THEME_PALETTES[pickThemeIndex()];
  const root = document.documentElement;

  root.style.setProperty("--bg", palette.bg);
  root.style.setProperty("--text", palette.text);
  root.style.setProperty("--text-muted", palette.text);
  root.style.setProperty("--border", palette.text);
  root.style.setProperty("--overlay", hexToRgba(palette.text, 0.24));
}

applyTheme();
