document.addEventListener('DOMContentLoaded', function() {
    let quiz = [
        {
            questionId: 1,
            questionText: "Who is the author of the Harry Potter series?",
            answers: [
                { id: 1, answer: "J.K. Rowling", isCorrect: true },
                { id: 2, answer: "J.R.R. Tolkien", isCorrect: false },
                { id: 3, answer: "Suzanne Collins", isCorrect: false }
            ]
        },
        {
            questionId: 2,
            questionText: "What is the name of Harry Potter's owl?",
            answers: [
                { id: 1, answer: "Hedwig", isCorrect: true },
                { id: 2, answer: "Scabbers", isCorrect: false },
                { id: 3, answer: "Crookshanks", isCorrect: false }
            ]
        },
        {
            questionId: 3,
            questionText: "Which house at Hogwarts does Harry belong to?",
            answers: [
                { id: 1, answer: "Gryffindor", isCorrect: true },
                { id: 2, answer: "Ravenclaw", isCorrect: false },
                { id: 3, answer: "Slytherin", isCorrect: false }
            ]
        },
        {
            questionId: 4,
            questionText: "What is the name of the train that takes students to Hogwarts?",
            answers: [
                { id: 1, answer: "Hogwarts Express", isCorrect: true },
                { id: 2, answer: "Knight Bus", isCorrect: false },
                { id: 3, answer: "Magic Liner", isCorrect: false }
            ]
        },
        {
            questionId: 5,
            questionText: "Who is Harry Potter’s godfather?",
            answers: [
                { id: 1, answer: "Sirius Black", isCorrect: true },
                { id: 2, answer: "Remus Lupin", isCorrect: false },
                { id: 3, answer: "Severus Snape", isCorrect: false }
            ]
        },
        {
            questionId: 6,
            questionText: "What position does Harry play on the Quidditch team?",
            answers: [
                { id: 1, answer: "Seeker", isCorrect: true },
                { id: 2, answer: "Keeper", isCorrect: false },
                { id: 3, answer: "Beater", isCorrect: false }
            ]
        },
        {
            questionId: 7,
            questionText: "What is the symbol of Slytherin House?",
            answers: [
                { id: 1, answer: "Snake", isCorrect: true },
                { id: 2, answer: "Lion", isCorrect: false },
                { id: 3, answer: "Badger", isCorrect: false }
            ]
        },
        {
            questionId: 8,
            questionText: "What is Voldemort’s real name?",
            answers: [
                { id: 1, answer: "Tom Marvolo Riddle", isCorrect: true },
                { id: 2, answer: "Lucius Malfoy", isCorrect: false },
                { id: 3, answer: "Severus Snape", isCorrect: false }
            ]
        },
        {
            questionId: 9,
            questionText: "Who is the Half-Blood Prince?",
            answers: [
                { id: 1, answer: "Severus Snape", isCorrect: true },
                { id: 2, answer: "Draco Malfoy", isCorrect: false },
                { id: 3, answer: "Harry Potter", isCorrect: false }
            ]
        },
        {
            questionId: 10,
            questionText: "What spell is used to disarm an opponent?",
            answers: [
                { id: 1, answer: "Expelliarmus", isCorrect: true },
                { id: 2, answer: "Lumos", isCorrect: false },
                { id: 3, answer: "Stupefy", isCorrect: false }
            ]
        }
    ];

    const form = document.getElementById("quiz-form");
    const submitButton = document.getElementById("submit-btn");
    const timerDisplay = document.getElementById("time-left");
    const backButton = document.getElementById("back-btn");
    
    let timer = 15 * 60; // 15 minutes in seconds
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

    // Function to create quiz dynamically
    quiz.forEach((q) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");

        const questionText = document.createElement("p");
        questionText.textContent = `${q.questionId}. ${q.questionText}`;
        questionDiv.appendChild(questionText);

        q.answers.forEach((answer) => {
            const label = document.createElement("label");

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `question-${q.questionId}`;
            input.value = answer.isCorrect;

            label.appendChild(input);
            label.appendChild(document.createTextNode(answer.answer));
            questionDiv.appendChild(label);
            questionDiv.appendChild(document.createElement("br"));
        });

        form.appendChild(questionDiv);
    });

    // Function to calculate results
    function calculateResults() {
        let correctAnswers = 0;
        let totalQuestions = quiz.length;

        quiz.forEach((q) => {
            const selectedAnswer = document.querySelector(`input[name="question-${q.questionId}"]:checked`);
            if (selectedAnswer && JSON.parse(selectedAnswer.value)) {
                correctAnswers++;
            }
        });


        const score = (correctAnswers / totalQuestions) * 100;
        if (score >= 70) {
            alert(`You passed the quiz! Your score: ${score}%`);
        } else {
            alert(`You failed the quiz. Your score: ${score}%`);
        }

        window.location.href = "homepage_index.html"; // Redirect to the homepage after alert
    }

    // Event listener for the submit button
    submitButton.addEventListener("click", function(event) {
        event.preventDefault();
        clearInterval(timerInterval); // Stop the timer
        calculateResults(); // Calculate results when the user submits
    });

    backButton.addEventListener("click", function(event) {
        event.preventDefault();
        clearInterval(timerInterval);
        window.location.href="funcorner.html";
    });

    // Start the timer when the page loads
    startTimer();


});
