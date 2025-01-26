document.addEventListener('DOMContentLoaded', function () {

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
