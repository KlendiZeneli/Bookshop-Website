let currentAction = null; // 'add', 'edit', or 'delete'
let currentISBN = '';

// Element references
const forms = {
    bookForm: document.getElementById('bookForm'),
    isbnForm: document.getElementById('isbnForm'),
    deleteConfirmation: document.getElementById('deleteConfirmation'),
    bookDetails: document.getElementById('bookDetails')
};

// Form control functions
window.showForm = (action) => {
    currentAction = action;
    hideAllForms();
    
    switch(action) {
        case 'add':
            showAddForm();
            break;
        case 'edit':
        case 'delete':
            showISBNForm();
            break;
    }
};

window.hideForms = () => {
    hideAllForms();
    resetForms();
};

// Form submissions
document.getElementById('bookFormData')?.addEventListener('submit', handleBookSubmit);
document.getElementById('isbnInputForm')?.addEventListener('submit', handleISBNSubmit);
document.getElementById('deleteConfirmation')?.addEventListener('click', confirmDelete);

async function handleBookSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const bookData = Object.fromEntries(formData.entries());

    // Convert the date format
    if (bookData.PublishingDate) {
        bookData.PublishingDate = new Date(bookData.PublishingDate).toISOString(); 
    }

    console.log("Sending book data:", bookData);  // Debugging: Check the data before sending

    try {
        let url;
        let method;

        if (currentAction === 'add') {
            url = 'http://localhost:5190/api/BookFilters/add';
            method = 'POST';
        } else if (currentAction === 'edit') {
            url = `http://localhost:5190/api/BookFilters/edit/${currentISBN}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        });

        handleResponse(response, 'Book operation successful');
    } catch (error) {
        handleError(error, 'book operation');
    }
}

async function handleISBNSubmit(e) {
    e.preventDefault();
    currentISBN = document.getElementById('isbnInput').value; // Capture ISBN from input form

    try {
        const url = `http://localhost:5190/api/BookFilters/get-book?ISBN=${currentISBN}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Book not found');

        const book = await response.json();
        currentAction === 'edit' ? showEditForm(book) : showDeleteConfirmation(book);

        // Ensure the correct ISBN is being passed to the delete confirmation
        if (currentAction === 'delete') {
            showDeleteConfirmation(book);
        }
    } catch (error) {
        handleError(error, 'fetch book');
    }
}

function showDeleteConfirmation(book) {
    forms.deleteConfirmation.classList.add('active-form');
    forms.bookDetails.textContent = `Confirm deletion of: ${book.title} (ISBN: ${book.ISBN})`; // Make sure to use book.ISBN here
    currentISBN = book.ISBN; // Set the ISBN of the book you're about to delete
}

async function confirmDelete() {
    try {
        const response = await fetch(`http://localhost:5190/api/BookFilters/delete/${currentISBN}`, {
            method: 'DELETE'
        });
        handleResponse(response, 'Book deleted successfully');
    } catch (error) {
        handleError(error, 'delete');
    }
}

// Helper functions
function showAddForm() {
    forms.bookForm.classList.add('active-form');
    document.getElementById('formTitle').textContent = 'Add New Book';
    resetBookForm();
}

function showEditForm(book) {
    forms.bookForm.classList.add('active-form');
    document.getElementById('formTitle').textContent = 'Edit Book';
    populateForm(book);
}

function showDeleteConfirmation(book) {
    forms.deleteConfirmation.classList.add('active-form');
    forms.bookDetails.textContent = `Confirm deletion of: ${book.title} (ISBN: ${book.ISBN})`;
}

function showISBNForm() {
    forms.isbnForm.classList.add('active-form');
}

function hideAllForms() {
    Object.values(forms).forEach(form => form?.classList?.remove('active-form'));
}

function resetForms() {
    resetBookForm();
    document.getElementById('isbnInput').value = '';
    currentISBN = '';
    currentAction = null;
}

function resetBookForm() {
    document.getElementById('bookFormData').reset();
    document.getElementById('bookId').value = '';
}

function populateForm(book) {
    // Map book properties to form fields
    const fields = [
        'ISBN', 'title', 'author', 'price', 'description',
        'language', 'noOfPages', 'coverURL', 'genre',
        'subGenre', 'publisher', 'publishingDate'
    ];

    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) element.value = book[field];
    });

    // Handle checkboxes
    ['newArrival', 'awardWinner', 'bestSeller'].forEach(checkbox => {
        document.getElementById(checkbox).checked = book[checkbox];
    });

    // Make sure ISBN is populated
    document.getElementById('ISBN').value = book.ISBN;
}

function handleResponse(response, successMessage) {
    if (response.ok) {
        alert(successMessage);
        hideForms();
        // Optional: Refresh book list if you have one
    } else {
        response.text().then(text => alert(`Error: ${text}`));
    }
}

function handleError(error, context) {
    console.error(`${context} error:`, error);
    alert(`Error during ${context}: ${error.message}`);
}
