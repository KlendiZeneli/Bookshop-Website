document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch the admin HTML content from the API
    function fetchAdminPage() {
        fetch('https://localhost:7221/api/Html/adminPage', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') // Attach JWT token from local storage
            }
        })
        .then(response => {
            console.log(response); // Log the response for debugging
            if (!response.ok) {
                throw new Error("Failed to load admin page.");
            }
            return response.text();  // Return the HTML content as text
        })
        .then(html => {
            document.getElementById('admin-container').innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching admin page:', error);
        });
    }
    
    
    

    // Fetch the admin page content once the DOM is fully loaded
    fetchAdminPage();
});
