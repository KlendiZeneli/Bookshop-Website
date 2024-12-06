document.addEventListener('DOMContentLoaded', function () {

  /* Search Functionality */
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileSearchInput = document.querySelector('.mobile-search-input');
  const mobileSearchButton = document.querySelector('.mobile-search-button');

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
      // Search functionality to be implemented later
    }
  }

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
    const filterGroup = document.querySelector('.filter-section:first-child .filter-group');

    document.querySelectorAll('.subgenre-group').forEach(group => {
      group.style.display = 'none';
    });

    if (event.target.checked) {
      // Uncheck all other genre checkboxes
      genreCheckboxes.forEach(cb => {
        if (cb !== event.target) {
          cb.checked = false;
          cb.parentElement.style.display = 'block';
        }
      });

      if (subgenreGroup) {
        subgenreGroup.style.display = 'flex';
      }
      filterGroup.classList.add('filtered');
      event.target.parentElement.style.display = 'block';
    } else {
      filterGroup.classList.remove('filtered');
      genreCheckboxes.forEach(cb => {
        cb.parentElement.style.display = 'block';
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
  handleSingleSelection(yearCheckboxes);

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
    return fetch('/JSON/bookarray.json')
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

  /* Filtering Functionality */
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
    if (range === '2020-2024') return year >= 2020 && year <= 2024;
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




