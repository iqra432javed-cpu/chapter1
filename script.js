// ===================================================================
// 🌓 THEME CONTROLLER ENGINE (Light/Dark Management)
// ===================================================================
function toggleTheme() {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        htmlElement.classList.add('light');
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.classList.remove('light');
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Restore saved settings on initial page layout render cycle
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// ===================================================================
// 🗂️ TAB MANAGEMENT TRANSITIONS
// ===================================================================
function switchTab(tabId, event) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(item => item.classList.remove('active-content'));
    
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active-tab'));
    
    document.getElementById('tab-' + tabId).classList.add('active-content');
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active-tab');
    }
}

// ===================================================================
// 🃏 FLASHCARDS INTERACTIVE REVEAL
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    const flashcards = document.querySelectorAll('.flashcard');
    flashcards.forEach(card => {
        const btn = card.querySelector('.reveal-btn');
        const ans = card.querySelector('.fc-answer');
        
        if (btn && ans) {
            btn.addEventListener('click', () => {
                if (ans.style.display === 'block') {
                    ans.style.display = 'none';
                    btn.textContent = '🃏 Reveal Answer';
                } else {
                    ans.style.display = 'block';
                    btn.textContent = '🙈 Hide Answer';
                }
            });
        }
    });
});

// ===================================================================
// 📝 MCQ INTERACTIVE CORRECTION VALIDATION
// ===================================================================
function checkAnswer(buttonElement, isCorrect) {
    const parentCard = buttonElement.closest('.mcq-card');
    const options = parentCard.querySelectorAll('.option-btn');
    const explanation = parentCard.querySelector('.mcq-explanation');
    
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (isCorrect) {
        buttonElement.style.backgroundColor = '#10B981';
        buttonElement.style.color = '#FFFFFF';
        buttonElement.style.borderColor = '#10B981';
    } else {
        buttonElement.style.backgroundColor = '#EF4444';
        buttonElement.style.color = '#FFFFFF';
        buttonElement.style.borderColor = '#EF4444';
    }
    
    explanation.style.display = 'block';
}
