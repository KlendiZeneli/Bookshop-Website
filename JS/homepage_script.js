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
});

    (function () {
        d = document;
        s = d.createElement("script");
        s.src = "https://webagent.ai/api/chatbot/92208e6b-e6d1-4edc-a393-b6eb462c477c";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
    })();

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

    async function populateCarousel() {
        const carousel = document.getElementsByClassName("carousel")[0]; // Assuming there's only one carousel
        const bookCards = carousel.children; // This is an HTMLCollection of the carousel's children (book cards)
    
        // Loop through each book card element using a for loop
        for (let i = 0; i < bookCards.length; i++) {
            const element = bookCards[i]; // Get the current book card
            const bookTitleElement = element.getElementsByClassName("book-title")[0]; // Get the first book title
            const bookImageElement = element.getElementsByClassName("book-image")[0]; // Get the first book image
    
            const title = bookTitleElement.innerText;  // Get the book title text
            const encodedTitle = encodeURIComponent(title);  // Encode the title to handle spaces and special characters
            const thumbnailUrl = await fetchBookThumbnail(encodedTitle);  // Fetch the thumbnail URL asynchronously
            
            // If the thumbnail is available, update the book image's src
            if (thumbnailUrl) {
                bookImageElement.src = thumbnailUrl;
            } else {
                console.log("No thumbnail found for", title);
            }
        }
    }
    
    async function fetchBookThumbnail(title) {
        // Encode the title to handle spaces and special characters
        // const encodedTitle = encodeURIComponent(title);
        const apiUrl = `https://openlibrary.org/search.json?title=${title}`;
    
        try {
            // Fetch book data from Open Library API
            const response = await fetch(apiUrl);
            const data = await response.json();
    
            // Check if there are any results in the search response
            if (data.docs && data.docs.length > 0) {
                const book = data.docs[0];  // Take the first result
                const coverId = book.cover_i;  // Get the cover ID
                if (coverId) {
                    // Return the URL for the high-quality cover image
                    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;  // Large image size
                }
            }
            // Return null if no cover is found
            return null;
        } catch (error) {
            console.error("Error fetching book cover:", error);
            return null;
        }
    }

   
    populateCarousel();

