document.addEventListener('DOMContentLoaded', function () {
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

    /* Dropdown functionality */
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const dropdownMenu = this.nextElementSibling;
            if (mobileMenu.classList.contains('active')) {
                // For mobile menu
                dropdownMenu.classList.toggle('active');
            } else {
                // For desktop menu
                const isOpen = dropdownMenu.style.display === 'block';
                closeAllDropdowns();
                if (!isOpen) {
                    dropdownMenu.style.display = 'block';
                }
            }
        });
    });

    function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }

    /* Carousel Functionality */
    const carousel = document.querySelector(".carousel");
    const bookCards = document.querySelectorAll(".book-card");
    const prevButton = document.querySelector(".carousel-button.prev");
    const nextButton = document.querySelector(".carousel-button.next");

    let currentIndex = 0; // Track the current position of the carousel
    let cardWidth = bookCards[0].offsetWidth + 20; // Width of each card including margin
    let visibleCards = calculateVisibleCards(); // Number of visible cards at once
    const totalCards = bookCards.length;

    // Recalculate on window resize to handle screen changes
    window.addEventListener("resize", () => {
        cardWidth = bookCards[0].offsetWidth + 20; // Recalculate card width
        visibleCards = calculateVisibleCards(); // Recalculate visible cards
        updateCarouselPosition(); // Ensure correct positioning
    });

    // Event listeners for buttons
    prevButton.addEventListener("click", showPrevious);
    nextButton.addEventListener("click", showNext);

    // Function to calculate the number of visible cards based on screen size
    function calculateVisibleCards() {
        const parentWidth = carousel.parentElement.offsetWidth;
        return Math.floor(parentWidth / cardWidth) || 1; // At least 1 card visible
    }

    // Function to show the next set of books
    function showNext() {
        currentIndex++;
        if (currentIndex > totalCards - visibleCards) {
            currentIndex = 0; // Wrap back to the start
        }
        updateCarouselPosition();
    }

    // Function to show the previous set of books
    function showPrevious() {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = totalCards - visibleCards; // Wrap to the end
        }
        updateCarouselPosition();
    }

    // Update the carousel's position
    function updateCarouselPosition() {
        const newPosition = -currentIndex * cardWidth;
        carousel.style.transform = `translateX(${newPosition}px)`;
        carousel.style.transition = "transform 0.5s ease"; // Smooth scrolling
    }

});
