// Function to get the search query from the URL
// function getQueryParam(name) {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(name);
// }

// // // Function to fetch book data based on the search query
// // function fetchBooks(query) {
// //     const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
// //     fetch(url)
// //         .then(response => response.json())
// //         .then(data => {
// //             displayBooks(data.items);
// //         })
// //         .catch(error => {
// //             console.error('Error fetching books:', error);
// //         });
// // }

// async function performSearch(query) {
//     try {
//         const response = await fetch('/JSON/bookarray.json');
//         const data = await response.json();

//         // Define the attributes to search
//         const attributesToSearch = ['title', 'language', 'genre', 'subgenre', 'publication_year'];

//         // Filter the JSON array
//         const results = data.filter(item =>
//             attributesToSearch.some(attr =>
//                 item[attr] && item[attr].toLowerCase().includes(query.toLowerCase())
//             )
//         );

//         return results; // Return the filtered results
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         return []; // Return an empty array in case of an error
//     }
// }

// // Function to display book cards
// function displayBooks(books) {
//     const container = document.querySelector("#book-results"); // Use a default container
//     if (!container) {
//         console.error("Error: No container with ID 'book-results' found.");
//         return;
//     }
//     container.innerHTML = ''; // Clear previous content

//     books.forEach(book => {
//         const bookCard = document.createElement("div");
//         bookCard.classList.add("book-card");

//         // Create the image element
//         const bookImage = document.createElement("img");
//         bookImage.classList.add("book-image");
//         bookImage.src = book.image || '/IMG/default_image.jpg';
//         bookImage.alt = book.title || "No Title Available";
//         bookCard.appendChild(bookImage);

//         // Create the book details container
//         const bookDetails = document.createElement("div");
//         bookDetails.classList.add("book-details");

//         // Add the book ti  tle
//         const bookTitle = document.createElement("div");
//         bookTitle.classList.add("book-title");
//         bookTitle.textContent = book.title || "No Title Available";
//         bookDetails.appendChild(bookTitle);

//         // Add the book price
//         const bookPrice = document.createElement("div");
//         bookPrice.classList.add("book-price");
//         const priceSpan = document.createElement("span");
//         priceSpan.classList.add("original-price");
//         priceSpan.textContent = book.price ? `$${book.price}` : "Price Not Available";
//         bookPrice.appendChild(priceSpan);
//         bookDetails.appendChild(bookPrice);

//         bookCard.appendChild(bookDetails);

//         // Add the Add to Cart button
//         const addToCartButton = document.createElement("button");
//         addToCartButton.classList.add("add-to-cart");
//         addToCartButton.textContent = "Add to cart";
//         addToCartButton.onclick = () => addToCart(book.title || "No Title Available");
//         bookCard.appendChild(addToCartButton);

//         bookCard.style.margin = "20px";

//         // Append the book card to the container
//         container.appendChild(bookCard);
//     });
// }



// // Get the search query from URL and fetch books
// (async function () {
//     // Get the search query from URL and fetch books
//     const query = getQueryParam('query');
//     if (query) {
//         const books = await performSearch(query);
//         if (books.length > 0) {
//             displayBooks(books);
//         } else {
//             document.getElementById("book-results").innerHTML = '<p>No results found for your query.</p>';
//         }
//     } else {
//         document.getElementById("book-results").innerHTML = '<p>No search query provided.</p>';
//     }
// })();

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Perform a search by filtering books from the JSON file based on a query.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} - The filtered book results.
 */
async function performSearch(query) {
    try {
        const response = await fetch('/JSON/bookarray.json');
        const data = await response.json();

        // Define attributes to search
        const attributesToSearch = ['title', 'language', 'genre', 'subgenre', 'publication_year'];

        // Prepare the query for partial matching
        const searchTerms = query.toLowerCase().split(' ');

        // Filter books
        const results = data.filter(item =>
            attributesToSearch.some(attr => {
                const value = item[attr];

                // Convert non-string values to strings for comparison
                const valueString = value != null ? String(value).toLowerCase() : null;

                // Check if all search terms are present in the stringified value
                return valueString && searchTerms.every(term => valueString.includes(term));
            })
        );

        return results; // Return the filtered results
    } catch (error) {
        console.error("Error fetching data:", error);
        return []; // Return an empty array in case of an error
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

        const bookImage = document.createElement("img");
        bookImage.classList.add("book-image");
        bookImage.src = book.image || '/IMG/default_image.jpg';
        bookImage.alt = book.title || "No Title Available";
        bookCard.appendChild(bookImage);

        const bookDetails = document.createElement("div");
        bookDetails.classList.add("book-details");

        const bookTitle = document.createElement("div");
        bookTitle.classList.add("book-title");
        bookTitle.textContent = book.title || "No Title Available";
        bookDetails.appendChild(bookTitle);

        const bookPrice = document.createElement("div");
        bookPrice.classList.add("book-price");
        const priceSpan = document.createElement("span");
        priceSpan.classList.add("original-price");
        priceSpan.textContent = book.price ? `$${book.price}` : "Price Not Available";
        bookPrice.appendChild(priceSpan);
        bookDetails.appendChild(bookPrice);

        bookCard.appendChild(bookDetails);

        const addToCartButton = document.createElement("button");
        addToCartButton.classList.add("add-to-cart");
        addToCartButton.textContent = "Add to cart";
        addToCartButton.onclick = () => addToCart(book.title || "No Title Available");
        bookCard.appendChild(addToCartButton);

        bookCard.style.margin = "20px";
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
        container.innerHTML = `<p>${message}</p>`;
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
