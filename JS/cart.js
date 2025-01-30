// Initialize current view from localStorage or default to 'cart'
let currentView = localStorage.getItem('currentView') || 'cart';

// View management
function showView(view) {
    const views = ['cart', 'shipping', 'billing']; // List of valid views
    const viewSuffix = '-view'; // Suffix for DOM elements
    const titles = {
        'cart': 'My cart',
        'shipping': 'Shipping address',
        'billing': 'Invoice'
    };

    // Validate the view
    if (!views.includes(view)) {
        console.error(`Invalid view: ${view}`);
        return;
    }

    // Hide all views
    views.forEach(v => {
        const element = document.getElementById(`${v}${viewSuffix}`);
        if (element) {
            element.style.display = 'none'; // Hide all views
        }
    });

    // Show the selected view
    const selectedView = document.getElementById(`${view}${viewSuffix}`);
    if (selectedView) {
        selectedView.style.display = 'block'; // Show the selected view
    }

    // Update the title based on the current view
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
        titleElement.textContent = titles[view];
    }

    // Save the current view for persistence
    currentView = view;
    localStorage.setItem('currentView', view);

    // Fetch user details if on billing view
    if (view === 'billing') {
        fetchUserDetails(); // Ensure this function is defined
    }

    // Update navigation state
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.dataset.view) {
            item.classList.toggle('active', item.dataset.view === view);
        }
    });
}

// Shipping Cities and Price Summary
let shippingMethod = 'delivery'; // 'delivery' or 'pickup'
const albanianCities = [
    "Tirana", "Durrës", "Shkodër", "Vlorë", "Fier", "Korçë", "Berat",
    "Gjirokastër", "Elbasan", "Lushnjë", "Pogradec", "Kukës", "Lezhë",
    "Sarandë", "Kavajë", "Tepelenë", "Gramsh", "Përmet", "Bulqizë",
    "Peshkopi", "Krujë", "Himarë", "Ersekë", "Librazhd", "Divjakë",
    "Patos", "Cërrik", "Shijak"
];

// Populate city select dropdown
const citySelect = document.getElementById("state");
if (citySelect) {
    albanianCities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Utility function for consistent currency formatting
function formatPrice(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        console.error('Invalid amount:', amount);
        return '0 ALL';
    }
    return `${amount.toLocaleString()} ALL`;
}

// Calculate and update the price summary
function updatePriceSummary() {
    let cartItems;
    try {
        cartItems = JSON.parse(localStorage.getItem('Cart')) || [];
    } catch (error) {
        console.error('Failed to parse cart items:', error);
        cartItems = [];
    }

    if (!Array.isArray(cartItems)) {
        console.error("Cart items are not defined or not an array.");
        return;
    }

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = shippingMethod === 'pickup' ? 0 : calculateShipping();
    const total = subtotal + shipping;

    const summaryHTML = `
        <div class="summary-row">
            <span>Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
        </div>
        <div class="summary-row">
            <span>Transport cost</span>
            <span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        <div class="summary-row">
            <span>Total</span>
            <span>${formatPrice(total)}</span>
        </div>
    `;

    ['price-summary', 'shipping-price-summary', 'billing-price-summary', 'payment-price-summary'].forEach(id => {
        const element = document.getElementById(id);
        if (element && element.innerHTML !== summaryHTML) {
            element.innerHTML = summaryHTML;
        }
    });
}

// Calculate shipping cost
const shippingCosts = {
    Tirana: 100,
    default: 250
};

function calculateShipping() {
    const city = getValueById("state");
    if (!city || !shippingCosts.hasOwnProperty(city)) {
        console.warn("No valid city selected, defaulting to default shipping cost.");
        return shippingCosts.default;
    }
    return shippingCosts[city];
}

function toggleShippingMethod(method) {
    shippingMethod = method;

    const deliveryForm = document.getElementById('delivery-form');
    const pickupForm = document.getElementById('pickup-form');
    const deliveryButton = document.getElementById('delivery-button');
    const pickupButton = document.getElementById('pickup-button');

    if (deliveryForm && pickupForm && deliveryButton && pickupButton) {
        // Toggle visibility using the 'hidden' class
        if (method === 'delivery') {
            deliveryForm.classList.remove('hidden'); // Show delivery form
            pickupForm.classList.add('hidden'); // Hide pickup form
            deliveryButton.classList.add('button-primary');
            pickupButton.classList.remove('button-primary');
        } else {
            pickupForm.classList.remove('hidden'); // Show pickup form
            deliveryForm.classList.add('hidden'); // Hide delivery form
            pickupButton.classList.add('button-primary');
            deliveryButton.classList.remove('button-primary');
        }

        updatePriceSummary();
    } else {
        console.error('Required DOM elements for shipping method toggle not found.');
    }
}

