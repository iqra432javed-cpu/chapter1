'use strict';

/* ============================================================
   IMORIA LEARNING — script.js
   Chapter 1: Biodiversity & Classification
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initModeSelector();
  initTabSwitcher();
  initFlashcards();
  initMCQs();
  initRevealAnimations();
});

/* ── 1. NAVBAR SCROLL STATE ─────────────────────────────────── */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  const threshold = 10;

  const onScroll = () => {
    const current = window.scrollY;
    if (current > threshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = current;
  };

  window.addEventListener('scroll', debounce(onScroll, 50), { passive: true });
  onScroll();
}

/* ── 2. MODE SELECTOR (Weak / Average / Topper) ────────────── */
function initModeSelector() {
  const modeButtons = document.querySelectorAll('.mode-btn');
  if (!modeButtons.length) return;

  const modeMap = {
    weak: document.getElementById('concepts-weak'),
    average: document.getElementById('concepts-average'),
    topper: document.getElementById('concepts-topper')
  };

  const btnMap = {
    weak: document.querySelector('.weak-btn'),
    average: document.querySelector('.avg-btn'),
    topper: document.querySelector('.top-btn')
  };

  window.switchMode = (mode) => {
    if (!modeMap[mode]) return;

    Object.keys(modeMap).forEach((key) => {
      const content = modeMap[key];
      const btn = btnMap[key];
      if (!content || !btn) return;

      if (key === mode) {
        content.classList.remove('hidden');
        btn.classList.add('active-mode');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        content.classList.add('hidden');
        btn.classList.remove('active-mode');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // If user switched mode while on concepts tab, scroll content into view nicely
    const conceptsTab = document.getElementById('tab-concepts');
    if (conceptsTab && conceptsTab.classList.contains('active-content')) {
      conceptsTab.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Set initial ARIA states based on existing "active-mode" class
  modeButtons.forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.classList.contains('active-mode') ? 'true' : 'false');
  });
}

/* ── 3. TAB SWITCHER (Concepts / Flowcharts / Flashcards / MCQs / Summary) ── */
function initTabSwitcher() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-content');
  if (!tabs.length || !panels.length) return;

  const panelMap = {
    concepts: document.getElementById('tab-concepts'),
    flowchart: document.getElementById('tab-flowchart'),
    flashcards: document.getElementById('tab-flashcards'),
    mcqs: document.getElementById('tab-mcqs'),
    summary: document.getElementById('tab-summary')
  };

  window.switchTab = (tabName, event) => {
    if (!panelMap[tabName]) return;

    // Update panels
    Object.entries(panelMap).forEach(([key, panel]) => {
      if (!panel) return;
      if (key === tabName) {
        panel.classList.add('active-content');
      } else {
        panel.classList.remove('active-content');
      }
    });

    // Update tab buttons
    tabs.forEach((tab) => {
      tab.classList.remove('active-tab');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });

    const activeTab = event ? event.currentTarget : findTabByName(tabs, tabName);
    if (activeTab) {
      activeTab.classList.add('active-tab');
      activeTab.setAttribute('aria-selected', 'true');
      activeTab.setAttribute('tabindex', '0');
      activeTab.focus({ preventScroll: true });
    }

    // Scroll content into view (helps on mobile)
    const tabBar = document.querySelector('.tab-bar');
    if (tabBar) {
      const offset = tabBar.getBoundingClientRect().bottom;
      if (offset < 0 || window.scrollY < 50) {
        window.scrollTo({ top: tabBar.offsetTop - 64, behavior: 'smooth' });
      }
    }
  };

  // Setup ARIA roles + keyboard navigation for tabs
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', tab.classList.contains('active-tab') ? 'true' : 'false');
    tab.setAttribute('tabindex', tab.classList.contains('active-tab') ? '0' : '-1');

    tab.addEventListener('keydown', (e) => {
      let newIndex = null;
      if (e.key === 'ArrowRight') {
        newIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabs.length - 1;
      }

      if (newIndex !== null) {
        e.preventDefault();
        tabs[newIndex].click();
      }
    });
  });
}

