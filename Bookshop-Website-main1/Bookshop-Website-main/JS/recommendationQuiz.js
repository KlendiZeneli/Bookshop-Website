document.addEventListener('DOMContentLoaded', function() {
    let quiz = [
        {
            questionId: 1,
            questionText: "How do you prefer spending your weekends?",
            answers: [
                { id: 1, answer: "Exploring new hobbies", value: 1 },
                { id: 2, answer: "Relaxing at home", value: 2 },
                { id: 3, answer: "Socializing with friends", value: 3 },
                { id: 4, answer: "Going on an adventure or traveling", value: 4 }
            ]
        },
        {
            questionId: 2,
            questionText: "What kind of movies do you typically enjoy?",
            answers: [
                { id: 1, answer: "Drama or introspective films", value: 1 },
                { id: 2, answer: "Comedy or light-hearted films", value: 2 },
                { id: 3, answer: "Action or thrillers", value: 3 },
                { id: 4, answer: "Fantasy or science fiction", value: 4 }
            ]
        },
        {
            questionId: 3,
            questionText: "How do you prefer to work?",
            answers: [
                { id: 1, answer: "Independently with minimal interruptions", value: 1 },
                { id: 2, answer: "With a collaborative team environment", value: 2 },
                { id: 3, answer: "Under pressure with tight deadlines", value: 4 },
                { id: 4, answer: "Creatively, with lots of freedom and flexibility", value: 3 }
            ]
        },
        {
            questionId: 4,
            questionText: "When you have free time, what do you enjoy doing most?",
            answers: [
                { id: 1, answer: "Reading or writing", value: 4 },
                { id: 2, answer: "Watching TV or movies", value: 2 },
                { id: 3, answer: "Trying new activities or hobbies", value: 3 },
                { id: 4, answer: "Traveling or exploring new places", value: 1 }
            ]
        },
        {
            questionId: 5,
            questionText: "How do you react to stressful situations?",
            answers: [
                { id: 1, answer: "I stay calm and analyze the situation", value: 4 },
                { id: 2, answer: "I try to stay positive and laugh it off", value: 2 },
                { id: 3, answer: "I tend to act quickly and decisively", value: 3 },
                { id: 4, answer: "I look for ways to escape or distract myself", value: 1 }
            ]
        },
        {
            questionId: 6,
            questionText: "What is your preferred style of learning?",
            answers: [
                { id: 1, answer: "Reading books or articles", value: 4 },
                { id: 2, answer: "Watching videos or listening to podcasts", value: 2 },
                { id: 3, answer: "Hands-on, through trial and error", value: 3 },
                { id: 4, answer: "Discussing ideas with others", value: 1 }
            ]
        },
        {
            questionId: 7,
            questionText: "Which of these would you prefer as a gift?",
            answers: [
                { id: 1, answer: "A thoughtful, personalized item", value: 4 },
                { id: 2, answer: "Something fun or humorous", value: 2 },
                { id: 3, answer: "A gadget or tech device", value: 3 },
                { id: 4, answer: "A book or something intellectually stimulating", value: 1 }
            ]
        },
        {
            questionId: 8,
            questionText: "What type of environment do you thrive in?",
            answers: [
                { id: 1, answer: "Quiet, organized, and structured", value: 1 },
                { id: 2, answer: "Fun, spontaneous, and energetic", value: 2 },
                { id: 3, answer: "Fast-paced, with a sense of urgency", value: 4 },
                { id: 4, answer: "Creative, with freedom to explore", value: 3 }
            ]
        },
        {
            questionId: 9,
            questionText: "Which of the following describes your ideal social gathering?",
            answers: [
                { id: 1, answer: "Small, intimate gatherings with close friends", value: 1 },
                { id: 2, answer: "Casual get-togethers with a large group", value: 2 },
                { id: 3, answer: "A lively party with lots of people", value: 4 },
                { id: 4, answer: "A quiet evening with deep conversations", value: 3 }
            ]
        },
        {
            questionId: 10,
            questionText: "How do you usually make decisions?",
            answers: [
                { id: 1, answer: "I analyze the pros and cons carefully", value: 4 },
                { id: 2, answer: "I go with my gut instinct", value: 3 },
                { id: 3, answer: "I consult with others for advice", value: 2 },
                { id: 4, answer: "I rely on past experiences and patterns", value: 1 }
            ]
        }
    ];
    
    // Function to create quiz dynamically
    quiz.forEach((q) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");

        const questionText = document.createElement("p");
        questionText.textContent = `${q.questionId}. ${q.questionText}`;
        questionDiv.appendChild(questionText);

        // Order answers by value
        q.answers.sort((a, b) => a.value - b.value);

        q.answers.forEach((answer) => {
            const label = document.createElement("label");

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `question-${q.questionId}`;
            input.value = answer.value;

            label.appendChild(input);
            label.appendChild(document.createTextNode(answer.answer + " (Value: " + answer.value + ")"));
            questionDiv.appendChild(label);
            questionDiv.appendChild(document.createElement("br"));
        });

        // Append the question to the form
        document.getElementById("quiz-form").appendChild(questionDiv);
    });

    const timerDisplay = document.getElementById("time-left");

    let timer = 10 * 60; // 15 minutes in seconds
    let timerInterval;

    // Function to start the timer
    function startTimer() {
        timerInterval = setInterval(function() {
            let minutes = Math.floor(timer / 60);
            let seconds = timer % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            timerDisplay.textContent = `${minutes}:${seconds}`;

            if (timer <= 0) {
                clearInterval(timerInterval);
                calculateResults();
            }
            timer--;
        }, 1000);
    }

    // Function to calculate results and show all possible results in modal
    function calculateResults() {
        let totalScore = 0;

        quiz.forEach((q) => {
            const selectedAnswer = document.querySelector(`input[name="question-${q.questionId}"]:checked`);
            if (selectedAnswer) {
                totalScore += parseInt(selectedAnswer.value);
            }
        });

        // Possible results based on score ranges
        const results = [
            { min: 15, max: 24, genre: "Mystery/Thriller", description: "You enjoy problem-solving and thrill! A gripping mystery or thrilling crime novel will keep you on the edge of your seat." },
            { min: 25, max: 34, genre: "Romance", description: "You have a soft spot for relationships and human connection. A heartwarming romance novel is the perfect choice for you." },
            { min: 35, max: 44, genre: "Action/Adventure or Sci-Fi", description: "You crave excitement and new worlds. Dive into a high-stakes action-packed story or a mind-bending science fiction novel that takes you to distant galaxies or extraordinary futuristic realms." },
            { min: 45, max: 60, genre: "Non-fiction/Inspirational", description: "You love to learn and grow. A motivational or non-fiction book that challenges your intellect will inspire and empower you." }
        ];

        // Find the genre recommendation based on score
        let genreRecommendation = results.find(result => totalScore >= result.min && totalScore <= result.max);

        const modal = document.createElement("div");
        modal.classList.add("modal");

        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");

        const modalHeader = document.createElement("div");
        modalHeader.classList.add("modal-header");
        modalHeader.textContent = "Your Result";
        modalContent.appendChild(modalHeader);

        const modalBody = document.createElement("div");
        modalBody.classList.add("modal-body");
        modalBody.innerHTML = `
            <p>Your score: ${totalScore}</p>
            <p>${genreRecommendation ? genreRecommendation.genre + " – " + genreRecommendation.description : "No recommendation available."}</p>
        `;

        // Add all results and point ranges to the modal
        const resultsList = document.createElement("div");
        resultsList.innerHTML = "<h3>All Possible Results:</h3>"; // Header for all results
        results.forEach(result => {
            const resultItem = document.createElement("p");
            resultItem.innerHTML = `${result.genre}: ${result.min} to ${result.max} points. ${result.description}`;
            resultsList.appendChild(resultItem);
        });
        modalBody.appendChild(resultsList);

        modalContent.appendChild(modalBody);

        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.classList.add("modal-close-btn");
        closeButton.onclick = function() {
            modal.style.display = "none";
            window.location.href = "funcorner.html"; // Redirect to a different page
        };
        modalContent.appendChild(closeButton);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        modal.style.display = "block"; // Show the modal
    }

    // Submit button functionality
    const submitButton = document.getElementById("submit-btn"); // Assuming the submit button has this ID

    submitButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent form submission
        calculateResults(); // Show the results in a modal
    });

    const backButton = document.getElementById("back-btn");

    backButton.addEventListener("click", function(event) {
        event.preventDefault();
        clearInterval(timerInterval);
        window.location.href = "funcorner.html";
    });

    startTimer();
});