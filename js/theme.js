// ===== Theme Switcher =====
(function initTheme() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThemeSwitcher);
  } else {
    setupThemeSwitcher();
  }
})();

function setupThemeSwitcher() {
  // Define your selectors and constants
  const themeTab = '.theme-tab';
  const switcherBtn = '.switcher-btn';
  const root = document.documentElement;
  const dataTheme = 'data-theme';
  const active = 'active';
  const open = 'open';
  const light = 'light';
  const themeKey = 'theme';

  const toggleTheme = document.querySelector(themeTab);
  const switcher = document.querySelectorAll(switcherBtn);
  const currentTheme = localStorage.getItem(themeKey);

  // Apply saved theme
  if (currentTheme === 'dark') {
    root.setAttribute(dataTheme, currentTheme);
    switcher.forEach((btn) => btn.classList.remove(active));
    switcher[1]?.classList.add(active);
  } else {
    root.setAttribute(dataTheme, light);
    switcher[0]?.classList.add(active);
  }

  // Toggle panel open/close
  toggleTheme?.addEventListener('click', function () {
    const panel = this.closest('.theme-panel');
    panel?.classList.toggle(open);
  });

  // Switch theme
  switcher.forEach((button) => {
    button.addEventListener('click', function () {
      const selected = this.dataset.toggle;
      switcher.forEach((btn) => btn.classList.remove(active));
      this.classList.add(active);
      root.setAttribute(dataTheme, selected);
      localStorage.setItem(themeKey, selected);
    });
  });

  // ===== Tab Switching =====
  document.querySelectorAll('.tab-button').forEach((button) => {
    button.addEventListener('click', () => {
      document
        .querySelectorAll('.tab-button')
        .forEach((btn) => btn.classList.remove('active'));
      document
        .querySelectorAll('.tab-content')
        .forEach((tab) => tab.classList.remove('active'));

      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId)?.classList.add('active');
    });
  });
}