function getValueById(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with ID "${id}" not found.`);
        return null;
    }
    return element.value.trim();
}

// Provisional Cart Items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartView = document.getElementById('cart-view');
    const pageTitle = document.getElementById('page-title');

    let cartItems;
    try {
        cartItems = JSON.parse(localStorage.getItem('Cart')) || [];
    } catch (error) {
        console.error('Failed to parse cart items:', error);
        cartItems = [];
    }

    if (!Array.isArray(cartItems)) {
        console.error('Cart items data is corrupted.');
        return;
    }

    if (cartItems.length === 0) {
        if (pageTitle) pageTitle.textContent = "Your cart is empty!";
        if (cartView) cartView.style.display = 'none';
        hidePriceSummaryAndCheckout();
        return;
    }

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();

        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';

            itemElement.innerHTML = `
                <img src="${item.coverURL || 'placeholder.jpg'}" alt="${item.title}" loading="lazy">
                <div class="item-details">
                    <div class="item-title">${item.title}</div>
                    <div class="item-author">${item.author}</div>
                    <div class="quantity-controls">
                        <button class="decrement" data-isbn="${item.isbn}" ${item.quantity <= 1 ? 'disabled' : ''}
                            aria-label="Decrease quantity of ${item.title}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increment" data-isbn="${item.isbn}" ${item.quantity >= item.quantityInStock ? 'disabled' : ''}
                            aria-label="Increase quantity of ${item.title}">+</button>
                    </div>
                </div>
                <div class="item-price">${(item.price || 0).toLocaleString()} L</div>
                <button class="remove" data-isbn="${item.isbn}" aria-label="Remove ${item.title}">×</button>
            `;

            fragment.appendChild(itemElement);
        });

        cartItemsContainer.appendChild(fragment);
        attachEventListeners();
    }

    if (cartView) cartView.style.display = 'block';
    if (pageTitle) pageTitle.textContent = "Your Cart";
    updatePriceSummary();
}

function hidePriceSummaryAndCheckout() {
    const summaryElements = ['price-summary', 'shipping-price-summary', 'billing-price-summary', 'payment-price-summary'];
    summaryElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
            element.style.display = 'none';
        }
    });

    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.style.display = 'none';
    }
}

// Function to attach event listeners using event delegation
function attachEventListeners() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.addEventListener('click', (event) => {
        const button = event.target;
        const isbn = button.dataset.isbn;

        if (!isbn) return;

        let cart = JSON.parse(localStorage.getItem('Cart')) || [];
        let item = cart.find(item => item.isbn === isbn);

        if (!item) return;

        if (button.classList.contains('increment')) {
            if (item.quantity < item.quantityInStock) {
                item.quantity++;
                updateCart(cart);
            }
        } else if (button.classList.contains('decrement')) {
            if (item.quantity > 1) {
                item.quantity--;
                updateCart(cart);
            }
        } else if (button.classList.contains('remove')) {
            cart = cart.filter(cartItem => cartItem.isbn !== isbn);
            updateCart(cart);
        }
    });
}

function updateCart(cart) {
    localStorage.setItem('Cart', JSON.stringify(cart));
    renderCartItems();
}

function validateShippingForm() {
    const city = getValueById("state");
    const address = getValueById("address");

    // Basic validation: Ensure city and address are filled
    if (!city || !address) {
        alert("Please fill in all required fields.");
        return false;
    }

    // If everything is valid, return true
    return true;
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
    renderCartItems();

    const backButton = document.querySelector('.back');
    const closeButton = document.querySelector('.close');
    const deliveryButton = document.getElementById('delivery-button');
    const pickupButton = document.getElementById('pickup-button');
    const checkoutButton = document.getElementById('checkout-button');
    const billingButton = document.getElementById('billing-button');

    if (backButton) backButton.addEventListener('click', () => {
        if (currentView === 'shipping') {
            showView('cart');
        } else if (currentView === 'billing') {
            showView('shipping');
        } else {
            window.history.back();
        }
    });

    if (closeButton) closeButton.addEventListener('click', () => {
        if (confirm('Are you sure that you want to exit?')) {
            window.location.href = 'HTML/homepage_index.html';
        }
    });

    if (deliveryButton) deliveryButton.addEventListener('click', () => toggleShippingMethod('delivery'));
    if (pickupButton) pickupButton.addEventListener('click', () => toggleShippingMethod('pickup'));

    if (checkoutButton) checkoutButton.addEventListener('click', () => {
        showView('shipping');
    });

    if (billingButton) billingButton.addEventListener('click', () => {
        if (validateShippingForm()) { // Ensure this function is defined
            showView('billing');
        } else {
            alert('Please, fill all the required fields');
        }
    });

    // Show the initial view
    showView(currentView);
});