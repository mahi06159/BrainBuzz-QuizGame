// Quiz Data
const quizData = {
    general: [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            answer: "Paris"
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: "Mars"
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            answer: "Leonardo da Vinci"
        }
    ],
    science: [
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            answer: "Au"
        },
        {
            question: "What is the hardest natural substance on Earth?",
            options: ["Iron", "Diamond", "Quartz", "Graphite"],
            answer: "Diamond"
        },
        {
            question: "What is the closest star to Earth?",
            options: ["Proxima Centauri", "Alpha Centauri", "The Sun", "Polaris"],
            answer: "The Sun"
        }
    ],
    history: [
        {
            question: "In which year did World War II end?",
            options: ["1943", "1945", "1947", "1950"],
            answer: "1945"
        },
        {
            question: "Who was the first president of the United States?",
            options: ["Thomas Jefferson", "John Adams", "George Washington", "Abraham Lincoln"],
            answer: "George Washington"
        },
        {
            question: "The Renaissance began in which country?",
            options: ["France", "Germany", "Italy", "England"],
            answer: "Italy"
        }
    ],
    geography: [
        {
            question: "Which is the longest river in the world?",
            options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
            answer: "Nile"
        },
        {
            question: "Which country has the most natural lakes?",
            options: ["Canada", "Russia", "USA", "Finland"],
            answer: "Canada"
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            answer: "Pacific"
        }
    ]
};

// Quiz State
let currentState = {
    selectedCategory: null,
    currentQuestionIndex: 0,
    score: 0,
    timer: null,
    timeLeft: 30,
    userAnswers: [],
    questions: []
};

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const categoryCards = document.querySelectorAll('.category-card');
const startQuizBtn = document.getElementById('start-quiz');
const questionNumber = document.getElementById('question-number');
const totalQuestions = document.getElementById('total-questions');
const currentScore = document.getElementById('current-score');
const timeLeft = document.getElementById('time-left');
const questionCategory = document.getElementById('question-category');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const submitAnswerBtn = document.getElementById('submit-answer');
const restartQuizBtn = document.getElementById('restart-quiz');
const finalScore = document.getElementById('final-score');
const correctCount = document.getElementById('correct-count');
const totalQuestionsSummary = document.getElementById('total-questions-summary');
const correctAnswers = document.getElementById('correct-answers');
const incorrectAnswers = document.getElementById('incorrect-answers');
const summaryView = document.getElementById('summary-view');
const reviewView = document.getElementById('review-view');
const summaryTab = document.getElementById('summary-tab');
const reviewTab = document.getElementById('review-tab');
const reviewAnswersContainer = document.getElementById('review-answers-container');
const playAgainBtn = document.getElementById('play-again');
const shareResultsBtn = document.getElementById('share-results');

// Event Listeners
categoryCards.forEach(card => {
    card.addEventListener('click', function() {
        // Remove active class from all cards
        categoryCards.forEach(c => c.style.borderColor = '#e0e0e0');
        // Add active class to selected card
        this.style.borderColor = '#3498db';
        currentState.selectedCategory = this.dataset.category;
    });
});

startQuizBtn.addEventListener('click', startQuiz);
submitAnswerBtn.addEventListener('click', submitAnswer);
restartQuizBtn.addEventListener('click', restartQuiz);
playAgainBtn.addEventListener('click', playAgain);
shareResultsBtn.addEventListener('click', shareResults);
summaryTab.addEventListener('click', showSummary);
reviewTab.addEventListener('click', showReview);

// Functions
function startQuiz() {
    if (!currentState.selectedCategory) {
        alert('Please select a category first!');
        return;
    }

    // Prepare questions based on selected category
    if (currentState.selectedCategory === 'all') {
        // Combine all questions from all categories
        currentState.questions = [];
        for (const category in quizData) {
            currentState.questions = currentState.questions.concat(quizData[category]);
        }
        // Shuffle the questions
        currentState.questions = shuffleArray(currentState.questions).slice(0, 10); // Limit to 10 questions
    } else {
        currentState.questions = [...quizData[currentState.selectedCategory]];
    }

    // Reset quiz state
    currentState.currentQuestionIndex = 0;
    currentState.score = 0;
    currentState.userAnswers = [];
    currentState.timeLeft = 30;

    // Update UI
    welcomeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    totalQuestions.textContent = currentState.questions.length;
    currentScore.textContent = currentState.score;
    
    // Start with first question
    loadQuestion();
}

