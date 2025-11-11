const styles = {
    bright: `https://api.maptiler.com/maps/bright-v2/style.json?key=${MAPTILER_API_KEY}`,
    topo: `https://api.maptiler.com/maps/topo-v2/style.json?key=${MAPTILER_API_KEY}`
};

let currentStyle = 'topo';

const map = new maplibregl.Map({
    container: 'map',
    style: styles.topo,
    center: [15.0, 48.0],
    zoom: 5
});

map.addControl(new maplibregl.NavigationControl(), 'top-right');
map.addControl(new maplibregl.ScaleControl({
    maxWidth: 80,
    unit: 'metric'
}));

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const styleSwitcher = document.getElementById('style-switcher');

let searchTimeout;
let selectedIndex = -1;

async function searchLocation(query) {
    if (!query || query.length < 2) {
        searchResults.classList.add('hidden');
        return;
    }

    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_API_KEY}&limit=5`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            displaySearchResults(data.features);
        } else {
            searchResults.classList.add('hidden');
        }
    } catch (error) {
        console.error('Search error:', error);
        searchResults.classList.add('hidden');
    }
}

function displaySearchResults(features) {
    searchResults.innerHTML = '';
    selectedIndex = -1;
    
    features.forEach((feature, index) => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.dataset.index = index;
        
        const name = document.createElement('div');
        name.className = 'search-result-name';
        name.textContent = feature.text;
        
        const address = document.createElement('div');
        address.className = 'search-result-address';
        address.textContent = feature.place_name;
        
        item.appendChild(name);
        item.appendChild(address);
        
        item.addEventListener('click', () => {
            flyToLocation(feature.center);
            searchResults.classList.add('hidden');
            searchInput.value = feature.place_name;
        });
        
        searchResults.appendChild(item);
    });
    
    searchResults.classList.remove('hidden');
}

function flyToLocation(coordinates) {
    map.easeTo({
        center: coordinates,
        zoom: 14,
        duration: 1200,
        easing: (t) => {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }
    });
}

function updateSelection() {
    const items = searchResults.querySelectorAll('.search-result-item');
    items.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('selected');
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            item.classList.remove('selected');
        }
    });
}

function selectResult(index) {
    const items = searchResults.querySelectorAll('.search-result-item');
    if (items[index]) {
        items[index].click();
    }
}

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    selectedIndex = -1;
    searchTimeout = setTimeout(() => {
        searchLocation(e.target.value);
    }, 300);
});

searchInput.addEventListener('keydown', (e) => {
    const items = searchResults.querySelectorAll('.search-result-item');
    const itemCount = items.length;
    
    if (itemCount === 0) return;
    
    switch(e.key) {
        case 'ArrowDown':
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % itemCount;
            updateSelection();
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            selectedIndex = selectedIndex <= 0 ? itemCount - 1 : selectedIndex - 1;
            updateSelection();
            break;
            
        case 'Enter':
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < itemCount) {
                selectResult(selectedIndex);
            } else if (itemCount > 0) {
                selectResult(0);
            }
            break;
            
        case 'Escape':
            searchResults.classList.add('hidden');
            selectedIndex = -1;
            break;
    }
});

searchButton.addEventListener('click', () => {
    if (searchResults.children.length > 0) {
        searchResults.children[0].click();
    }
});

document.addEventListener('click', (e) => {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
        searchResults.classList.add('hidden');
    }
});

styleSwitcher.addEventListener('click', () => {
    if (currentStyle === 'bright') {
        map.setStyle(styles.topo);
        currentStyle = 'topo';
        styleSwitcher.textContent = '🌍';
    } 
    else if (currentStyle === 'topo') {
        map.setStyle(styles.bright);
        currentStyle = 'bright';
        styleSwitcher.textContent = '🌍';
    }
});