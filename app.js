/**
 * WRYTELO CONTENT DATA STORE
 * Easily update or add new items by editing these objects.
 */
const CONTENT_ITEMS = [
  {
    id: 'm4-mac-mini-review',
    title: 'M4 Mac Mini Benchmarks: The Ultimate Budget Workstation?',
    category: 'guide',
    desc: 'Detailed analysis of unified memory scaling, thermal performance, and local LLM execution speeds.',
    linkText: 'Read Analysis →'
  },
  {
    id: 'ssd-deals-q3',
    title: 'PCIe 4.0 & 5.0 NVMe Storage Price Drops',
    category: 'deal',
    desc: 'Curated roundup of high-speed NVMe drives from Samsung, Western Digital, and Crucial currently on sale.',
    linkText: 'View Deals →'
  },
  {
    id: 'deepseek-local-guide',
    title: 'Running Local AI Models on Consumer Hardware',
    category: 'ai',
    desc: 'Step-by-step setup for Ollama, LM Studio, and quantized model execution without relying on cloud APIs.',
    linkText: 'View Setup Guide →'
  },
  {
    id: 'ultrawide-monitor-guide',
    title: 'Top 4K & Ultrawide Monitors for Developers (2026)',
    category: 'guide',
    desc: 'Evaluating color clarity, text sharpness, refresh rates, and USB-C power delivery hubs for coding.',
    linkText: 'Compare Displays →'
  }
];

/**
 * INITIALIZATION & ROUTING
 */
document.addEventListener('DOMContentLoaded', () => {
  renderGrid(CONTENT_ITEMS, 'content-grid');
  renderGrid(CONTENT_ITEMS.filter(i => i.category === 'deal'), 'deals-grid');
  renderGrid(CONTENT_ITEMS.filter(i => i.category === 'guide'), 'guides-grid');
  renderGrid(CONTENT_ITEMS.filter(i => i.category === 'ai'), 'ai-grid');

  // Handle direct hash navigation (e.g., #contact)
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash) {
    navigateTo(currentHash);
  }

  // Setup Seamless Formspree Submissions
  setupFormspreeAjax();
});

/**
 * PAGE VIEW NAVIGATION
 */
function navigateTo(viewId) {
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  document.querySelectorAll('.nav-item').forEach(nav => {
    nav.classList.remove('active');
  });

  const targetView = document.getElementById(`view-${viewId}`);
  const targetNav = document.getElementById(`nav-${viewId}`);

  if (targetView) {
    targetView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (targetNav) {
    targetNav.classList.add('active');
  }

  // Close mobile drawer if open
  document.getElementById('nav-links').classList.remove('show');
}

/**
 * RENDER CARD GRIDS
 */
function renderGrid(items, targetContainerId) {
  const container = document.getElementById(targetContainerId);
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">No matching articles or deals found.</p>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <article class="card">
      <div>
        <div class="card-tag">${item.category.toUpperCase()}</div>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
      </div>
      <a href="#${item.id}" class="card-link" onclick="alert('Article preview coming soon.')">${item.linkText}</a>
    </article>
  `).join('');
}

/**
 * SEARCH & FILTERING
 */
function filterCategory(category, buttonEl) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  buttonEl.classList.add('active');

  if (category === 'all') {
    renderGrid(CONTENT_ITEMS, 'content-grid');
  } else {
    const filtered = CONTENT_ITEMS.filter(item => item.category === category);
    renderGrid(filtered, 'content-grid');
  }
}

function handleSearch(query) {
  const q = query.toLowerCase().trim();
  const filtered = CONTENT_ITEMS.filter(item => 
    item.title.toLowerCase().includes(q) || 
    item.desc.toLowerCase().includes(q)
  );
  renderGrid(filtered, 'content-grid');
}

/**
 * MOBILE MENU TOGGLE
 */
function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('show');
}

/**
 * FORMSPREE AJAX SUBMISSION HANDLER
 * Keeps users on the site with visual feedback on button submit.
 */
function setupFormspreeAjax() {
  const forms = document.querySelectorAll('form[action*="formspree.io"]');

  forms.forEach(form => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const button = form.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      
      button.disabled = true;
      button.textContent = 'Sending...';

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          button.textContent = 'Submitted Successfully!';
          button.style.backgroundColor = '#059669'; // Accent Success Green
          
          setTimeout(() => {
            button.disabled = false;
            button.textContent = originalText;
            button.style.backgroundColor = '';
          }, 4000);
        } else {
          throw new Error('Form submission error');
        }
      } catch (err) {
        button.disabled = false;
        button.textContent = 'Failed. Try Again';
        button.style.backgroundColor = '#dc2626'; // Error Red
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = '';
        }, 3000);
      }
    });
  });
}