let timeLeft = 15 * 60;  // 15 minutes in seconds

const timerElement = document.getElementById('time-left');
const timer = setInterval(updateTimer, 1000); // Update the timer every second

function updateTimer() {
    // Calculate minutes and seconds
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    // Display the time in minutes:seconds format
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Decrease the time by 1 second
    timeLeft--;

    // Stop the timer when time is up
    if (timeLeft < 0) {
        clearInterval(timer);
        alert('Time is up! Submit your answers now.');
        document.getElementById('quiz-form').submit(); // Submit the quiz form automatically
    }
}

function calculateResult() {
    const form = document.getElementById('quiz-form');
    const questions = form.querySelectorAll('.question');
    let correctAnswers = 0;

    // Loop through each question to check answers
    questions.forEach((question, index) => {
        const selectedAnswer = question.querySelector('input[type="radio"]:checked');
        if (selectedAnswer && selectedAnswer.value === 'correct') {
            correctAnswers++;
        }
    });

    // Calculate score
    const totalQuestions = questions.length;
    const score = (correctAnswers / totalQuestions) * 100;

    // Check if the user passed
    const resultMessage = score >= 60 ? 'You Passed!' : 'You Failed!';
    
    return { score, resultMessage };
}

// Function to handle form submission
function submitQuiz(event) {
    event.preventDefault(); // Prevent form submission
    
    const { score, resultMessage } = calculateResult();
    alert(`${resultMessage}\nYour score: ${score}%`);

    // Redirect to homepage after alert is closed
    window.location.href = 'homepage_index.html';
}

// Event listener for form submission
document.getElementById('quiz-form').addEventListener('submit', submitQuiz);

updateTimer();