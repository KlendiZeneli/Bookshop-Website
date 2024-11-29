document.addEventListener('DOMContentLoaded', function () {
    
    /*Search Functionality */
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileSearchInput = document.querySelector('.mobile-search-input');
    const mobileSearchButton = document.querySelector('.mobile-search-button');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    searchButton.addEventListener('click', function () {
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    mobileSearchButton.addEventListener('click', function () {
        performSearch(mobileSearchInput.value);
    });

    mobileSearchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch(mobileSearchInput.value);
        }
    });

    mobileMenuButton.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    function performSearch(searchTerm) {
        searchTerm = searchTerm.trim();
        if (searchTerm) {
            console.log('Searching for:', searchTerm);
            /* Search functionality will be added later*/
        }
    }




    /* Dropdown Functionality */
    dropdownToggles.forEach(toggle => {
        const dropdownMenu = toggle.nextElementSibling;


        toggle.addEventListener('mouseenter', function () {
            if (!mobileMenu.classList.contains('active')) {
                closeAllDropdowns();
                dropdownMenu.style.display = 'block';
            }
        });

        const hideDropdown = function () {
            dropdownMenu.style.display = 'none';
        };

        toggle.addEventListener('mouseleave', hideDropdown);
        dropdownMenu.addEventListener('mouseleave', hideDropdown);

        dropdownMenu.addEventListener('mouseenter', function () {
            dropdownMenu.style.display = 'block';
        });
    });


    function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }

    /*Carousel Functionality */
    /*Carousel Functionality */
    function fetchBooks() {
        return fetch('bookarray.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => console.error('Error fetching book data:', error));
    }

    function renderBooks(bookList) {
        const carousel = document.querySelector('.carousel');
        carousel.innerHTML = '';
        const newBooks = bookList.filter(book => book.new === "yes");
        if (newBooks.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No new books available at the moment.';
            carousel.appendChild(message);
            return;
        }

        newBooks.forEach((book) => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
        <img src="${book.image}" alt="${book.title}" class="book-cover">
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author || "Unknown"}</p>
            <p class="book-price">$${book.price.toFixed(2)}</p>
        </div>
        <div class="book-actions">
            <button class="add-to-cart" onclick="addToCart('${book.title}')">Add to Cart</button>
            <button class="wishlist" onclick="addToWishlist('${book.title}')">Add to Wishlist</button>
        </div>
    `;

            carousel.appendChild(bookCard);
        });

        updateCarouselPosition();
    }

    fetchBooks()
        .then(books => {
            renderBooks(books);
        })
        .catch(error => console.error('Error rendering books:', error));

    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const carousel = document.querySelector('.carousel');

    let currentIndex = 0;

    prevButton.addEventListener('click', () => {
        currentIndex--;
        updateCarouselPosition();
    });

    nextButton.addEventListener('click', () => {
        currentIndex++;
        updateCarouselPosition();
    });

    function updateCarouselPosition() {
        const carousel = document.querySelector('.carousel');
        const cardWidth = 310; // Width of each book card including margin
        const containerWidth = carousel.parentElement.clientWidth;
        const visibleCards = Math.floor(containerWidth / cardWidth);
        const totalCards = carousel.children.length;

        // Ensure currentIndex wraps around correctly
        currentIndex = (currentIndex + totalCards) % totalCards;

        let offset;
        if (totalCards <= visibleCards) {
            // If all cards fit in the container, don't scroll
            offset = 0;
        } else {
            // Calculate the offset, considering wrapping
            offset = -((currentIndex % totalCards) * cardWidth);

            // Adjust offset to prevent empty space at the end
            const maxOffset = -(totalCards - visibleCards) * cardWidth;
            if (offset < maxOffset) {
                offset = maxOffset;
            }
        }

        carousel.style.transform = `translateX(${offset}px)`;
    }

    function addToCart(title) {
        console.log(`Added "${title}" to cart`);
    }

    function addToWishlist(title) {
        console.log(`Added "${title}" to wishlist`);
    }
});
