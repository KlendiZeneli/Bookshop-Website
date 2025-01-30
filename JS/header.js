document.addEventListener('DOMContentLoaded', function () {
    // Load the header and navbar dynamically, ensuring loadModal starts after both are done
    Promise.all([
        loadHTML("/Bookshop-Website-main/HTML/header.html", "header"),
        loadHTML("/Bookshop-Website-main/HTML/nav.html", "navbar", setupNavbar)
    ]).then(() => {
        // After both HTML parts are loaded, execute loadModal
        isAuthenticated = !!localStorage.getItem("jwtToken");
        if(isAuthenticated)
        {
        showProfileButton();
        }

     else {
        showLoginButton();
        loadModal();
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

    createModal();
    const profileIcon = document.querySelector('#profile'); // Adjust this as needed
    if (profileIcon) {
        profileIcon.addEventListener('click', showModal);
    }

});

// Function to create and show the login modal
function showModal() {
    // Check if modal already exists
    if (!document.querySelector('.modal-backdrop')) {
        createModal();  // Only create modal once
    }

    // Show modal and backdrop
    document.querySelector('.modal-backdrop').style.display = 'block';
    document.querySelector('.modal-container').style.display = 'block';
}

// Function to create modal structure and logic
function createModal() {
    const modalBackdrop = document.createElement('div');
    modalBackdrop.classList.add('modal-backdrop');

    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');

    modalContainer.innerHTML = `
        <span class="close-btn">&times;</span>
        <h3>Login to an account to access your profile</h3>
        <form id="loginForm">
            <input type="text" id="loginEmail" placeholder="Email" required>
            <input type="password" id="loginPassword" placeholder="Password" required>
            <button type="submit">Login</button>
            <p>Don't have an account? <span class="switch-link" onclick="showRegisterForm()">Register here</span></p>
        </form>
    `;

    // Add event listeners
    modalBackdrop.addEventListener('click', closeModal);
    modalContainer.querySelector('.close-btn').addEventListener('click', closeModal);

    // Append modal to body
    document.body.appendChild(modalBackdrop);
    document.body.appendChild(modalContainer);

    // Handle form submission
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleLogin();
    });
}

// Function to switch to the registration form
function showRegisterForm() {
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.innerHTML = `
        <span class="close-btn">&times;</span>
        <h3>Register</h3>
        <form id="registerForm">
            <input type="text" id="registerName" placeholder="Full Name" required>
            <input type="text" id="registerEmail" placeholder="Email" required>
            <input type="password" id="registerPassword" placeholder="Password" required>
            <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
            <button type="submit">Register</button>
            <p>Already have an account? <span class="switch-link" onclick="showLoginForm()">Login here</span></p>
        </form>
    `;

    // Add event listeners for new form
    document.querySelector('.close-btn').addEventListener('click', closeModal);
    document.getElementById('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleRegister();
    });
}

// Function to switch back to the login form
function showLoginForm() {
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.innerHTML = `
        <span class="close-btn">&times;</span>
        <h3>Login to an account to access your profile</h3>
        <form id="loginForm">
            <input type="text" id="loginEmail" placeholder="Email" required>
            <input type="password" id="loginPassword" placeholder="Password" required>
            <button type="submit">Login</button>
            <p>Don't have an account? <span class="switch-link" onclick="showRegisterForm()">Register here</span></p>
        </form>
    `;

    // Add event listeners for new form
    document.querySelector('.close-btn').addEventListener('click', closeModal);
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleLogin();
    });
}

// Function to close modal
function closeModal() {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const modalContainer = document.querySelector('.modal-container');
    if (modalBackdrop) modalBackdrop.style.display = 'none';
    if (modalContainer) modalContainer.style.display = 'none';
    modalBackdrop.remove();
    modalContainer.remove();
}

// Handle login form submission
// Function to handle login form submission
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    console.log('Hello');
    const loginData = {
    identifier: email,  // Send email or username (identifier)
    password: password,
    rememberMe: false  // Optional: Handle if you want to implement "Remember Me"
                    };
try {
    const response = await fetch('https://localhost:7221/api/Auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    });
    const data = await response.json();
    if (response.ok) {
        // Assuming the token is returned in the response as 'data.token' (adjust as per your backend response)
        const token = data.token;
        // Store the token in localStorage or sessionStorage (depends on your use case)
        localStorage.setItem('jwtToken', token);
        // alert('Login Successful!');
        closeModal();
        window.location.href = window.location.href;  // Close the modal after successful login
    } else {
        alert(data.message || 'Login failed!');
    }
} catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred during login.');
}
}


// Handle registration form submission
function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    console.log('Registering with:', name, email, password);
    alert('Registration Successful!');
    closeModal();
}

    /*Check if the user is logged in (replace with your actual login check)
    const isLoggedIn = checkLoginStatus();
    if (isLoggedIn) {
        showProfileButton();
    } else {
        showLoginButton();
    }*/

    // Function to check if the user is logged in (se di si mund tfunx u figure it out)


    // Function to show the login button and hide the profile button
    function showLoginButton() {
        document.getElementById('login').style.display = 'block';
        document.getElementById('profile').style.display = 'none';
    }

    // Function to show the profile button and hide the login button
    function showProfileButton() {
        document.getElementById('login').style.display = 'none';
        document.getElementById('profile').style.display = 'block';
    }

    // // Simulate the login action 
    // function handleLogin(token) {
    //     // Save token to localStorage (or wherever you're storing authentication data)
    //     localStorage.setItem('userToken', token);

    //     // After login, update the UI
    //     showProfileButton();
    // }

    // // Add a logout functionality to clear the login status (optional)
    // function handleLogout() {
    //     // Clear the token from localStorage
    //     localStorage.removeItem('userToken');

    //     // Show login button again
    //     showLoginButton();
    // }




function loadModal() {
    createModal();

    const profileIcon = document.querySelector('#login');
    console.log(profileIcon);// Adjust this as needed
    if (profileIcon) {
        profileIcon.addEventListener('click', showModal);
    }
}