function findTabByName(tabs, tabName) {
  return Array.from(tabs).find((tab) => {
    const onclick = tab.getAttribute('onclick') || '';
    return onclick.includes(`'${tabName}'`);
  });
}

/* ── 4. FLASHCARDS (flip on click/keyboard) ────────────────── */
function initFlashcards() {
  const cards = document.querySelectorAll('.flashcard');
  if (!cards.length) return;

  window.flipCard = (cardEl) => {
    if (!cardEl) return;
    cardEl.classList.toggle('flipped');
    const flipped = cardEl.classList.contains('flipped');
    cardEl.setAttribute('aria-pressed', flipped ? 'true' : 'false');
  };

  cards.forEach((card) => {
    // Accessibility: make focusable and keyboard-operable
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-pressed', 'false');

    const front = card.querySelector('.card-front p');
    const label = front ? front.textContent.trim().slice(0, 60) : 'flashcard';
    card.setAttribute('aria-label', `Flashcard: ${label}. Press Enter or Space to flip.`);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.flipCard(card);
      }
    });
  });
}

/* ── 5. MCQ QUIZ LOGIC ──────────────────────────────────────── */
function initMCQs() {
  const mcqItems = document.querySelectorAll('.mcq-item');
  if (!mcqItems.length) return;

  const scoreDisplay = document.getElementById('score-display');
  const resetBtn = document.querySelector('.reset-btn');

  // State stored in-memory (no localStorage requirement specified for quiz state)
  const state = {
    score: 0,
    total: 0,
    answered: new Set()
  };

  const updateScoreDisplay = () => {
    if (scoreDisplay) {
      scoreDisplay.textContent = `Score: ${state.score} / ${state.total}`;
    }
  };

  window.checkAnswer = (buttonEl, questionId, isCorrect) => {
    if (!buttonEl || !questionId) return;

    const mcqItem = document.getElementById(questionId);
    if (!mcqItem) return;

    // Prevent double-answering
    if (state.answered.has(questionId)) return;

    const optionButtons = mcqItem.querySelectorAll('.option-btn');
    const explanation = document.getElementById(`exp-${questionId}`);

    // Disable all options for this question
    optionButtons.forEach((btn) => {
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
    });

    // Mark selected button
    if (isCorrect) {
      buttonEl.classList.add('correct');
      state.score += 1;
    } else {
      buttonEl.classList.add('incorrect');
      // Highlight the correct answer too
      const correctBtn = Array.from(optionButtons).find((btn) =>
        (btn.getAttribute('onclick') || '').includes(',true)')
      );
      if (correctBtn) correctBtn.classList.add('correct');
    }

    state.total += 1;
    state.answered.add(questionId);
    updateScoreDisplay();

    // Show explanation
    if (explanation) {
      explanation.classList.remove('hidden');
      explanation.setAttribute('aria-live', 'polite');
    }
  };

  window.resetQuiz = () => {
    state.score = 0;
    state.total = 0;
    state.answered.clear();
    updateScoreDisplay();

    mcqItems.forEach((item) => {
      const optionButtons = item.querySelectorAll('.option-btn');
      optionButtons.forEach((btn) => {
        btn.disabled = false;
        btn.removeAttribute('aria-disabled');
        btn.classList.remove('correct', 'incorrect');
      });

      const explanation = item.querySelector('.q-explanation');
      if (explanation) {
        explanation.classList.add('hidden');
      }
    });

    // Visual feedback on reset button
    if (resetBtn) {
      resetBtn.classList.add('reset-flash');
      setTimeout(() => resetBtn.classList.remove('reset-flash'), 300);
    }
  };

  updateScoreDisplay();
}

/* ── 6. SCROLL-TRIGGERED REVEAL ANIMATIONS ─────────────────── */
function initRevealAnimations() {
  const revealTargets = document.querySelectorAll(
    '.concept-block, .flowchart-block, .summary-card, .mcq-item, .flashcard, .domain-section, .kingdom-card, .phylum-card, .vert-card'
  );
  if (!revealTargets.length) return;

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('visible'));
    return;
  }

  revealTargets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

/* ── 7. UTILITIES ───────────────────────────────────────────── */
function debounce(fn, delay = 100) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
