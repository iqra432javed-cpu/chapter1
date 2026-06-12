// ===================================================================
// 🌐 TABS MANAGEMENT (📖 Concepts, 🗺️ Flowcharts, 🃏 Flashcards, etc.)
// ===================================================================
function switchTab(tabId, event) {
    // 1. Hide all tab content sections seamlessly
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active-content'));
    
    // 2. Remove highlighted borders from all active tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active-tab'));
    
    // 3. Render target active element configuration
    document.getElementById('tab-' + tabId).classList.add('active-content');
    if(event && event.currentTarget) {
        event.currentTarget.classList.add('active-tab');
    }
}

// ===================================================================
// 🌱 STUDY MODES MANAGEMENT (Weak Mode vs Average Mode vs Topper Mode)
// ===================================================================
function switchMode(modeName) {
    // 1. Clean previous CSS targets applied securely onto execution scope body
    document.body.classList.remove('mode-weak', 'mode-average', 'mode-topper');
    
    // 2. Inject target class directly to apply systemic visibility switches via stylesheet rules
    document.body.classList.add('mode-' + modeName);
    
    // 3. Keep visual synchronization across layout mode action headers
    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(btn => btn.classList.remove('active-mode'));
    
    if(modeName === 'weak') document.querySelector('.weak-btn').classList.add('active-mode');
    if(modeName === 'average') document.querySelector('.avg-btn').classList.add('active-mode');
    if(modeName === 'topper') document.querySelector('.top-btn').classList.add('active-mode');
    
    // 4. Update the actual interactive view containers safely
    const weakView = document.getElementById('concepts-weak');
    const avgView = document.getElementById('concepts-average');
    const topView = document.getElementById('concepts-topper');
    
    if(weakView) weakView.style.display = (modeName === 'weak') ? 'block' : 'none';
    if(avgView) avgView.style.display = (modeName === 'average') ? 'block' : 'none';
    if(topView) topView.style.display = (modeName === 'topper') ? 'block' : 'none';
}

// ===================================================================
// 🃏 CARD EXTRAS: REVEAL INTERACTIVE FLASHCARDS ACTIONS
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Set standard initialization hooks for layout components automatically 
    switchMode('weak');
    
    // Wire interactive target event handlers safely to every flashcard wrapper element
    const flashcards = document.querySelectorAll('.flashcard');
    flashcards.forEach(card => {
        const btn = card.querySelector('.reveal-btn');
        const ans = card.querySelector('.fc-answer');
        if(btn && ans) {
            btn.addEventListener('click', () => {
                if(ans.style.display === 'block') {
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
