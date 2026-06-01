// Sample Products Data
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        category: "electronics",
        price: 999,
        description: "Latest iPhone with advanced camera and A17 chip",
        rating: "★★★★★",
        icon: "📱"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        category: "electronics",
        price: 899,
        description: "Powerful Android smartphone with amazing display",
        rating: "★★★★☆",
        icon: "📱"
    },
    {
        id: 3,
        name: "Nike Air Max",
        category: "clothing",
        price: 120,
        description: "Comfortable running shoes with air cushioning",
        rating: "★★★★☆",
        icon: "👟"
    },
    {
        id: 4,
        name: "Levi's Jeans",
        category: "clothing",
        price: 80,
        description: "Classic denim jeans with perfect fit",
        rating: "★★★★★",
        icon: "👖"
    },
    {
        id: 5,
        name: "Harry Potter Collection",
        category: "books",
        price: 150,
        description: "Complete 7-book set in premium box",
        rating: "★★★★★",
        icon: "📚"
    },
    {
        id: 6,
        name: "Clean Code",
        category: "books",
        price: 45,
        description: "Essential programming best practices book",
        rating: "★★★★☆",
        icon: "📚"
    },
    {
        id: 7,
        name: "Coffee Maker",
        category: "home",
        price: 250,
        description: "Automatic coffee maker with timer",
        rating: "★★★★☆",
        icon: "☕"
    },
    {
        id: 8,
        name: "Blender",
        category: "home",
        price: 120,
        description: "High-speed blender for smoothies",
        rating: "★★★★★",
        icon: "🥤"
    },
    {
        id: 9,
        name: "MacBook Air",
        category: "electronics",
        price: 1199,
        description: "Thin and light laptop with M2 chip",
        rating: "★★★★★",
        icon: "💻"
    },
    {
        id: 10,
        name: "T-shirt Pack",
        category: "clothing",
        price: 50,
        description: "Pack of 5 basic cotton t-shirts",
        rating: "★★★★☆",
        icon: "👕"
    },
    {
        id: 11,
        name: "Cookbook",
        category: "books",
        price: 35,
        description: "Healthy recipes for everyday cooking",
        rating: "★★★★☆",
        icon: "📖"
    },
    {
        id: 12,
        name: "Air Fryer",
        category: "home",
        price: 180,
        description: "Healthy cooking with air frying technology",
        rating: "★★★★★",
        icon: "🍟"
    }
];

const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.search-btn');
const clearBtn = document.querySelector('.clear-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const priceRange = document.getElementById('priceRange');
const minPriceSpan = document.getElementById('minPrice');
const maxPriceSpan = document.getElementById('maxPrice');
const countSpan = document.getElementById('count');
const totalSpan = document.getElementById('total');
const noResults = document.getElementById('noResults');

let currentCategory = 'all';
let currentSearchTerm = '';
let currentMaxPrice = 1000;

function init() {
    totalSpan.textContent = products.length;
    updatePriceDisplay();
    displayProducts(products);
    setupEventListeners();
}

function displayProducts(productsToDisplay) {
    productsGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        noResults.style.display = 'block';
        productsGrid.style.display = 'none';
        countSpan.textContent = '0';
        return;
    }
    
    noResults.style.display = 'none';
    productsGrid.style.display = 'grid';
    countSpan.textContent = productsToDisplay.length;
    
    productsToDisplay.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const categoryColors = {
        electronics: '#667eea',
        clothing: '#4CAF50',
        books: '#FF9800',
        home: '#9C27B0'
    };
    
    const bgColor = categoryColors[product.category] || '#667eea';
    
    card.innerHTML = `
        <div class="product-image" style="background: linear-gradient(135deg, ${bgColor} 0%, ${darkenColor(bgColor, 30)} 100%)">
            ${product.icon}
        </div>
        <div class="product-info">
            <span class="product-category">${product.category.toUpperCase()}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <div class="product-rating">${product.rating}</div>
        </div>
    `;
    
    return card;
}

function darkenColor(color, percent) {
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);
    
    r = Math.floor(r * (100 - percent) / 100);
    g = Math.floor(g * (100 - percent) / 100);
    b = Math.floor(b * (100 - percent) / 100);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function filterProducts() {
    return products.filter(product => {
        const categoryMatch = currentCategory === 'all' || product.category === currentCategory;
        const searchMatch = product.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(currentSearchTerm.toLowerCase());
        const priceMatch = product.price <= currentMaxPrice;
        
        return categoryMatch && searchMatch && priceMatch;
    });
}

function updateDisplay() {
    const filteredProducts = filterProducts();
    displayProducts(filteredProducts);
}

function updatePriceDisplay() {
    maxPriceSpan.textContent = priceRange.value;
    currentMaxPrice = parseInt(priceRange.value);
}

function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        updateDisplay();
    });
    
    searchBtn.addEventListener('click', () => {
        currentSearchTerm = searchInput.value;
        updateDisplay();
    });
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearchTerm = '';
        currentCategory = 'all';
        priceRange.value = 1000;
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === 'all') {
                btn.classList.add('active');
            }
        });
        
        updatePriceDisplay();
        updateDisplay();
    });
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category;
            updateDisplay();
        });
    });

    priceRange.addEventListener('input', () => {
        updatePriceDisplay();
        updateDisplay();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentSearchTerm = searchInput.value;
            updateDisplay();
        }
    });
}

document.addEventListener('DOMContentLoaded', init);