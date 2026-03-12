function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";

  // Use requestAnimationFrame for smoother transition
  requestAnimationFrame(() => {
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
  });

  const btn = document.getElementById("themeToggleBtn");
  btn.textContent = isDark ? "🌙" : "☀️";

  // Recreate stars with new theme colors
  setTimeout(createTinyStars, 100);
}

function toggleDarkModeWithSpin() {
  const btn = document.getElementById("themeToggleBtn");

  // Add spin class
  btn.classList.add("spin");

  // Trigger dark mode toggle
  toggleDarkMode();

  // Remove spin class after animation completes
  setTimeout(() => {
    btn.classList.remove("spin");
  }, 600); // Match animation duration
}

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (savedTheme === "dark") {
    document.getElementById("themeToggleBtn").textContent = "☀️";
  }
}

// Navbar shadow on scroll
window.addEventListener("scroll", () => {
  const nav = document.getElementById("portfolioNav");
  nav.style.boxShadow =
    window.scrollY > 50 ? "0 4px 20px rgba(0,0,0,0.08)" : "none";
});

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        requestAnimationFrame(() => {
          e.target.classList.add("visible");
        });
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px" },
);

document
  .querySelectorAll(".scroll-reveal")
  .forEach((el) => observer.observe(el));

// ========== TINY BLINKING STARS ==========
// Create ultra-small stars that blink and float
function createTinyStars() {
  const container = document.getElementById("starsContainer");
  if (!container) return;

  // Clear existing stars
  container.innerHTML = "";

  // Create 60 tiny stars for rich effect (more stars since they're tiny)
  for (let i = 0; i < 60; i++) {
    const star = document.createElement("div");
    star.className = "tiny-star";

    // Random ultra-small size (1px to 3px)
    const sizeClass = "size-" + (Math.floor(Math.random() * 5) + 1);
    star.classList.add(sizeClass);

    // Random soft color
    const colorClass = "color-" + (Math.floor(Math.random() * 10) + 1);
    star.classList.add(colorClass);

    // Random horizontal position
    star.style.left = Math.random() * 100 + "%";

    // Random top starting position (spread throughout)
    star.style.top = Math.random() * 100 + "%";

    // Random animation duration (10-20s for slower drift)
    const duration = 10 + Math.random() * 10;
    star.style.animationDuration = duration + "s";

    // Random animation delay
    star.style.animationDelay = Math.random() * 5 + "s";

    container.appendChild(star);
  }
}

// Initialize tiny stars
createTinyStars();

// Refresh stars occasionally to keep animation fresh
setInterval(createTinyStars, 20000); // Every 20 seconds

// Fetch real GitHub stats
async function fetchGitHubStats() {
  try {
    const res = await fetch("https://api.github.com/users/GouravK1107");
    const data = await res.json();

    // Animate number changes
    const repoEl = document.getElementById("repo-count");
    const followersEl = document.getElementById("follower-count");
    const followingEl = document.getElementById("following-count");

    // Smooth update with slight delay
    setTimeout(() => {
      repoEl.textContent = data.public_repos || 6;
      followersEl.textContent = data.followers || "-";
      followingEl.textContent = data.following || "-";
    }, 100);
  } catch (error) {
    console.log("Using fallback stats");
  }
}
fetchGitHubStats();
