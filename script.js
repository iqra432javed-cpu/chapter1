document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. TAB SWITCHING LOGIC
    // ==========================================
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active-tab'));
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active-content'));

            // Add active class to clicked tab
            tab.classList.add('active-tab');
            
            // Show corresponding content based on data-tab attribute
            const targetTab = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active-content');
            }
        });
    });

    // ==========================================
    // 2. STUDY MODE FILTERING (Weak, Avg, Topper)
    // ==========================================
    const modeButtons = document.querySelectorAll('.mode-btn');
    const modeContents = document.querySelectorAll('.mode-content');

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all mode buttons
            modeButtons.forEach(btn => btn.classList.remove('active-mode'));
            
            // Add active state to clicked button
            button.classList.add('active-mode');

            // Get selected mode (weak, average, or topper)
            const selectedMode = button.getAttribute('data-mode');

            // Show/Hide relevant blocks
            modeContents.forEach(content => {
                if (content.classList.contains(`${selectedMode}-mode`)) {
                    content.classList.remove('hidden');
                    // Optional fluid entry animation trigger
                    content.style.animation = 'fadeIn 0.4s ease';
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // ==========================================
    // 3. FLASHCARD FLIP INTERACTION
    // ==========================================
    const flashcards = document.querySelectorAll('.flashcard');

    flashcards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle flipped class on click
            card.classList.toggle('flipped');
        });
    });
});

// Optional CSS Animation Injection for smooth mode transitions
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
