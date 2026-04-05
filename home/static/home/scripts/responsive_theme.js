const STORE_THEME_KEY = "adega_user_theme";
const STORE_FONT_KEY = "adega_user_font_size";

function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
}

function applyTheme(theme) {
  let activeTheme = theme;
  if (theme === "system") {
    activeTheme = getSystemTheme();
  }

  document.documentElement.setAttribute("data-bs-theme", activeTheme);
  
  const shadowSm = document.querySelectorAll(".shadow");
  if (activeTheme === "dark" || activeTheme === "high-contrast") {
    shadowSm.forEach((el) => {
      el.style.setProperty("--bs-box-shadow", "0 0.5em 1rem rgba(255, 255, 255, 0.15)");
    });
  } else {
    shadowSm.forEach((el) => {
      el.style.setProperty("--bs-box-shadow", "0 0.5rem 1rem rgba(40, 0, 0, 0.15)");
    });
  }
}

function setTheme(theme) {
  localStorage.setItem(STORE_THEME_KEY, theme);
  applyTheme(theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem(STORE_THEME_KEY) || "system";
  applyTheme(savedTheme);

  // Listen to system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem(STORE_THEME_KEY) === "system") {
      applyTheme("system");
    }
  });
}

function applyFontSize(sizeRatio) {
  // Ensure reasonably bounded scaling (e.g. 50% to 300%)
  const clamped = Math.max(0.5, Math.min(sizeRatio, 3.0));
  document.documentElement.style.fontSize = `${clamped * 100}%`;
}

function changeFontSize(delta) {
  let currentRatio = parseFloat(localStorage.getItem(STORE_FONT_KEY)) || 1.0;
  currentRatio += delta;
  // Ensure bounds before save too
  currentRatio = Math.max(0.5, Math.min(currentRatio, 3.0));
  localStorage.setItem(STORE_FONT_KEY, currentRatio.toString());
  applyFontSize(currentRatio);
}

function initFontSize() {
  const savedRatio = parseFloat(localStorage.getItem(STORE_FONT_KEY)) || 1.0;
  applyFontSize(savedRatio);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFontSize();

  // Setup theme buttons
  const themeButtons = document.querySelectorAll("[data-theme-value]");
  themeButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const theme = btn.getAttribute("data-theme-value");
      setTheme(theme);
      e.preventDefault();
    });
  });

  // Setup font size buttons
  const btnDecrease = document.getElementById("btn-decrease-font");
  const btnIncrease = document.getElementById("btn-increase-font");
  
  if (btnDecrease) {
    btnDecrease.addEventListener("click", (e) => {
      changeFontSize(-0.1);
      e.preventDefault();
    });
  }
  
  if (btnIncrease) {
    btnIncrease.addEventListener("click", (e) => {
      changeFontSize(0.1);
      e.preventDefault();
    });
  }
});

// Run immediate init to avoid flash of wrong theme/size
initTheme();
initFontSize();
