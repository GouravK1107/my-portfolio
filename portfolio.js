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

// ========== VIEW ALL PROJECTS MODAL ==========
// Create modal HTML dynamically
function createProjectsModal() {
  // Check if modal already exists
  if (document.getElementById("projects-modal")) return;
  
  const modalHTML = `
    <div id="projects-modal" class="projects-modal">
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>📁 All GitHub Projects</h3>
          <button class="modal-close-btn" id="closeModalBtn">&times;</button>
        </div>
        <div class="modal-content" id="modalProjectsList">
          <div class="modal-loading">
            <div class="spinner"></div>
            <p>Loading projects from GitHub...</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Fetch all repositories from GitHub
async function fetchAllGitHubRepos() {
  const username = 'GouravK1107';
  const modalContent = document.getElementById('modalProjectsList');
  
  if (!modalContent) return;
  
  try {
    // Show loading state
    modalContent.innerHTML = `
      <div class="modal-loading">
        <div class="spinner"></div>
        <p>Loading projects from GitHub...</p>
      </div>
    `;
    
    // Fetch all repos (max 100)
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    
    if (!response.ok) throw new Error('Failed to fetch repositories');
    
    const repos = await response.json();
    
    // Filter out forked repos (optional - show only your original repos)
    const originalRepos = repos.filter(repo => !repo.fork);
    
    if (originalRepos.length === 0) {
      modalContent.innerHTML = '<p class="modal-empty">No repositories found.</p>';
      return;
    }
    
    // Generate HTML for each repo
    const reposHTML = originalRepos.map(repo => `
      <div class="modal-repo-card">
        <div class="modal-repo-header">
          <h4>📦 ${repo.name}</h4>
          <div class="modal-repo-stats">
            <span>⭐ ${repo.stargazers_count}</span>
            <span>🍴 ${repo.forks_count}</span>
          </div>
        </div>
        <p class="modal-repo-desc">${repo.description || 'No description available.'}</p>
        <div class="modal-repo-lang">
          ${repo.language ? `<span class="lang-badge">${repo.language}</span>` : ''}
          <span class="repo-updated">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
        <div class="modal-repo-links">
          <a href="${repo.html_url}" target="_blank" class="modal-repo-link">🔗 GitHub →</a>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="modal-repo-link">🌐 Live Demo →</a>` : ''}
        </div>
      </div>
    `).join('');
    
    modalContent.innerHTML = reposHTML;
    
  } catch (error) {
    console.error('Error fetching repos:', error);
    modalContent.innerHTML = `
      <div class="modal-error">
        <p>⚠️ Failed to load repositories. Please try again later.</p>
        <button onclick="fetchAllGitHubRepos()" class="retry-btn">Retry</button>
      </div>
    `;
  }
}

// Open modal
function openProjectsModal() {
  const modal = document.getElementById('projects-modal');
  if (!modal) createProjectsModal();
  
  const modalElement = document.getElementById('projects-modal');
  if (modalElement) {
    modalElement.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Fetch repos when modal opens
    fetchAllGitHubRepos();
  }
}

// Close modal
function closeProjectsModal() {
  const modal = document.getElementById('projects-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Add event listeners after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  createProjectsModal();
  
  // Close modal when clicking overlay or close button
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeProjectsModal();
    }
    if (e.target.id === 'closeModalBtn') {
      closeProjectsModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectsModal();
    }
  });
});