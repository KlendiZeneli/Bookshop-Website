// fetch('/HTML/header.html')
//     .then(response => response.text())
//     .then(data => {
//         // Inject the fetched HTML into the DOM
//         document.getElementById('header').innerHTML = data;

//         // Now that the header is loaded, attach event listeners
//         const searchInput = document.getElementById('search-input');
//         const searchButton = document.getElementById('search-button');
//         const mobileMenuButton = document.querySelector('.mobile-menu-button');
//         const mobileMenu = document.querySelector('.mobile-menu');
//         const mobileSearchInput = document.querySelector('.mobile-search-input');
//         const mobileSearchButton = document.querySelector('.mobile-search-button');
//         const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

//         if (searchButton && searchInput) {
//             searchButton.addEventListener('click', function () {
//                 console.log("searching");
//                 performSearch(searchInput.value);
//             });

//             searchInput.addEventListener('keypress', function (e) {
//                 if (e.key === 'Enter') {
//                     console.log("searching");
//                     performSearch(searchInput.value);
//                 }
//             });
//         } else {
//             console.error("Search elements not found in the header.");
//         }

//         // Add other event listeners as needed
//         if (mobileMenuButton && mobileMenu) {
//             mobileMenuButton.addEventListener('click', function () {
//                 mobileMenu.classList.toggle('open');
//             });
//         }

//         /* Dropdown functionality */
//     dropdownToggles.forEach(toggle => {
//         toggle.addEventListener('click', function () {
//             const dropdownMenu = this.nextElementSibling;
//             if (mobileMenu.classList.contains('active')) {
//                 // For mobile menu
//                 dropdownMenu.classList.toggle('active');
//             } else {
//                 // For desktop menu
//                 const isOpen = dropdownMenu.style.display === 'block';
//                 closeAllDropdowns();
//                 if (!isOpen) {
//                     dropdownMenu.style.display = 'block';
//                 }
//             }
//         });
//     });

//     })
//     .catch(error => {
//         console.error("Error loading header:", error);
//     });

// document.addEventListener('DOMContentLoaded', function () {
//     console.log("DOM fully loaded");
// });


//     function performSearch(query) {
//         if (query) {
//             query = query.trim();
//             // Redirect to results page with the search query
//             window.location.href = `results.html?query=${encodeURIComponent(query)}`;
//         }
//     }

    
fetch('/HTML/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;

        // Add event listeners for search after the header is injected
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');

        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                performSearchRedirect(searchInput.value);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearchRedirect(searchInput.value);
                }
            });
        }
    })
    .catch(error => console.error('Error loading header:', error));


    (function () {
        d = document;
        s = d.createElement("script");
        s.src = "https://webagent.ai/api/chatbot/92208e6b-e6d1-4edc-a393-b6eb462c477c";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
    })();

/**
 * 
 * Redirect to the results page with the search query.
 * @param {string} query - The search query.
 */
function performSearchRedirect(query) {
    if (query) {
        query = query;
        window.location.href = `results.html?query=${encodeURIComponent(query)}`;
    }
}