function loadQuestion() {
    // Reset timer
    clearInterval(currentState.timer);
    currentState.timeLeft = 30;
    timeLeft.textContent = currentState.timeLeft;

    // Start timer
    currentState.timer = setInterval(() => {
        currentState.timeLeft--;
        timeLeft.textContent = currentState.timeLeft;
        
        if (currentState.timeLeft <= 0) {
            clearInterval(currentState.timer);
            submitAnswer(); // Auto-submit when time runs out
        }
    }, 1000);

    // Get current question
    const question = currentState.questions[currentState.currentQuestionIndex];
    
    // Update UI
    questionNumber.textContent = currentState.currentQuestionIndex + 1;
    questionText.textContent = question.question;
    
    // Determine category for display (only relevant for "all" category)
    let categoryDisplay = currentState.selectedCategory;
    if (currentState.selectedCategory === 'all') {
        for (const category in quizData) {
            if (quizData[category].some(q => q.question === question.question)) {
                categoryDisplay = category;
                break;
            }
        }
    }
    questionCategory.textContent = categoryDisplay;

    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Add new options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.dataset.optionIndex = index;
        
        optionElement.addEventListener('click', function() {
            // Remove selected class from all options
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Add selected class to clicked option
            this.classList.add('selected');
        });
        
        optionsContainer.appendChild(optionElement);
    });
}

function submitAnswer() {
    clearInterval(currentState.timer);
    
    const selectedOption = document.querySelector('.option.selected');
    
    if (!selectedOption) {
        alert('Please select an answer!');
        return;
    }
    
    const question = currentState.questions[currentState.currentQuestionIndex];
    const selectedAnswer = selectedOption.textContent;
    const isCorrect = selectedAnswer === question.answer;
    
    // Store user answer
    currentState.userAnswers.push({
        question: question.question,
        userAnswer: selectedAnswer,
        correctAnswer: question.answer,
        isCorrect: isCorrect,
        category: currentState.selectedCategory === 'all' ? 
            Object.keys(quizData).find(cat => 
                quizData[cat].some(q => q.question === question.question)
            ) : currentState.selectedCategory
    });
    
    // Update score if correct
    if (isCorrect) {
        currentState.score++;
        currentScore.textContent = currentState.score;
    }
    
    // Move to next question or show results
    currentState.currentQuestionIndex++;
    
    if (currentState.currentQuestionIndex < currentState.questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    // Calculate score percentage
    const percentage = Math.round((currentState.score / currentState.questions.length) * 100);
    
    // Update results UI
    finalScore.textContent = `${percentage}%`;
    correctCount.textContent = currentState.score;
    totalQuestionsSummary.textContent = currentState.questions.length;
    correctAnswers.textContent = currentState.score;
    incorrectAnswers.textContent = currentState.questions.length - currentState.score;
    
    // Prepare review answers
    prepareReviewAnswers();
}

function prepareReviewAnswers() {
    reviewAnswersContainer.innerHTML = '';
    
    currentState.userAnswers.forEach((answer, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');
        
        reviewItem.innerHTML = `
            <div class="review-question">${index + 1}. ${answer.question}</div>
            <div class="review-answer user-answer">Your answer: ${answer.userAnswer}</div>
            ${!answer.isCorrect ? `<div class="review-answer correct-answer">Correct answer: ${answer.correctAnswer}</div>` : ''}
        `;
        
        reviewAnswersContainer.appendChild(reviewItem);
    });
}

function restartQuiz() {
    // Reset to first question
    currentState.currentQuestionIndex = 0;
    currentState.score = 0;
    currentState.userAnswers = [];
    currentScore.textContent = currentState.score;
    
    // Reload first question
    loadQuestion();
}

function playAgain() {
    resultsScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
}

function shareResults() {
    const percentage = Math.round((currentState.score / currentState.questions.length) * 100);
    const shareText = `I scored ${percentage}% on the ${currentState.selectedCategory} quiz! Can you beat my score?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Quiz Results',
            text: shareText,
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(shareText) {
    // Copy to clipboard as fallback
    navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!');
    }).catch(err => {
        console.log('Could not copy text:', err);
        prompt('Copy this text to share:', shareText);
    });
}

function showSummary() {
    reviewView.classList.add('hidden');
    summaryView.classList.remove('hidden');
    summaryTab.style.borderBottom = '2px solid #3498db';
    reviewTab.style.borderBottom = '1px solid #ddd';
}

function showReview() {
    summaryView.classList.add('hidden');
    reviewView.classList.remove('hidden');
    reviewTab.style.borderBottom = '2px solid #3498db';
    summaryTab.style.borderBottom = '1px solid #ddd';
}

// Utility function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
