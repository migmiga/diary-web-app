document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addEntryBtn = document.getElementById('addEntryBtn');
    const modalOverlay = document.getElementById('entryModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const entryForm = document.getElementById('entryForm');
    const entriesGrid = document.getElementById('entriesGrid');
    
    // State
    // Load existing entries from localStorage or use empty array
    let entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

    // Initialize UI
    renderEntries();

    // Event Listeners
    addEntryBtn.addEventListener('click', openModal);
    
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the modal content
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Handle form submission
    entryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveEntry();
    });

    // Core Functions
    function openModal() {
        modalOverlay.style.display = 'flex';
        // Slight delay to allow display:flex to apply before adding active class for transition
        setTimeout(() => {
            modalOverlay.classList.add('active');
            document.getElementById('entryTitle').focus();
        }, 10);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        // Wait for transition to finish before hiding
        setTimeout(() => {
            modalOverlay.style.display = '';
            entryForm.reset();
            // Reset mood to default
            document.querySelector("input[name='mood'][value='😃']").checked = true;
        }, 300); 
        document.body.style.overflow = '';
    }

    function saveEntry() {
        const title = document.getElementById('entryTitle').value;
        const mood = document.querySelector('input[name="mood"]:checked').value;
        const content = document.getElementById('entryContent').value;
        
        const newEntry = {
            id: Date.now().toString(),
            title,
            mood,
            content,
            date: new Date().toISOString()
        };
        
        // Add new entry to the beginning of the array
        entries.unshift(newEntry);
        
        // Save updated array to localStorage
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        
        // Refresh UI & cleanup
        renderEntries();
        closeModal();
    }

    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'short' 
        };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    }

    function renderEntries() {
        // Clear current grid
        entriesGrid.innerHTML = '';

        if (entries.length === 0) {
            entriesGrid.innerHTML = `
                <div class="empty-state">
                    <p>당신의 첫 번째 일기를 기록해보세요! ✨</p>
                </div>
            `;
            return;
        }
        
        // Render each entry
        entries.forEach((entry, index) => {
            const card = document.createElement('div');
            card.className = 'diary-card glass-panel';
            // Stagger animation delay
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-date">${formatDate(entry.date)}</span>
                </div>
                <div class="card-mood">${entry.mood}</div>
                <h3 class="card-title">${entry.title}</h3>
                <p class="card-snippet">${entry.content.replace(/\n/g, '<br>')}</p>
                <span class="delete-hint">더블클릭하여 삭제</span>
            `;
            
            // Delete feature (easter egg)
            card.addEventListener('dblclick', () => {
                if (confirm('이 일기를 정말 삭제하시겠습니까?')) {
                    deleteEntry(entry.id);
                }
            });
            
            entriesGrid.appendChild(card);
        });
    }

    function deleteEntry(id) {
        // Filter out the deleted entry
        entries = entries.filter(e => e.id !== id);
        
        // Update localStorage
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        
        // Re-render
        renderEntries();
    }
});
