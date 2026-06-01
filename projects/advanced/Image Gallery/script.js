document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('imageGallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeLightbox = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const imageTitle = document.getElementById('imageTitle');
    const imageDescription = document.getElementById('imageDescription');
    const imageCategory = document.getElementById('imageCategory');
    const imageDate = document.getElementById('imageDate');
    const imageCount = document.getElementById('imageCount');
    const searchInput = document.getElementById('searchInput');
    const loadMoreBtn = document.getElementById('loadMore');
    
    const filterButtons = {
        all: document.getElementById('filterAll'),
        nature: document.getElementById('filterNature'),
        urban: document.getElementById('filterUrban'),
        abstract: document.getElementById('filterAbstract')
    };
    
    const shuffleBtn = document.getElementById('shuffleBtn');
    
    let currentImages = [];
    let filteredImages = [];
    let currentIndex = 0;
    let currentFilter = 'all';
    let currentSearch = '';
    
    const images = [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: 'Mountain Landscape',
            description: 'A breathtaking view of snow-capped mountains during sunrise.',
            category: 'nature',
            date: '2023-05-15'
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
            title: 'City Skyline',
            description: 'Modern urban skyline with towering skyscrapers.',
            category: 'urban',
            date: '2023-06-22'
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
            title: 'Abstract Art',
            description: 'Colorful abstract painting with fluid shapes and patterns.',
            category: 'abstract',
            date: '2023-04-10'
        },
        {
            id: 4,
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
            title: 'Forest Path',
            description: 'Sunlight filtering through trees on a peaceful forest trail.',
            category: 'nature',
            date: '2023-07-05'
        },
        {
            id: 5,
            url: 'https://images.unsplash.com/photo-1487956382158-bb926046304a?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
            title: 'Urban Bridge',
            description: 'Architectural marvel of a suspension bridge at dusk.',
            category: 'urban',
            date: '2023-06-30'
        },
        {
            id: 6,
            url: 'https://images.unsplash.com/photo-1543857778-c4a1a569e388?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
            title: 'Geometric Patterns',
            description: 'Modern geometric design with contrasting colors.',
            category: 'abstract',
            date: '2023-05-28'
        },
        {
            id: 7,
            url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
            title: 'Lake Reflection',
            description: 'Calm lake perfectly mirroring the surrounding mountains.',
            category: 'nature',
            date: '2023-08-12'
        },
        {
            id: 8,
            url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
            title: 'Night City',
            description: 'City lights creating patterns in the urban nightscape.',
            category: 'urban',
            date: '2023-07-18'
        },
        {
            id: 9,
            url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
            title: 'Color Splash',
            description: 'Vibrant colors mixing in an abstract composition.',
            category: 'abstract',
            date: '2023-04-25'
        },
        {
            id: 10,
            url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
            title: 'Waterfall',
            description: 'Powerful waterfall cascading down rocky cliffs.',
            category: 'nature',
            date: '2023-09-03'
        },
        {
            id: 11,
            url: 'https://images.unsplash.com/photo-1470219556762-1771e7f9427d?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
            title: 'Metropolis',
            description: 'Bird\'s eye view of a bustling metropolitan area.',
            category: 'urban',
            date: '2023-08-28'
        },
        {
            id: 12,
            url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
            title: 'Digital Art',
            description: 'Futuristic digital artwork with neon elements.',
            category: 'abstract',
            date: '2023-06-14'
        }
    ];
    
    currentImages = [...images];
    filteredImages = [...images];
    
    function renderGallery() {
        gallery.innerHTML = '';
        
        filteredImages.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.setAttribute('data-index', index);
            item.setAttribute('data-category', img.category);
            
            item.innerHTML = `
                <img src="${img.url}" alt="${img.title}" loading="lazy">
                <div class="item-info">
                    <h3>${img.title}</h3>
                    <p>${img.description}</p>
                    <span class="item-category ${img.category}">${img.category}</span>
                </div>
            `;
            
            item.addEventListener('click', () => openLightbox(index));
            gallery.appendChild(item);
        });
        
        imageCount.textContent = filteredImages.length;
    }
    
    function filterImages(category) {
        currentFilter = category;
        
        Object.values(filterButtons).forEach(btn => btn.classList.remove('active'));
        filterButtons[category].classList.add('active');
        
        if (category === 'all') {
            filteredImages = currentImages.filter(img => 
                img.title.toLowerCase().includes(currentSearch) || 
                img.description.toLowerCase().includes(currentSearch)
            );
        } else {
            filteredImages = currentImages.filter(img => 
                img.category === category && 
                (img.title.toLowerCase().includes(currentSearch) || 
                 img.description.toLowerCase().includes(currentSearch))
            );
        }
        
        renderGallery();
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightboxFunc() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function updateLightbox() {
        const img = filteredImages[currentIndex];
        lightboxImage.src = img.url;
        lightboxImage.alt = img.title;
        imageTitle.textContent = img.title;
        imageDescription.textContent = img.description;
        imageCategory.textContent = img.category.charAt(0).toUpperCase() + img.category.slice(1);
        imageDate.textContent = `Uploaded: ${img.date}`;
    }
    
    function navigateLightbox(direction) {
        currentIndex += direction;
        
        if (currentIndex < 0) {
            currentIndex = filteredImages.length - 1;
        } else if (currentIndex >= filteredImages.length) {
            currentIndex = 0;
        }
        
        updateLightbox();
    }
    
    function searchImages() {
        currentSearch = searchInput.value.toLowerCase().trim();
        filterImages(currentFilter);
    }
    
    function loadMoreImages() {
        const moreImages = [
            {
                id: 13,
                url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
                title: 'Northern Lights',
                description: 'Aurora borealis dancing across the night sky.',
                category: 'nature',
                date: '2023-10-05'
            },
            {
                id: 14,
                url: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
                title: 'Desert Dunes',
                description: 'Golden sand dunes under a setting sun.',
                category: 'nature',
                date: '2023-09-18'
            },
            {
                id: 15,
                url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
                title: 'Modern Architecture',
                description: 'Sleek lines and innovative building design.',
                category: 'urban',
                date: '2023-10-12'
            }
        ];
        
        currentImages.push(...moreImages);
        filterImages(currentFilter);
        
        loadMoreBtn.style.display = 'none';
        setTimeout(() => {
            alert('All images have been loaded!');
        }, 300);
    }
    
    filterButtons.all.addEventListener('click', () => filterImages('all'));
    filterButtons.nature.addEventListener('click', () => filterImages('nature'));
    filterButtons.urban.addEventListener('click', () => filterImages('urban'));
    filterButtons.abstract.addEventListener('click', () => filterImages('abstract'));
    
    shuffleBtn.addEventListener('click', () => {
        currentImages = shuffleArray([...currentImages]);
        filterImages(currentFilter);
    });
    
    closeLightbox.addEventListener('click', closeLightboxFunc);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightboxFunc();
    });
    
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    searchInput.addEventListener('input', searchImages);
    
    loadMoreBtn.addEventListener('click', loadMoreImages);
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightboxFunc();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
    
    renderGallery();
});