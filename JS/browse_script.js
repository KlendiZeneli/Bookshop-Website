async function addToCart(bookTitle) {
  try {
      // Fetch book details from API
      const response = await fetch(`https://localhost:7221/api/BookFilters/get-by-title/${encodeURIComponent(bookTitle)}`);
      
      if (!response.ok) {
          alert("Book not found.");
          return;
      }

      const book = await response.json();

      // Retrieve the cart from localStorage and parse it, or initialize an empty array
      let cart = JSON.parse(localStorage.getItem('Cart')) || [];

      console.log("Current cart:", cart); // Debugging: See the current cart contents

      // Check if the book is already in the cart by comparing the book id
      let existingItem = cart.find(item => item.isbn === book.isbn); // Use ISBN instead of id, as ISBN should be unique

      if (existingItem) {
          // If the book is already in the cart, check if the quantity is within stock limits
          if (existingItem.quantity < existingItem.quantityInStock) {
              existingItem.quantity += 1; // Increase the quantity
          } else {
              alert("Cannot add more, stock limit reached.");
              return;
          }
      } else {
          // If the book is not in the cart, add the book to the cart
          cart.push({
              isbn: book.isbn,
              title: book.title,
              author: book.author,
              price: book.price,
              coverURL: book.coverURL, // ✅ Now includes cover image URL
              quantity: 1, // Initially, quantity is 1
              quantityInStock: book.quantityInStock // Ensure backend provides this
          });
      }

      console.log("Updated cart:", cart); // Debugging: See the updated cart contents

      // Save the updated cart back to localStorage
      localStorage.setItem('Cart', JSON.stringify(cart));

      alert(`${book.title} has been added to your cart!`);

      // Navigate to the Cart page
      window.location.href = "/Bookshop-Website-main/HTML/cart.html"; // Replace with your actual cart page URL

  } catch (error) {
      console.error("Error adding book to cart:", error);
      alert("An error occurred while adding the book to your cart.");
  }
}




function addToWishlist(bookTitle) {
  console.log(`${bookTitle} added to wishlist`); // Placeholder for adding logic
  alert(`${bookTitle} has been added to your wishlist!`);

  // Navigate to the Wishlist page
  window.location.href = "#"; // Replace with your actual wishlist page URL
}

