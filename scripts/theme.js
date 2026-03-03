const THEME_PALETTES = [
  { bg: "#102415", text: "#ffe84a" }, // deep green + bright yellow
  { bg: "#2b1a12", text: "#ff78c7" }, // dark brown + pink
  { bg: "#23123b", text: "#8dff6a" }, // deep purple + vivid green
  { bg: "#0d2236", text: "#ff8b3d" }, // navy + orange
  { bg: "#3a1313", text: "#42f3ff" }, // oxblood + cyan
  { bg: "#121f2d", text: "#ffd95e" }, // slate blue + warm yellow
  { bg: "#1d2b11", text: "#ff9ecb" }, // olive + rose
  { bg: "#25110f", text: "#79ffe0" }, // espresso + mint
  { bg: "#1f1430", text: "#b7ff3c" }, // aubergine + lime
  { bg: "#0f2a26", text: "#ff9d66" }, // teal + apricot
  { bg: "#2f1e0f", text: "#7fe9ff" }, // umber + sky
  { bg: "#161616", text: "#88ffd3" }, // charcoal + neon mint
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
  root.style.setProperty("--overlay", hexToRgba(palette.text, 0.22));
}

applyTheme();
