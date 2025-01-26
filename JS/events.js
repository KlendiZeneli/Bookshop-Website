const detailButtons = document.querySelectorAll('.details-btn');

detailButtons.forEach(button => {
    button.addEventListener('click', () => {
        const title = button.getAttribute('data-title');
        const description = button.getAttribute('data-description');
        const image = button.getAttribute('data-image');

        const newWindow = window.open('', '_blank', 'width=800,height=600');
        newWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                            text-align: center;
                            background-color: #f4f4f9;
                        }
                        img {
                            max-width: 100%;
                            height: auto;
                            margin: 20px 0;
                        }
                        h1 {
                            color: #333;
                        }
                        p {
                            font-size: 16px;
                            color: #555;
                        }
                        form {
                            display: flex;
                            flex-direction: column;
                            margin-top: 20px;
                        }
                        form label {
                            margin-bottom: 5px;
                            font-weight: bold;
                        }
                        form input {
                            padding: 10px;
                            margin-bottom: 15px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                        }
                        form button {
                            background-color: #28a745;
                            color: white;
                            border: none;
                            padding: 10px;
                            cursor: pointer;
                            border-radius: 5px;
                        }
                        form button:hover {
                            background-color: #218838;
                        }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <img src="${image}" alt="${title}">
                    <p>${description}</p>
                    <form id="registrationForm">
                        <label for="name">Name:</label>
                        <input type="text" id="name" required>
                        <label for="surname">Surname:</label>
                        <input type="text" id="surname" required>
                        <label for="phone">Phone Number:</label>
                        <input type="tel" id="phone" required>
                        <label for="email">Email:</label>
                        <input type="email" id="email" required>
                        <button type="button" id="registerButton">Register</button>
                    </form>
                    <script>
                        const registerButton = document.getElementById('registerButton');
                        registerButton.addEventListener('click', () => {
                            const name = document.getElementById('name').value;
                            const surname = document.getElementById('surname').value;
                            const phone = document.getElementById('phone').value;
                            const email = document.getElementById('email').value;

                            if (name && surname && phone && email) {
                                alert('Thank you for registering, ' + name + ' ' + surname + '! Your details have been submitted.');
                            } else {
                                alert('Please fill out all fields before registering.');
                            }
                        });
                    </script>
                </body>
            </html>
        `);
        newWindow.document.close();
    });
});

