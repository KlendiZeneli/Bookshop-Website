let currentView = 'cart';

// View management OK
function showView(view) {
    const views = ['cart-view', 'shipping-view', 'billing-view'];
    const titles = {
        'cart-view': 'My cart',
        'shipping-view': 'Shipping address',
        'billing-view': 'Invoice',
        //'payment-view': 'Pay'
        //'order-confirmation-view':'Order confirmation'
    };

    views.forEach(v => {
        document.getElementById(v).style.display = v === `${view}-view` ? 'block' : 'none';
    });
   // if (currentView='billing-view'){
   //     fetchUserDetails();
   // }
    document.getElementById('page-title').textContent = titles[`${view}-view`];
    currentView = view;
}


// Shipping Cities and Price Summary
const albanianCities = [
    "Tirana", "Durrës", "Shkodër", "Vlorë", "Fier", "Korçë", "Berat",
    "Gjirokastër", "Elbasan", "Lushnjë", "Pogradec", "Kukës", "Lezhë",
    "Sarandë", "Kavajë", "Tepelenë", "Gramsh", "Përmet", "Bulqizë",
    "Peshkopi", "Krujë", "Himarë", "Ersekë", "Librazhd", "Divjakë",
    "Patos", "Cërrik", "Shijak"
];
const citySelect = document.getElementById("state");

albanianCities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
});

// Utility function for consistent currency formatting
function formatPrice(amount) {
    return `${amount.toLocaleString()} USD`;
}


function validateShippingForm() {
    if (shippingMethod === 'delivery') {
        const state = getValueById('state');
        const address = getValueById('address');
        if (!state || !address) {
            alert("Please fill out all required delivery fields.");
            return false;
        }
    } else {
        const store = getValueById('store');
        if (!store) {
            alert("Please select a store for pickup.");
            return false;
        }
    }
    return true;
}

function validateBillingForm2() {
    const fullName = document.getElementById('firstname');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');

    // Trim values to prevent spaces-only input
    const fullNameValue = fullName ? fullName.value.trim() : "";
    const emailValue = email ? email.value.trim() : "";
    const phoneValue = phone ? phone.value.trim() : "";

    if (!fullNameValue || !emailValue || !phoneValue) {
        alert("Please complete all required billing fields.");
        return false;
    }

    // Optional: Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
        alert("Please enter a valid email address.");
        return false;
    }

    return true;
}


function getValueById(id) {
    return document.getElementById(id).value.trim();
}


function validateBillingForm() {
    const required = ['firstname', 'phone', 'email'];
    for (const id of required) {
        const element = document.getElementById(id);
        if (element && element.value.trim() === '') {
            element.focus();
            alert(`Please fill in the ${id} field.`);
            return false;
        }
    }
    return true;
}

function getValueById(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
}

// Default shipping method is 'delivery'
let shippingMethod = 'delivery';

// Function to calculate shipping cost
function calculateShipping() {
    const city = getValueById("state");
    if (!city || !shippingCosts.hasOwnProperty(city)) {
        console.warn("No valid city selected, defaulting to default shipping cost.");
        return shippingCosts.default;
    }
    return shippingCosts[city];
}

// Function to calculate and update the price summary
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

// Function to toggle shipping method
function toggleShippingMethod(method) {
    shippingMethod = method;

    // Show or hide relevant fields based on shipping method
    document.getElementById('delivery-form').style.display = method === 'delivery' ? 'block' : 'none';
    document.getElementById('pickup-form').style.display = method === 'pickup' ? 'block' : 'none';

    document.getElementById('state').style.display = method === 'delivery' ? 'block' : 'none';
    document.getElementById('address').style.display = method === 'delivery' ? 'block' : 'none';

    document.getElementById('delivery-button').className = method === 'delivery' ? 'button-primary' : 'button-secondary';
    document.getElementById('pickup-button').className = method === 'pickup' ? 'button-primary' : 'button-secondary';

    updatePriceSummary();
}

// Ensure 'delivery' is the default option when the page loads
document.addEventListener("DOMContentLoaded", function() {
    toggleShippingMethod('delivery');
    updatePriceSummary();
});

// Update price summary when the city selection changes
document.getElementById("state").addEventListener("change", updatePriceSummary);

// Calculate shipping cost
const shippingCosts = {
    Tirana: 1,
    default: 2
};

function calculateShipping() {
    const city = getValueById("state");
    if (!city || !shippingCosts.hasOwnProperty(city)) {
        console.warn("No valid city selected, defaulting to default shipping cost.");
        return shippingCosts.default;
    }
    return shippingCosts[city];
}


