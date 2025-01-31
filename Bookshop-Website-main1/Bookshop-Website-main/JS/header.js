document.addEventListener('DOMContentLoaded', function () {
    // Load the header and navbar dynamically, ensuring loadModal starts after both are done
    Promise.all([
        loadHTML("/Bookshop-Website-main/HTML/header.html", "header"),
        loadHTML("/Bookshop-Website-main/HTML/nav.html", "navbar", setupNavbar)
    ]).then(() => {
        // After both HTML parts are loaded, execute loadModal
        isAuthenticated = !!localStorage.getItem("jwtToken");
        if (isAuthenticated) {
            showProfileButton();
        }
        else {
            showLoginButton();
            loadModal();
        }

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
    }).catch(error => {
        console.error("Error loading header or navbar:", error);
    });

    /**
     * Load HTML content into a specified container.
     * @param {string} url - The URL of the HTML file to fetch.
     * @param {string} containerId - The ID of the container to insert the HTML into.
     * @param {function} [callback] - Optional callback to execute after loading.
     */

    function loadHTML(url, containerId, callback) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        reject(`Failed to load ${url}: ${response.statusText}`);
                        return;
                    }
                    return response.text();
                })
                .then(data => {
                    document.getElementById(containerId).innerHTML = data;
                    if (callback) callback(); // Execute the optional callback
                    resolve(); // Resolve the promise after successfully loading
                })
                .catch(error => {
                    reject(`Error loading ${containerId}: ${error.message}`);
                });
        });
    }


    /**
     * Setup Navbar: Dynamic links and dropdown functionality.
     */
    function setupNavbar() {
        updateNavLinks(); // Dynamically update navbar links
        setupDropdowns(); // Setup dropdown functionality
        setupMobileMenu(); // Setup mobile menu functionality
    }

    /**
     * Update Navbar Links Based on Current Page.
     */
    function updateNavLinks() {
        const currentPage = window.location.pathname;
        const navLinksContainer = document.querySelector(".nav-links");

        if (navLinksContainer) {
            let linksHTML = "";

            if (currentPage.includes("homepage_index.html")) {
                linksHTML = `
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/browser_index.html" class="nav-link dropdown-toggle">Browse Books</a>
                <ul class="dropdown-menu">
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=fiction" class="dropdown-item">Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=non-fiction" class="dropdown-item">Non-Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=graphic-novels" class="dropdown-item">Graphic Novels</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=childrens-books" class="dropdown-item">Children's Books</a></li>
                </ul>
                </li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/specialpicks.html" class="nav-link">Special Picks</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/Footer_Files/gift.html" class="nav-link">Gifts and Accessories</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/events.html" class="nav-link">Events</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/funcorner.html" class="nav-link">Fun Nook</a></li>
            `;
            } else if (currentPage.includes("browser_index.html")) {
                linksHTML = `
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/homepage_index.html" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/specialpicks.html" class="nav-link">Special Picks</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/Footer_Files/gift.html" class="nav-link">Gifts and Accessories</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/events.html" class="nav-link">Events</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/funcorner.html" class="nav-link">Fun Nook</a></li>
            `;
            } else if (currentPage.includes("specialpicks.html")) {
                linksHTML = `
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/homepage_index.html" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/browser_index.html" class="nav-link dropdown-toggle">Browse Books</a>
                <ul class="dropdown-menu">
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=fiction" class="dropdown-item">Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=non-fiction" class="dropdown-item">Non-Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=graphic-novels" class="dropdown-item">Graphic Novels</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=childrens-books" class="dropdown-item">Children's Books</a></li>
                </ul>
                </li>
                <li class="nav-item"><a href="/Bookshop-Website-main/Footer_Files/gift.html" class="nav-link">Gifts and Accessories</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/events.html" class="nav-link">Events</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/funcorner.html" class="nav-link">Fun Nook</a></li>
            `;
            } else if (currentPage.includes("gift.html")) {
                linksHTML = `
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/homepage_index.html" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/browser_index.html" class="nav-link dropdown-toggle">Browse Books</a>
                <ul class="dropdown-menu">
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=fiction" class="dropdown-item">Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=non-fiction" class="dropdown-item">Non-Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=graphic-novels" class="dropdown-item">Graphic Novels</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=childrens-books" class="dropdown-item">Children's Books</a></li>
                </ul>
                </li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/specialpicks.html" class="nav-link">Special Picks</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/events.html" class="nav-link">Events</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/funcorner.html" class="nav-link">Fun Nook</a></li>
            `;
            } else if (currentPage.includes("events.html")) {
                linksHTML = `
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/homepage_index.html" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/browser_index.html" class="nav-link dropdown-toggle">Browse Books</a>
                <ul class="dropdown-menu">
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=fiction" class="dropdown-item">Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=non-fiction" class="dropdown-item">Non-Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=graphic-novels" class="dropdown-item">Graphic Novels</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=childrens-books" class="dropdown-item">Children's Books</a></li>
                </ul>
                </li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/specialpicks.html" class="nav-link">Special Picks</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/Footer_Files/gift.html" class="nav-link">Gifts and Accessories</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/funcorner.html" class="nav-link">Fun Nook</a></li>
            `;
            } else if (currentPage.includes("funcorner.html")) {
                linksHTML = `
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/homepage_index.html" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/browser_index.html" class="nav-link dropdown-toggle">Browse Books</a>
                <ul class="dropdown-menu">
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=fiction" class="dropdown-item">Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=non-fiction" class="dropdown-item">Non-Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=graphic-novels" class="dropdown-item">Graphic Novels</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=childrens-books" class="dropdown-item">Children's Books</a></li>
                </ul>
                </li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/specialpicks.html" class="nav-link">Special Picks</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/Footer_Files/gift.html" class="nav-link">Gifts and Accessories</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/events.html" class="nav-link">Events</a></li>
            `;
            }
            else if (currentPage.includes("admin.html")) {
                linksHTML = `
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/browser_index.html" class="nav-link dropdown-toggle">Browse Books</a>
                <ul class="dropdown-menu">
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=fiction" class="dropdown-item">Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=non-fiction" class="dropdown-item">Non-Fiction</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=graphic-novels" class="dropdown-item">Graphic Novels</a></li>
                    <li><a href="/Bookshop-Website-main/HTML/browser_index.html?genre=childrens-books" class="dropdown-item">Children's Books</a></li>
                </ul>
                </li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/specialpicks.html" class="nav-link">Special Picks</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/Footer_Files/gift.html" class="nav-link">Gifts and Accessories</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/events.html" class="nav-link">Events</a></li>
                <li class="nav-item"><a href="/Bookshop-Website-main/HTML/funcorner.html" class="nav-link">Fun Nook</a></li>
            `;

            }
            navLinksContainer.innerHTML = linksHTML;
        }
    }

    /* Setup Dropdown Functionality*/
    function setupDropdowns() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

        dropdownToggles.forEach(toggle => {
            const dropdownMenu = toggle.nextElementSibling;

            toggle.addEventListener('mouseenter', function () {
                dropdownMenu.classList.add('show');
            });

            toggle.addEventListener('mouseleave', function () {
                dropdownMenu.classList.remove('show');
            });

            dropdownMenu.addEventListener('mouseenter', function () {
                dropdownMenu.classList.add('show');
            });

            dropdownMenu.addEventListener('mouseleave', function () {
                dropdownMenu.classList.remove('show');
            });
        });
    }

    /**
     * Setup Mobile Menu Toggle.
     */
    function setupMobileMenu() {
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function () {
                this.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            });
        }
    }

    /**
     * Perform Search Functionality.
     * @param {string} query - The search query.
     */
    function performSearch(query) {
        query = query.trim();
        if (query) {
            console.log('Searching for:', query);
            // Add your search functionality or redirect logic here
        }
    }

    (function () {
        const d = document;
        const s = d.createElement("script");
        s.src = "https://webagent.ai/api/chatbot/92208e6b-e6d1-4edc-a393-b6eb462c477c";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
    })();


    /**
     * Redirect to the results page with the search query.
     * @param {string} query - The search query.
     */
    function performSearchRedirect(query) {
        if (query) {
            window.location.href = `results.html?query=${encodeURIComponent(query)}`;
        }
    }

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

    // Function to show the login modal
    function showModal() {
        closeRegisterModal(); // Ensure register modal is closed first
        if (!document.querySelector('.modal-container')) {
            createModal(); // Create modal only if it does not exist
        }
        document.querySelector('.modal-backdrop').style.display = 'block';
        document.querySelector('.modal-container').style.display = 'block';
    }

    // Function to show the register modal
    function showRegisterModal() {
        closeModal(); // Ensure login modal is closed first
        if (!document.querySelector('.modal-container.register')) {
            createRegisterModal(); // Create register modal only if it does not exist
        }
        document.querySelector('.modal-backdrop').style.display = 'block';
        document.querySelector('.modal-container').style.display = 'block';
    }

    function createRegisterModal() {
        const modalBackdrop = document.createElement('div');
        modalBackdrop.classList.add('modal-backdrop');
    
        const modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container', 'register'); // Add "register" class here
    
        modalContainer.innerHTML = `
            <span class="close-btn">&times;</span>
            <h3>Create a new account</h3>
            <form id="registerForm">
                <input type="text" id="regUserName" placeholder="Enter your username" required> 
                <input type="email" id="regEmail" placeholder="Enter your email" required> 
                <input type="password" id="regPassword" placeholder="Enter your password" required> 
                <button type="submit">Register</button>
                <p>Already have an account? <span class="switch-link" id="loginLink">Login here</span></p>
            </form>
        `;
    
        modalBackdrop.addEventListener('click', closeRegisterModal);
        modalContainer.querySelector('.close-btn').addEventListener('click', closeRegisterModal);
    
        document.body.appendChild(modalBackdrop);
        document.body.appendChild(modalContainer);
    
        // Fix "Login Here" button to properly switch modals
        document.getElementById('loginLink').addEventListener('click', function (e) {
            e.preventDefault();
            closeRegisterModal();
            showModal();
        });
    
        document.getElementById('registerForm').addEventListener('submit', function (e) {
            e.preventDefault();
            handleRegister();
        });
    }
    
     
    
    function createModal() {
        const modalBackdrop = document.createElement('div');
        modalBackdrop.classList.add('modal-backdrop');
    
        const modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container', 'login'); // Add "login" class
    
        modalContainer.innerHTML = `
            <span class="close-btn">&times;</span>
            <h3>Login to an account to access your profile</h3>
            <form id="loginForm">
                <input type="text" id="userName" placeholder="Enter your username" required> 
                <input type="password" id="userPassword" placeholder="Enter your password" required> 
                <button type="submit">Login</button>
                <p>Don't have an account? <span class="switch-link" id="registerLink">Register here</span></p>
            </form>
        `;
    
        modalBackdrop.addEventListener('click', closeModal);
        modalContainer.querySelector('.close-btn').addEventListener('click', closeModal);
    
        document.body.appendChild(modalBackdrop);
        document.body.appendChild(modalContainer);
    
        // Fix "Register Here" button to properly switch modals
        document.getElementById('registerLink').addEventListener('click', function (e) {
            e.preventDefault();
            closeModal();
            showRegisterModal();
        });
    
        document.getElementById('loginForm').addEventListener('submit', function (e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    

    // Function to handle login form submission
    async function handleLogin() {
        const username = document.getElementById('userName').value;
        const password = document.getElementById('userPassword').value;

        const loginData = {
            identifier: username,
            password: password,
        };

        try {
            const response = await fetch('https://localhost:7221/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                const token = data.token;
                // Store the token in localStorage or sessionStorage
                localStorage.setItem('jwtToken', token);
                // Close the modal and reload the page
                closeModal();
                window.location.reload();  // Refresh the page to show profile button
            } else {
                alert(data.message || 'Login failed!');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login.');
        }
    }

    function closeModal() {
        const modalContainer = document.querySelector('.modal-container.login');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalContainer) modalContainer.remove();
        if (modalBackdrop) modalBackdrop.remove();
    }
    
    function closeRegisterModal() {
        const modalContainer = document.querySelector('.modal-container.register');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalContainer) modalContainer.remove();
        if (modalBackdrop) modalBackdrop.remove();
    }
    


    // Show login button and hide profile button
    function showLoginButton() {
        document.getElementById('login').style.display = 'block';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('logout').style.display = 'none';  // Hide logout button
    }

    // Show profile button and hide login button
    function showProfileButton() {
        document.getElementById('login').style.display = 'none';
        document.getElementById('profile').style.display = 'block';
        document.getElementById('logout').style.display = 'block';  // Show logout button
    }

    // Function to handle logout
    function handleLogout() {
        const confirmation = confirm("Are you sure you want to log out?");
        if (confirmation) {
            // Remove the JWT token
            localStorage.removeItem('jwtToken');

            // Redirect to the homepage
            window.location.href = '/Bookshop-Website-main/HTML/homepage_index.html';  // Redirect to homepage
        }
    }

    // Load the modal and manage login/logout state on page load
    function loadModal() {
        // Add the event listener for login button to open the modal
        document.getElementById('login').addEventListener('click', showModal);

        // Check if the user is logged in and update the UI accordingly
        if (localStorage.getItem('jwtToken')) {
            showProfileButton();  // Show profile and logout if logged in
        } else {
            showLoginButton();  // Show login button if not logged in
        }

        // Add event listener to the logout button
        document.getElementById('logout').addEventListener('click', handleLogout);
    }

    // Initialize modal and buttons when the page loads
    window.onload = loadModal;


        // Function to handle register form submission
    async function handleRegister() {
        const username = document.getElementById('regUserName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        const registerData = {
            username: username,
            email: email,
            password: password,
        };

        try {
            const response = await fetch('https://localhost:7221/api/Auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! You can now log in.');

                // Optionally, store the token if it's returned upon registration
                if (data.token) {
                    localStorage.setItem('jwtToken', data.token);
                    window.location.reload(); // Reload to reflect login state
                }

                closeRegisterModal();
                showModal(); // Open login modal after successful registration
            } else {
                alert(data.message || 'Registration failed!');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration.');
        }
    }


});