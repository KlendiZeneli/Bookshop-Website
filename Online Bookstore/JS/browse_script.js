document.addEventListener('DOMContentLoaded', function () {
    const priceRange = document.getElementById('price-range');
    const priceRangeValue = document.getElementById('price-range-value');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const sortSelect = document.getElementById('sort-select');
    const bookGrid = document.querySelector('.book-grid');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const ratingFilter = document.getElementById('rating-filter');
    const genreFilter = document.getElementById('genre-filter');
    const genreFilterContainer = document.getElementById('genre-filter-container');
    const subgenreFilter = document.getElementById('subgenre-filter');
    const subgenreFilterContainer = document.getElementById('subgenre-filter-container');

    let currentPage = 1;
    const booksPerPage = 10;
    const totalBooks = 50;

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    const category = urlParams.get('category');
    const subcategory = urlParams.get('subcategory');

    // Update page title and filters based on URL parameters
    updatePageTitle();
    populateGenreFilters();

    function updatePageTitle() {
        let title = 'Book Nook - Browse';
        if (lang) {
            title += ` ${lang.charAt(0).toUpperCase() + lang.slice(1)} Books`;
            if (category) {
                title += ` - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
                if (subcategory) {
                    title += ` - ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`;
                }
            }
        }
        document.title = title;
    }

    function updateURL() {
        const selectedGenre = document.querySelector('#genre-filter input:checked');
        const selectedSubgenre = document.querySelector('#subgenre-filter input:checked');

        const genreParam = selectedGenre ? selectedGenre.value : '';
        const subgenreParam = selectedSubgenre ? selectedSubgenre.value : '';

        const newURL = new URL(window.location);
        if (genreParam) newURL.searchParams.set('genre', genreParam);
        if (subgenreParam) newURL.searchParams.set('subcategory', subgenreParam);

        window.history.pushState({}, '', newURL);
    }

    function populateGenreFilters() {
        genreFilter.innerHTML = '';
        subgenreFilter.innerHTML = '';

        const selectedSubcategory = urlParams.get('subcategory'); // Detect subcategory in URL

        // If a specific subcategory is selected, hide both genre and subgenre filters
        if (selectedSubcategory) {
            genreFilterContainer.style.display = 'none'; // Hide genre filter
            subgenreFilterContainer.style.display = 'none'; // Hide subgenre filter
            return; // Skip further processing
        }

        let genres = [];

        // Determine genres to populate based on language and category
        if ((lang === 'albanian' || lang === 'english') && !category) {
            genreFilterContainer.style.display = 'block';
            genres = ['Fiction', 'Non-Fiction'];
            if (lang === 'english') {
                genres.push('Graphic Novels');
            }
        } else if (category) {
            genres = [category.charAt(0).toUpperCase() + category.slice(1)]; // Ensure selected category is shown
        } else {
            genreFilterContainer.style.display = 'none';
            subgenreFilterContainer.style.display = 'none';
            return;
        }

        genres.forEach(genre => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = genre.toLowerCase().replace(' ', '-');
            checkbox.name = 'genre';
            checkbox.value = genre.toLowerCase();

            // Auto-check the checkbox if it matches the category from the URL
            if (category && category.toLowerCase() === genre.toLowerCase()) {
                checkbox.checked = true;
                updateSubgenreFilters(); // Load subgenres for this genre
            }

            checkbox.addEventListener('change', function () {
                updateSubgenreFilters();
            });

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = genre;

            li.appendChild(checkbox);
            li.appendChild(label);
            genreFilter.appendChild(li);
        });
    }

    // Check if a category (genre) is pre-selected via URL
    if (category) {
        const genreCheckbox = document.querySelector(`#genre-filter input[value="${category.toLowerCase()}"]`);
        if (genreCheckbox) {
            genreCheckbox.checked = true;
            updateSubgenreFilters(); // Show subgenres for the selected genre
        }
    }

    function updateSubgenreFilters() {
        subgenreFilter.innerHTML = '';
        const selectedSubcategory = urlParams.get('subcategory'); // Detect subcategory in URL

        // If a specific subcategory is selected, hide the subgenre filter
        if (selectedSubcategory) {
            subgenreFilterContainer.style.display = 'none';
            return; // Skip further processing
        }
        
        const selectedGenres = Array.from(document.querySelectorAll('#genre-filter input:checked')).map(cb => cb.value);
        if (selectedGenres.length === 0) {
            subgenreFilterContainer.style.display = 'none';
            return;
        }

        let subgenres = new Set();
        selectedGenres.forEach(genres => {
            if (genres === 'fiction') {
                ['Sci-Fi', 'Mystery', 'Thriller', 'Romance', "Children's Books"].forEach(sg => subgenres.add(sg));
            } else if (genres === 'non-fiction') {
                ['Biography', 'Self Help', 'History', 'Science', 'Religion', 'Travel'].forEach(sg => subgenres.add(sg));
            } else if (genres === 'graphic-novels') {
                ['Comics', 'Manga'].forEach(sg => subgenres.add(sg));
            }
        });

        if (subgenres.size > 0) {
            subgenreFilterContainer.style.display = 'block';
            Array.from(subgenres).forEach(subgenre => {
                const li = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = subgenre.toLowerCase().replace(' ', '-');
                checkbox.name = 'subgenre';
                checkbox.value = subgenre.toLowerCase();

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = subgenre;

                li.appendChild(checkbox);
                li.appendChild(label);
                subgenreFilter.appendChild(li);
            });
        } else {
            subgenreFilterContainer.style.display = 'none';
        }
    }


    function updatePriceRangeValue() {
        const value = priceRange.value;
        priceRangeValue.textContent = `$${value} - $100`;
    }

    priceRange.addEventListener('input', updatePriceRangeValue);
    updatePriceRangeValue();

    function updatePagination() {
        currentPageSpan.textContent = `Page ${currentPage} of ${Math.ceil(totalBooks / booksPerPage)}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === Math.ceil(totalBooks / booksPerPage);
    }

    function fetchBooks() {
        const books = [];
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = Math.min(startIndex + booksPerPage, totalBooks);
        for (let i = startIndex + 1; i <= endIndex; i++) {
            books.push({
                title: `Book ${i}`,
                author: `Author ${i}`,
                price: Math.floor(Math.random() * 50) + 10,
                rating: Math.floor(Math.random() * 5) + 1
            });
        }
        return books;
    }

    function displayBooks(books) {
        bookGrid.innerHTML = '';
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book-item');
            bookElement.innerHTML = `
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p>$${book.price.toFixed(2)}</p>
                <p>Rating: ${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</p>
                <button>Add to Cart</button>
            `;
            bookGrid.appendChild(bookElement);
        });
    }

    function applyFilters() {
        console.log('Applying filters...');
        console.log('Price range:', priceRange.value);
        console.log('Rating filter:', ratingFilter.value);
        if (genreFilterContainer.style.display !== 'none') {
            console.log('Selected genres:', Array.from(document.querySelectorAll('#genre-filter input:checked')).map(cb => cb.value));
        }
        if (subgenreFilterContainer.style.display !== 'none') {
            console.log('Selected subgenres:', Array.from(document.querySelectorAll('#subgenre-filter input:checked')).map(cb => cb.value));
        }
        currentPage = 1;
        const books = fetchBooks();
        displayBooks(books);
        updatePagination();
    }

    applyFiltersBtn.addEventListener('click', applyFilters);

    sortSelect.addEventListener('change', function () {
        console.log('Sorting by:', this.value);
        const books = fetchBooks();
        // Sort books based on selected option
        displayBooks(books);
    });

    prevPageBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            const books = fetchBooks();
            displayBooks(books);
            updatePagination();
        }
    });

    nextPageBtn.addEventListener('click', function () {
        if (currentPage < Math.ceil(totalBooks / booksPerPage)) {
            currentPage++;
            const books = fetchBooks();
            displayBooks(books);
            updatePagination();
        }
    });

    // Initial load
    const initialBooks = fetchBooks();
    displayBooks(initialBooks);
    updatePagination();
});