function getValueById(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with ID "${id}" not found.`);
        return null;
    }
    return element.value.trim();
}

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
      document.getElementById('page-title').textContent = "Your cart is empty!";
      document.getElementById('cart-view').style.display = 'none';
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
        
    }

    if (pageTitle) pageTitle.textContent = "Your Cart";
    if (cartView) cartView.style.display = 'block';

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
    
    const summaryBox = document.querySelector('.summary-box');
    summaryBox.style.display = 'none';
    

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
attachEventListeners();

function updateCart(cart) {
    localStorage.setItem('Cart', JSON.stringify(cart));
    renderCartItems();
}

function validateShippingForm() {
    if (shippingMethod === 'delivery') {
        const stateField = document.getElementById('state');
        const addressField = document.getElementById('address');

        const state = stateField ? stateField.value.trim() : "";
        const address = addressField ? addressField.value.trim() : "";

        if (!state || !address) {
            alert("Please fill out all required delivery fields.");
            return false;
        }
    } else if (shippingMethod === 'pickup') {
        const storeField = document.getElementById('store');
        const store = storeField ? storeField.value.trim() : "";

        if (!store) {
            alert("Please select a store for pickup.");
            return false;
        }
    }
    
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
            window.location.href = '../HTML/homepage_index.html';

        }
    });

    if (deliveryButton) deliveryButton.addEventListener('click', () => toggleShippingMethod('delivery'));
    if (pickupButton) pickupButton.addEventListener('click', () => toggleShippingMethod('pickup'));

    if (checkoutButton) checkoutButton.addEventListener('click', () => {
        showView('shipping');
    });

    if (billingButton) billingButton.addEventListener('click', () => {
        if (validateShippingForm()) { 
            showView('billing');
        } else {
            alert('Please, fill all the required fields');
        }
    });

    // Show the initial view
    showView(currentView);
});


function getCartItems() {
    let cart = JSON.parse(localStorage.getItem('Cart')) || [];
    
    // Calculate total price

    return {
        items: cart.map(item => ({
            ISBN: item.isbn, 
            quantity: item.quantity,
            price: item.price*item.quantity
        })),
    };
}


function getOrderDetails() {
    const orderDetails = {
        name: document.getElementById('firstname')?.value.trim() || '',
        phone: document.getElementById('phone')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        shippingMethod: shippingMethod, // Use the global variable
        store: shippingMethod === 'pickup' ? document.getElementById('store')?.value.trim() || '' : '',
        city: shippingMethod === 'delivery' ? document.getElementById('state')?.value.trim() || '' : '',
        address: shippingMethod === 'delivery' ? document.getElementById('address')?.value.trim() || '' : '',
        specialComments: document.getElementById('notes')?.value.trim() || '',
        items: getCartItems() // Include cart items in the order
    };

    console.log("Order Details:", orderDetails); // Debugging log
    return orderDetails;
}


function getCartItems() {
    const cart = JSON.parse(localStorage.getItem('Cart')) || [];
    return cart.map(item => ({
        isbn: item.isbn || '',
        quantity: item.quantity || 1,
        price: item.price || 0
    }));
}

function getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

function clearCart() {
    localStorage.removeItem('Cart'); // Clear cart in local storage
    renderCartItems(); // Refresh cart UI if applicable
    //document.getElementsByClassName('summary-box').style.display = 'none'; // Hide cart view


}

// Complete order
async function completeOrder() {
    const checkoutButton = document.getElementById('payment-button');
    
    // Disable button to prevent multiple clicks
    if (checkoutButton) checkoutButton.disabled = true;
    const orderDetails = getOrderDetails(); // Fetch order details including cart items

    try {
        const response = await fetch('https://localhost:7221/api/Order/complete', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderDetails)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to complete order');
        }

        const result = await response.json();
        console.log('Order completed:', result);
        alert('Order completed successfully!');

        // Clear cart after successful order
        clearCart();
        hideAllViews()
       // document.getElementById('invoice-modal').style.display = 'flex';


        // Redirect to homepage
        //window.location.href = '../HTML/homepage_index.html';

    } catch (error) {
        console.error('Error completing order:', error);
        alert(error.message);
    } finally {
        // Re-enable button if order fails
        if (checkoutButton) checkoutButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.getElementById('payment-button');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (validateBillingForm()) { // Call validation first
                completeOrder(); // Proceed only if billing validation passes
            } else {
                alert("Please complete all required billing fields before proceeding.");
            }
        });
    } else {
        console.error("Checkout button not found!");
    }
});

function hideAllViews() {
    const views = ['cart-view', 'shipping-view', 'billing-view'];

    views.forEach(viewId => {
        const view = document.getElementById(viewId);
        if (view) {
            view.style.display = 'none';
        }
    });

    console.log("All views hidden.");
}


function emptyCartCheck() {
    const cartItems = JSON.parse(localStorage.getItem('Cart')) || [];
    const pageTitle = document.getElementById('page-title');
    const cartView = document.getElementById('cart-view');
    const summaryBox = document.querySelector('.summary-box');
    const backButton = document.querySelector('.back'); // Select the back button

    if (cartItems.length === 0) {
        console.log("Cart is empty - Hiding views.");

        if (pageTitle) pageTitle.textContent = "Your cart is empty!";
        hideAllViews(); // Hides cart, shipping, and billing views
        hidePriceSummaryAndCheckout();

        if (summaryBox) summaryBox.style.display = 'none';

        // Disable the back button
        if (backButton) {
            backButton.disabled = true;
            backButton.classList.add('disabled');
        }

        return true; // Indicate that the cart is empty
    } else {
        console.log("Cart has items - Showing cart view.");

        if (cartView) cartView.style.display = 'block';
        if (summaryBox) summaryBox.style.display = 'block';

        // Enable the back button when cart is not empty
        if (backButton) {
            backButton.disabled = false;
            backButton.classList.remove('disabled');
        }
    }

    return false; // Indicate that the cart is not empty
}

document.addEventListener("DOMContentLoaded", () => {
    renderCartItems();
    emptyCartCheck(); // Ensure UI updates on load
});

//function fetchUserDetails() {
//    const userDetails = JSON.parse(localStorage.getItem('UserDetails')) || {};
//    const fullName = document.getElementById('firstname');
//    const email = document.getElementById('email');
//    const phone = document.getElementById('phone');

 //   if (fullName) fullName.value = userDetails.fullName || '';
 //   if (email) email.value = userDetails.email || '';
  //  if (phone) phone.value = userDetails.phone || '';
//}