document.addEventListener('DOMContentLoaded', function () {
  /* Filter Sidebar Functionality */
  const genreCheckboxes = document.querySelectorAll('.filter-checkbox[data-genre]');
  const languageCheckboxes = document.querySelectorAll('.filter-section-language .filter-checkbox');
  const yearCheckboxes = document.querySelectorAll('.filter-section-year .filter-checkbox');
  const priceRange = document.getElementById('price-range');
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');

  function handleGenreChange(event) {
    const selectedGenre = event.target.getAttribute('data-genre');
    const subgenreGroup = document.getElementById(`${selectedGenre}-subgenres`);

    // Show or hide the relevant subgenre group based on whether the genre is checked
    if (event.target.checked && subgenreGroup) {
      subgenreGroup.style.display = 'flex';
    } else if (subgenreGroup) {
      subgenreGroup.style.display = 'none';

      // Uncheck all subgenre checkboxes when the parent genre is unchecked
      const subgenreCheckboxes = subgenreGroup.querySelectorAll('.subgenre-filter-checkbox');
      subgenreCheckboxes.forEach(subgenreCheckbox => {
        subgenreCheckbox.checked = false;
      });
    }

    // Trigger filterBooks to update the displayed books
    filterBooks();
  }
  function handleSingleSelection(checkboxes) {
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        if (this.checked) {
          checkboxes.forEach(cb => {
            if (cb !== this) {
              cb.parentElement.style.display = 'none';
            }
          });
        } else {
          checkboxes.forEach(cb => {
            cb.parentElement.style.display = 'block';
          });
        }
      });
    });
  }

  function updatePriceRange() {
    const value = priceRange.value;
    priceMin.textContent = `$0`;
    priceMax.textContent = `$${value}`;
  }

  genreCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handleGenreChange);
  });


  handleSingleSelection(languageCheckboxes);

  priceRange.addEventListener('input', updatePriceRange);
  updatePriceRange();




  /* Toggle Side Menu Functionality */
  const toggleFilterBtn = document.getElementById('toggle-filter');
  const filtersSidebar = document.querySelector('.filter-menu');
  const contentWrapper = document.querySelector('.content-wrapper');
  const bookGrid = document.querySelector('.book-grid');

  toggleFilterBtn.addEventListener('click', function () {
    filtersSidebar.classList.toggle('open');
    contentWrapper.classList.toggle('shifted');
    bookGrid.classList.toggle('shifted');
    bookGrid.classList.toggle('grid-3x4');
    bookGrid.classList.toggle('grid-4x3');

    if (filtersSidebar.classList.contains('open')) {
      toggleFilterBtn.textContent = 'Close Filters';
    } else {
      toggleFilterBtn.textContent = 'Open Filters';
    }
  });




  /*Book Display and Pagination Functionality*/
  let books = [];
  let currentPage = 1;
  let filteredBooks = [];
  const booksPerPage = 12;

  function fetchBooks() {
    return fetch('https://localhost:7221/api/BookFilters/all')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        books = data;
        filteredBooks = books;
        return books;
      })
      .catch((error) => console.error('Error fetching book data:', error));
  }


  function renderBooks(bookList) {
    const bookGrid = document.getElementById("book-grid");
    bookGrid.innerHTML = "";

    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;

    const booksToDisplay = bookList.slice(startIndex, endIndex);

    booksToDisplay.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.className = "book-card";
      bookCard.innerHTML = `
        <img src="${book.coverURL}" alt="${book.title}" class="book-cover">
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
      bookGrid.appendChild(bookCard);
    });
  }

  function updatePagination() {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const totalPagesText = document.getElementById("total-pages");
    const currentPageText = document.getElementById("current-page");

    totalPagesText.textContent = totalPages;
    currentPageText.textContent = currentPage;

    document.getElementById("next-page").disabled = currentPage === totalPages;
    document.getElementById("prev-page").disabled = currentPage === 1;
  }

  document.getElementById("next-page").addEventListener("click", () => {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderBooks(filteredBooks);
      updatePagination();
    }
  });

  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderBooks(filteredBooks);
      updatePagination();
    }
  });

  function filterBooks() {
    const selectedGenres = Array.from(document.querySelectorAll('.filter-checkbox[data-genre]:checked'))
      .map(cb => cb.dataset.genre);
    const selectedSubgenres = Array.from(document.querySelectorAll('.subgenre-filter-checkbox:checked'))
      .map(cb => cb.parentElement.textContent.trim());
    const selectedLanguages = Array.from(document.querySelectorAll('.filter-section-language .filter-checkbox:checked'))
      .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    const selectedYearRanges = Array.from(document.querySelectorAll('.filter-section-year .filter-checkbox:checked'))
      .map(cb => cb.parentElement.textContent.trim());
    const maxPrice = parseFloat(document.getElementById('price-range').value);

    filteredBooks = books.filter(book => {
      const genreMatch = selectedGenres.length === 0 || selectedGenres.includes(book.genre);
      const subgenreMatch = selectedSubgenres.length === 0 || selectedSubgenres.includes(book.subgenre);
      const languageMatch = selectedLanguages.length === 0 || selectedLanguages.includes(book.language.toLowerCase());
      const yearMatch = selectedYearRanges.length === 0 || selectedYearRanges.some(range => matchYearRange(book.publication_year, range));
      const priceMatch = book.price <= maxPrice;

      // Book matches if it matches any selected genre or subgenre
      return genreMatch && subgenreMatch && languageMatch && yearMatch && priceMatch;
    });

    currentPage = 1;
    renderBooks(filteredBooks);
    updatePagination();

    // Update URL with current filters
    const urlParams = new URLSearchParams(window.location.search);
    if (selectedGenres.length > 0) {
      urlParams.set('genre', selectedGenres[0]); // Assuming single genre selection
    } else {
      urlParams.delete('genre');
    }

    const newURL = `${window.location.pathname}?${urlParams.toString()}`;
    history.pushState(null, '', newURL);
  }

  function matchYearRange(year, range) {
    if (range === '2020-2024') return year >= 2020 && year <= 2026;
    if (range === '2015-2019') return year >= 2015 && year <= 2019;
    if (range === 'Before 2015') return year < 2015;
    return false;
  }

  document.querySelectorAll('.filter-checkbox, .subgenre-filter-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', filterBooks);
  });

  document.getElementById('price-range').addEventListener('input', () => {
    document.getElementById('price-max').textContent = `$${document.getElementById('price-range').value}`;
    filterBooks();
  });

  /* Apply Filters from URL */
  function applyFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedGenre = urlParams.get('genre');

    if (selectedGenre) {
      genreCheckboxes.forEach(checkbox => {
        if (checkbox.getAttribute('data-genre') === selectedGenre) {
          checkbox.checked = true;
          const event = new Event('change');
          checkbox.dispatchEvent(event);
        } else {
          checkbox.checked = false;
        }
      });
    }
  }

  // Fetch books, then apply filters and render
  fetchBooks().then(() => {
    applyFiltersFromURL();
    if (filteredBooks.length === books.length) {
      renderBooks(books);
      updatePagination();
    }
  });
});