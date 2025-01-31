function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Perform a search by calling the ASP.NET Core API and fetching books based on a query.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} - The filtered book results from the API.
 */
async function performSearch(query) {
    try {
        if (!query) return [];

        const response = await fetch(`https://localhost:7221/api/BookFilters/search?keyword=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const books = await response.json();
        return books;

    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

/**
 * Display books in the container.
 * @param {Array} books - The array of book objects to display.
 */
function displayBooks(books) {
    const container = document.querySelector("#book-results");
    if (!container) {
        console.error("Error: No container with ID 'book-results' found.");
        return;
    }
    container.innerHTML = ''; // Clear previous content

    books.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        // Book Image
        const bookImage = document.createElement("img");
        bookImage.classList.add("book-image");
        bookImage.src = book.coverURL || '/IMG/default_image.jpg'; // Use coverURL from API
        bookImage.alt = book.title || "No Title Available";
        bookImage.onerror = () => bookImage.src = '/IMG/default_image.jpg'; // Fallback if image fails to load
        bookCard.appendChild(bookImage);

        // Book Details Container
        const bookDetails = document.createElement("div");
        bookDetails.classList.add("book-details");

        // Book Title
        const bookTitle = document.createElement("h3");
        bookTitle.classList.add("book-title");
        bookTitle.textContent = book.title || "No Title Available";
        bookDetails.appendChild(bookTitle);

        // Author
        if (book.author) {
            const bookAuthor = document.createElement("p");
            bookAuthor.classList.add("book-author");
            bookAuthor.textContent = `By: ${book.author}`;
            bookDetails.appendChild(bookAuthor);
        }

        // Price
        const bookPrice = document.createElement("p");
        bookPrice.classList.add("book-price");
        bookPrice.innerHTML = book.price ? `<strong>$${book.price.toFixed(2)}</strong>` : "Price Not Available";
        bookDetails.appendChild(bookPrice);

        // Add details container to card
        bookCard.appendChild(bookDetails);

        // Buttons Container
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        // Add to Cart Button
        const addToCartButton = document.createElement("button");
        addToCartButton.classList.add("add-to-cart");
        addToCartButton.textContent = "Add to Cart";
        addToCartButton.onclick = () => addToCart(book.title || "No Title Available");
        buttonContainer.appendChild(addToCartButton);

        // Add to Wishlist Button
        const addToWishlistButton = document.createElement("button");
        addToWishlistButton.classList.add("wishlist");
        addToWishlistButton.textContent = "Add to Wishlist";
        addToWishlistButton.onclick = () => addToWishlist(book.title || "No Title Available");
        buttonContainer.appendChild(addToWishlistButton);

        bookCard.appendChild(buttonContainer);
        container.appendChild(bookCard);
    });
}

/**
 * Show a user-friendly message in the results container.
 * @param {string} message - The message to display.
 */
function displayMessage(message) {
    const container = document.querySelector("#book-results");
    if (container) {
        container.innerHTML = `<p class="message">${message}</p>`;
    }
}

/**
 * Main logic to handle search and results display.
 */
(async function () {
    const query = getQueryParam('query');
    if (query) {
        displayMessage("Searching..."); // Show loading message
        const books = await performSearch(query);
        if (books.length > 0) {
            displayBooks(books);
        } else {
            displayMessage("No results found for your query.");
        }
    } else {
        displayMessage("No search query provided.");
    }
})();
