// Magical Disney Characters App - Complete Fixed Version
// Fixes: Modal clicks work after Load More, Search, Filters, Pagination

const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    resetBtn: document.getElementById('resetBtn'),
    loading: document.getElementById('loading'),
    error: document.getElementById('errorMessage'),
    stats: document.getElementById('stats'),
    grid: document.getElementById('charactersGrid'),
    pagination: document.getElementById('pagination'),
    modal: document.getElementById('characterModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalImage: document.getElementById('modalImage'),
    modalId: document.getElementById('modalId'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    backgroundAudio: document.getElementById('backgroundAudio'),
    soundToggle: document.getElementById('soundToggle')
};

const BASE_URL = "https://api.disneyapi.dev/character";
let allCharacters = [];
let filteredCharacters = []; // Current filtered list (after search + filters)
let nextPageUrl = BASE_URL + "?page=1";
let currentPage = 1;
const charactersPerPage = 20;

// Active filters
let activeFilters = {
    films: 'all',  // 'all', '0-2', '3+'
    tv: 'all'      // 'all', '0-2', '3+'
};

// Show temporary error
function showTemporaryError(message) {
    elements.error.textContent = message;
    elements.error.classList.add('show');
    setTimeout(() => {
        elements.error.classList.remove('show');
        elements.error.textContent = "";
    }, 4000);
}

// Fetch next page
async function fetchPage() {
    if (!nextPageUrl) return;

    elements.loading.style.display = "block";
    elements.loadMoreBtn.disabled = true;

    try {
        const res = await fetch(nextPageUrl);
        if (!res.ok) throw new Error("Network error");

        const data = await res.json();
        const newChars = data.data || [];
        allCharacters = allCharacters.concat(newChars);
        nextPageUrl = data.info?.nextPage;

        applyFiltersAndSearch(); // Refresh view
        updateStats();
        updateLoadMoreButton();

    } catch (err) {
        showTemporaryError("Failed to load characters. Try again.");
    } finally {
        elements.loading.style.display = "none";
        elements.loadMoreBtn.disabled = false;
    }
}

// Apply search + filters
function applyFiltersAndSearch() {
    currentPage = 1;
    let result = allCharacters;

    // Apply search
    const term = elements.searchInput.value.trim().toLowerCase();
    if (term) {
        result = result.filter(c => c.name.toLowerCase().includes(term));
    }

    // Apply films filter
    if (activeFilters.films !== 'all') {
        const filmCount = (c) => (c.films?.length || 0);
        if (activeFilters.films === '0-2') {
            result = result.filter(c => filmCount(c) <= 2);
        } else if (activeFilters.films === '3+') {
            result = result.filter(c => filmCount(c) >= 3);
        }
    }

    // Apply TV shows filter
    if (activeFilters.tv !== 'all') {
        const tvCount = (c) => (c.tvShows?.length || 0);
        if (activeFilters.tv === '0-2') {
            result = result.filter(c => tvCount(c) <= 2);
        } else if (activeFilters.tv === '3+') {
            result = result.filter(c => tvCount(c) >= 3);
        }
    }

    filteredCharacters = result;
    displayCharacters(filteredCharacters);
    updateStats();
}

// Display characters with pagination (FIXED: Safe click handling using data-attribute)
function displayCharacters(chars) {
    const start = (currentPage - 1) * charactersPerPage;
    const end = start + charactersPerPage;
    const paginated = chars.slice(start, end);

    if (paginated.length === 0) {
        elements.grid.innerHTML = '<div class="no-data">No characters match your filters. Try adjusting them! ✨</div>';
        elements.pagination.innerHTML = '';
        return;
    }

    elements.grid.innerHTML = paginated.map(c => `
        <div class="character-card" data-character='${JSON.stringify(c).replace(/'/g, '&#39;')}'>
            <div class="character-image">
                ${c.imageUrl ? `<img src="${c.imageUrl}" alt="${c.name}" loading="lazy">` : '<div class="no-image">No Image</div>'}
            </div>
            <div class="character-info">
                <div class="character-name">${c.name}</div>
                <div class="character-detail"><strong>Films:</strong> ${c.films?.length || 0}</div>
                <div class="character-detail"><strong>TV Shows:</strong> ${c.tvShows?.length || 0}</div>
            </div>
        </div>
    `).join('');

    displayPagination(chars.length);
    attachCardClickListeners(); // Re-attach clicks every time new cards are rendered
}

// Attach click events to character cards safely
function attachCardClickListeners() {
    document.querySelectorAll('.character-card').forEach(card => {
        card.onclick = function() {
            const charData = JSON.parse(this.dataset.character.replace(/&#39;/g, "'"));
            openModal(charData);
        };
    });
}

// Pagination
function displayPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / charactersPerPage);
    if (totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }

    elements.pagination.innerHTML = `
        <button class="btn prev" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            ← Previous
        </button>
        <div class="page-info">Page ${currentPage} of ${totalPages}</div>
        <button class="btn next" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            Next →
        </button>
    `;
}

window.changePage = function(newPage) {
    currentPage = newPage;
    displayCharacters(filteredCharacters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Update stats
function updateStats() {
    const term = elements.searchInput.value.trim();
    const totalFiltered = filteredCharacters.length;

    let statText = `<strong>${totalFiltered}</strong> magical character${totalFiltered !== 1 ? 's' : ''} found`;

    if (term) statText += ` for "${term}"`;
    if (activeFilters.films !== 'all' || activeFilters.tv !== 'all') {
        statText += ` with active filters`;
    }

    elements.stats.innerHTML = statText;
    elements.stats.style.display = "block";
}

// Update Load More button
function updateLoadMoreButton() {
    if (!nextPageUrl) {
        elements.loadMoreBtn.textContent = "All Characters Loaded! ✨";
        elements.loadMoreBtn.disabled = true;
    } else {
        elements.loadMoreBtn.textContent = "Load More Characters";
        elements.loadMoreBtn.disabled = false;
    }
}

// Dropdown filter handling
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function() {
        const filterType = this.dataset.filter;
        const value = this.dataset.value;
        const displayText = this.textContent.trim();

        // Update active item in this dropdown
        const menu = this.parentElement;
        menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        // Update dropdown button text
        const dropdownToggle = menu.previousElementSibling;
        dropdownToggle.innerHTML = `${displayText} <span class="arrow">▼</span>`;

        // Close dropdown
        menu.parentElement.classList.remove('open');

        // Update active filter
        if (filterType === 'films') {
            activeFilters.films = value;
        } else if (filterType === 'tv') {
            activeFilters.tv = value;
        }

        applyFiltersAndSearch();
    });
});

