const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const navigationLinks = [...document.querySelectorAll(".primary-nav a")];
const themeButton = document.querySelector(".theme-toggle");
const themeIcon = themeButton.querySelector("[data-theme-icon]");
const themeLabel = themeButton.querySelector("[data-theme-label]");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, savePreference = false) {
  const isLight = theme === "light";
  document.documentElement.dataset.theme = isLight ? "light" : "dark";
  themeButton.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} mode`);
  themeButton.title = `Switch to ${isLight ? "dark" : "light"} mode`;
  themeIcon.textContent = isLight ? "☾" : "☼";
  themeLabel.textContent = isLight ? "Dark mode" : "Light mode";
  themeColorMeta?.setAttribute("content", isLight ? "#f8f6fb" : "#100b1b");

  if (savePreference) {
    try {
      localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    } catch {
      // The theme still changes for this page view if storage is unavailable.
    }
  }
}

let initialTheme = "dark";
try {
  if (localStorage.getItem("portfolio-theme") === "light") initialTheme = "light";
} catch {
  // Use the default dark theme if browser storage is unavailable.
}
applyTheme(initialTheme);

themeButton.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme, true);
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${entry.target.id}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach((section) => observer.observe(section));
