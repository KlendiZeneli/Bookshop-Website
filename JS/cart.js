// per te populluar dropdown te city selection
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


let cartItems = [
    {
        id: '1',
        title: 'IRON FLAME (FLAKA E HEKURT) PJESA I',
        author: 'BOTA SHQIPTARE',
        price: 18000,
        quantity: 1,
        image: '/placeholder.svg'
    },
    {
        id: '2',
        title: 'YOU ARE AN ARTIST',
        author: 'DORLING KINDERSLEY',
        price: 1290,
        quantity: 1,
        image: '/placeholder.svg'
    }
];

let currentView = 'cart';
let shippingMethod = 'delivery'; // 'delivery' or 'pickup'

// View management
function showView(view) {
    const views = ['cart-view', 'shipping-view', 'billing-view', 'payment-view'];
    const titles = {
        'cart-view': 'My cart',
        'shipping-view': 'Shipping address',
        'billing-view': 'Invoice',
        'payment-view': 'Pay'
    };

    views.forEach(v => {
        document.getElementById(v).style.display = v === `${view}-view` ? 'block' : 'none';
    });
    
    document.getElementById('page-title').textContent = titles[`${view}-view`];
    currentView = view;
}

// Cart functionality
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="item-details">
                <div class="item-title">${item.title}</div>
                <div class="item-author">${item.author}</div>
                <div class="quantity-controls">
                    <button class="update-quantity" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="update-quantity" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div class="item-price">${item.price.toLocaleString()} L</div>
            <button class="remove-button" onclick="removeItem('${item.id}')">×</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    updatePriceSummary();
}

//to do: nese karta mbetet bosh, pra behet remove cdo produkt->redirect aty ku ishte




function updateQuantity(id, newQuantity) {
    if (newQuantity > 0) {
        const itemIndex = cartItems.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            cartItems[itemIndex].quantity = newQuantity;
            renderCartItems();
        }
    }
}

function removeItem(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    renderCartItems();
}

// Price summary
function updatePriceSummary() {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = shippingMethod === 'pickup' ? 0 : calculateShipping();
    const total
= subtotal + shipping;

    const summaryHTML = `
        <div class="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()} ALL</span>
        </div>
        <div class="summary-row">
            <span>Transport cost</span>
            <span>${shipping === 0 ? 'Free' : shipping.toLocaleString() + ' ALL'}</span>
        </div>
        <div class="summary-row">
            <span>Totali</span>
            <span>${total.toLocaleString()} ALL</span>
        </div>
    `;

    ['price-summary', 'shipping-price-summary', 'billing-price-summary'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.innerHTML = summaryHTML;
    });
}

function calculateShipping() {
    const city = document.getElementById("state").value;

    if (shippingMethod === 'pickup') {
        return 0; 
    } else if (city === 'Tirana') {
        return 100;
    } else {
        return 250; 
    }
}


// Shipping method selection
function toggleShippingMethod(method) {
    shippingMethod = method;
    document.getElementById('delivery-form').style.display = method === 'delivery' ? 'block' : 'none';
    document.getElementById('pickup-form').style.display = method === 'pickup' ? 'block' : 'none';
    
    document.getElementById('delivery-button').className = method === 'delivery' ? 'button-primary' : 'button-secondary';
    document.getElementById('pickup-button').className = method === 'pickup' ? 'button-primary' : 'button-secondary';
    
    updatePriceSummary();
}

function validateShippingForm() {
    if (shippingMethod === 'delivery') {
        const state = document.getElementById('state').value;
        const address = document.getElementById('address').value;
        return state && address;
    } else {
        const store = document.getElementById('store').value;
        return store;
    }
}

function validateBillingForm() {
    const required = ['firstname', 'phone'];
    return required.every(id => document.getElementById(id).value.trim() !== '');
}


document.addEventListener("DOMContentLoaded", () => {
    // Set default 
    shippingMethod = 'pickup';
    document.getElementById("state").addEventListener("change", updatePriceSummary);
    document.querySelectorAll('input[name="shipping-method"]').forEach(input => {
        input.addEventListener("change", () => {
            shippingMethod = document.querySelector('input[name="shipping-method"]:checked').value;
            updatePriceSummary();
        });
    });
    updatePriceSummary();
});


// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();

    document.querySelector('.back').addEventListener('click', () => {
        if (currentView === 'shipping') {
            showView('cart');
        } else if (currentView === 'billing') {
            showView('shipping');
        } else {
            window.history.back();
        }
    });

    document.querySelector('.close').addEventListener('click', () => {
        if (confirm('Jeni të sigurt që doni të mbyllni?')) {
            window.location.href = '/';
        }
    });

    document.getElementById('delivery-button').addEventListener('click', () => toggleShippingMethod('delivery'));
    document.getElementById('pickup-button').addEventListener('click', () => toggleShippingMethod('pickup'));

    document.getElementById('checkout-button').addEventListener('click', () => showView('shipping'));
    
    document.getElementById('billing-button').addEventListener('click', () => {
        if (validateShippingForm()) {
            showView('billing');
        } else {
            alert('Please, fill all the required fields');
        }
    });

    document.getElementById('payment-button').addEventListener('click', () => {
        if (validateBillingForm()) {
            showView('payment');
        } else {
            alert('Please, fill all the required fields');
        }
    });
});

//to do: shto funksionet per payment view