// Toggle dropdown open/close
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const dropdown = this.parentElement;
        const isOpen = dropdown.classList.contains('open');

        // Close all dropdowns
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));

        // Open this one if it wasn't already open
        if (!isOpen) {
            dropdown.classList.add('open');
        }
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
});

// Refresh Button: Reset everything to default (All filters + clear search)
elements.resetBtn.addEventListener('click', () => {
    // Clear search input
    elements.searchInput.value = '';
    elements.clearSearchBtn.style.display = 'none';

    // Reset all dropdowns to "All" and mark as active
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.value === 'all') {
            item.classList.add('active');
            
            // Update the toggle button text
            const menu = item.parentElement;
            const toggle = menu.previousElementSibling;
            toggle.innerHTML = `All <span class="arrow">▼</span>`;
        }
    });

    // Reset active filters object
    activeFilters = { films: 'all', tv: 'all' };

    // Refresh the view
    applyFiltersAndSearch();
});

// Search functionality
function performSearch() {
    applyFiltersAndSearch();
}

elements.searchBtn.addEventListener('click', performSearch);

elements.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
    }
});

// Clear button visibility
elements.searchInput.addEventListener('input', () => {
    elements.clearSearchBtn.style.display = elements.searchInput.value ? 'block' : 'none';
});

elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.clearSearchBtn.style.display = 'none';
    performSearch();
});

// Modal functions
function openModal(character) {
    elements.modalTitle.textContent = character.name;
    elements.modalImage.src = character.imageUrl || '';
    elements.modalImage.alt = character.name;
    elements.modalId.textContent = character._id || 'N/A';

    ['films', 'shortFilms', 'tvShows', 'videoGames', 'parkAttractions', 'allies', 'enemies'].forEach(key => {
        const list = document.getElementById(key + 'List');
        const items = character[key] || [];
        list.innerHTML = items.length ? items.map(i => `<div class="modal-item-tag">${i}</div>`).join('')
                                      : '<div class="empty-state">No data available</div>';
    });

    elements.modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    elements.modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Sound Toggle
if (elements.backgroundAudio && elements.soundToggle) {
    elements.backgroundAudio.volume = 0.3;
    elements.backgroundAudio.pause();

    elements.soundToggle.addEventListener('click', () => {
        if (elements.backgroundAudio.paused) {
            elements.backgroundAudio.play();
            elements.soundToggle.innerHTML = '🔊 Sound On';
        } else {
            elements.backgroundAudio.pause();
            elements.soundToggle.innerHTML = '🔇 Turn Sound On';
        }
    });
}

// Event Listeners
elements.loadMoreBtn.addEventListener('click', fetchPage);
elements.closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', e => { if (e.target === elements.modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Initialize
window.addEventListener('load', () => {
    // Generate twinkling stars
    const stars = document.getElementById('stars');
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.width = star.style.height = Math.random() * 3 + 1 + 'px';
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 5 + 's';
        stars.appendChild(star);
    }

    fetchPage(); // Load first page
});

// Theme Toggle - Dark / Day Mode
const themeToggle = document.getElementById('themeToggle');

function setTheme(isDay) {
    if (isDay) {
        document.body.classList.add('day-mode');
        themeToggle.innerHTML = '☀️';
        themeToggle.title = 'Switch to Dark Mode';
        localStorage.setItem('disneyTheme', 'day');
    } else {
        document.body.classList.remove('day-mode');
        themeToggle.innerHTML = '🌙';
        themeToggle.title = 'Switch to Day Mode';
        localStorage.setItem('disneyTheme', 'dark');
    }
}

// Load saved theme on start
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('disneyTheme');
    if (savedTheme === 'day') {
        setTheme(true);
    } else {
        setTheme(false); // Default dark
    }

    // Existing star generation and fetchPage()...
});

// Toggle click
themeToggle.addEventListener('click', () => {
    const isDay = document.body.classList.contains('day-mode');
    setTheme(!isDay);
});