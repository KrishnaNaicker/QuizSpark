// --- DOM Elements ---
const htmlEl = document.documentElement;
const topicButtonsContainer = document.getElementById('topic-buttons-container');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const loadingMessage = document.getElementById('loading-message');
const progressText = document.getElementById('progress-text');
const difficultyIndicator = document.getElementById('difficulty-indicator');
const questionCard = document.getElementById('question-card');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackQuestionTextEl = document.getElementById('feedback-text-question');
const resultsTitle = document.querySelector('#results-screen .results-title');
const scoreValueEl = document.getElementById('score-value');
const feedbackEmojiEl = document.getElementById('feedback-emoji');
const feedbackTextMessageEl = document.getElementById('feedback-text-message');
const playAgainBtn = document.getElementById('play-again-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const copyrightYearEl = document.getElementById('copyright-year');
const logoLink = document.querySelector('.nav-logo-link');

// --- State Variables ---
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
const TOTAL_QUESTIONS_PER_QUIZ = 10;
let currentDifficulty = 'medium';
const difficultyLevels = ['easy', 'medium', 'hard'];
let currentTheme = localStorage.getItem('theme') || 'dark-theme';

// --- Static Data ---
let topics = [
    { value: '9', name: 'General Knowledge', otdbCategory: 9 }, { value: '10', name: 'Books', otdbCategory: 10 },
    { value: '11', name: 'Film (Movies)', otdbCategory: 11 }, { value: '12', name: 'Music', otdbCategory: 12 },
    { value: '13', name: 'Musicals & Theatres', otdbCategory: 13 }, { value: '14', name: 'Television', otdbCategory: 14 },
    { value: '15', name: 'Video Games', otdbCategory: 15 }, { value: '16', name: 'Board Games', otdbCategory: 16 },
    { value: '17', name: 'Science & Nature', otdbCategory: 17 }, { value: '18', name: 'Computers (Technology)', otdbCategory: 18 },
    { value: '19', name: 'Mathematics', otdbCategory: 19 }, { value: '20', name: 'Mythology', otdbCategory: 20 },
    { value: '21', name: 'Sports', otdbCategory: 21 }, { value: '22', name: 'Geography', otdbCategory: 22 },
    { value: '23', name: 'History', otdbCategory: 23 }, { value: '24', name: 'Politics', otdbCategory: 24 },
    { value: '25', name: 'Art', otdbCategory: 25 }, { value: '26', name: 'Celebrities', otdbCategory: 26 },
    { value: '27', name: 'Animals', otdbCategory: 27 }, { value: '28', name: 'Vehicles', otdbCategory: 28 },
    { value: '29', name: 'Comics', otdbCategory: 29 }, { value: '30', name: 'Gadgets (Technology)', otdbCategory: 30 },
    { value: '31', name: 'Anime & Manga', otdbCategory: 31 }, { value: '32', name: 'Cartoon & Animations', otdbCategory: 32 }
];
topics.sort((a, b) => a.name.localeCompare(b.name));

const scoreFeedback = {
    high: [ { emoji: "🎉", message: "Outstanding! You're a quiz whiz! Keep up the brilliant work!" }, { emoji: "🌟", message: "Superb performance! Your knowledge is truly impressive today!" }, { emoji: "🏆", message: "Excellent score! You absolutely nailed it! What a star!" } ],
    medium: [ { emoji: "😊", message: "Great effort! You're doing well and learning more with each attempt!" }, { emoji: "💪", message: "Good job! That's a solid understanding. Keep practicing to soar!" }, { emoji: "👌", message: "Nice work! You're on the right track. Keep that curiosity alive!" } ],
    low: [ { emoji: "🌱", message: "Every expert was once a beginner! Keep learning, and you'll ace it next time!" }, { emoji: "🚀", message: "Good start! Learning is a journey. Don't give up, you're building knowledge!" }, { emoji: "👍", message: "You're taking on the challenge, and that's what truly matters! Keep going!" } ]
};

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', initialize);
playAgainBtn.addEventListener('click', resetAndShowStartScreen);
themeToggleBtn.addEventListener('click', toggleTheme);

if (logoLink) {
    logoLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor jump
        resetAndShowStartScreen();
    });
}

// --- Initialization ---
function initialize() {
    applyTheme(currentTheme);
    populateTopicButtons();
    setCopyrightYear();
    showScreen('start-screen'); // Show start screen initially without specific animation
}

function setCopyrightYear() {
    if (copyrightYearEl) copyrightYearEl.textContent = new Date().getFullYear();
}

function applyTheme(themeName) {
    htmlEl.className = '';
    htmlEl.classList.add(themeName);
    localStorage.setItem('theme', themeName);
    currentTheme = themeName;
    if (window.feather) feather.replace();
}

function toggleTheme() {
    const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    applyTheme(newTheme);
}

function populateTopicButtons() {
    if (!topicButtonsContainer) return;
    topicButtonsContainer.innerHTML = '';

    topics.forEach(topic => {
        const button = document.createElement('button');
        button.classList.add('topic-btn');
        button.textContent = topic.name;
        button.dataset.topicValue = topic.value;
        button.dataset.topicName = topic.name;

        button.addEventListener('click', () => {
            handleTopicSelection(topic.value, topic.name);
        });
        topicButtonsContainer.appendChild(button);
    });
}

function handleTopicSelection(topicValue, topicName) {
    startQuiz(topicValue, topicName);
}

function showScreen(screenId, applyQuizAnimation = false) {
    // Ensure previous screen is fully hidden
    document.querySelectorAll('.screen.active').forEach(s => {
        if (s.id !== screenId) s.classList.remove('active');
    });

    // Always remove animation class from quiz screen before showing any screen
    if (quizScreen) quizScreen.classList.remove('animate-fade-in');

    const activeScreen = document.getElementById(screenId);
    if (activeScreen) {
        if (applyQuizAnimation && screenId === 'quiz-screen') {
            activeScreen.classList.add('animate-fade-in');
        }
        activeScreen.classList.add('active');
    } else {
        console.error(`Screen with id ${screenId} not found.`);
    }
}

// Simplified transition - mainly for instant switches or when specific animation is handled by showScreen
function transitionToScreen(nextScreenId, isQuizStart = false) {
    const currentActiveScreen = document.querySelector('.screen.active');
    if (currentActiveScreen) {
        currentActiveScreen.classList.remove('active');
    }
    showScreen(nextScreenId, isQuizStart); // Pass flag if it's for quiz start
}

async function startQuiz(selectedTopicValue, topicName) {
    if (!selectedTopicValue) return;
    if (topicButtonsContainer) {
        topicButtonsContainer.querySelectorAll('.topic-btn').forEach(btn => btn.disabled = true);
    }
    
    loadingMessage.textContent = `Igniting questions for ${topicName}...`;
    loadingMessage.style.color = 'var(--color-text-secondary)';
    loadingMessage.style.display = 'block';
    currentQuestions = [];

    try {
        currentQuestions = await fetchQuestionsFromOpenTriviaDB(selectedTopicValue, currentDifficulty, TOTAL_QUESTIONS_PER_QUIZ);
        if (!currentQuestions || currentQuestions.length === 0) {
            throw new Error("No questions were available for this topic/difficulty.");
        }
    } catch (error) {
        loadingMessage.textContent = `Oops! ${error.message}. Try another topic?`;
        loadingMessage.style.color = 'var(--color-incorrect-text)';
    } finally {
        if (topicButtonsContainer) {
            topicButtonsContainer.querySelectorAll('.topic-btn').forEach(btn => btn.disabled = false);
        }
        if (currentQuestions && currentQuestions.length > 0) {
            loadingMessage.style.display = 'none';
        }
    }

    if (currentQuestions && currentQuestions.length > 0) {
        currentQuestionIndex = 0; score = 0;
        updateDifficultyIndicator();
        // Directly call showScreen with animation flag for quiz screen
        const currentActiveScreen = document.querySelector('.screen.active');
        if (currentActiveScreen) currentActiveScreen.classList.remove('active'); // Hide current instantly
        showScreen('quiz-screen', true); // true indicates to apply quiz animation
        displayQuestion();
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= currentQuestions.length || currentQuestionIndex >= TOTAL_QUESTIONS_PER_QUIZ) {
        endQuiz(); return;
    }
    const questionData = currentQuestions[currentQuestionIndex];
    if (!questionData) { endQuiz(); return; }

    questionTextEl.textContent = questionData.text;
    optionsContainer.innerHTML = '';
    feedbackQuestionTextEl.textContent = '';
    feedbackQuestionTextEl.className = 'feedback-message';
    questionCard.className = 'question-card';

    const shuffledOptions = [...questionData.options].sort(() => Math.random() - 0.5);
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = option;
        button.addEventListener('click', () => handleOptionSelect(button, option, questionData.answer), { once: true });
        optionsContainer.appendChild(button);
    });
    progressText.textContent = `Question ${currentQuestionIndex + 1} / ${Math.min(TOTAL_QUESTIONS_PER_QUIZ, currentQuestions.length)}`;
    updateDifficultyIndicator();
}

function handleOptionSelect(selectedButton, selectedOption, correctAnswer) {
    const allOptionButtons = optionsContainer.querySelectorAll('.option-btn');
    allOptionButtons.forEach(btn => btn.disabled = true);
    selectedButton.classList.add('selected');
    const isCorrect = selectedOption === correctAnswer;

    if (isCorrect) {
        selectedButton.classList.add('correct');
        feedbackQuestionTextEl.textContent = "Brilliant!";
        feedbackQuestionTextEl.className = 'feedback-message correct';
        score++;
        adjustDifficulty(true);
    } else {
        selectedButton.classList.add('incorrect');
        feedbackQuestionTextEl.textContent = `Next time! Correct: ${correctAnswer}`;
        feedbackQuestionTextEl.className = 'feedback-message incorrect';
        allOptionButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) btn.classList.add('reveal-correct');
        });
        adjustDifficulty(false);
    }
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 2200);
}

function adjustDifficulty(answeredCorrectly) {
    const currentDiffIndex = difficultyLevels.indexOf(currentDifficulty);
    if (answeredCorrectly && currentDiffIndex < difficultyLevels.length - 1) {
        currentDifficulty = difficultyLevels[currentDiffIndex + 1];
    } else if (!answeredCorrectly && currentDiffIndex > 0) {
        currentDifficulty = difficultyLevels[currentDiffIndex - 1];
    }
}

function updateDifficultyIndicator() {
    difficultyIndicator.textContent = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
    difficultyIndicator.className = 'difficulty-tag ' + currentDifficulty;
}

function endQuiz() {
    transitionToScreen('results-screen'); // Results screen appears instantly
    const questionsAttempted = Math.min(TOTAL_QUESTIONS_PER_QUIZ, currentQuestions.length);
    scoreValueEl.textContent = `${score} / ${questionsAttempted}`;
    displayScoreBasedFeedback(score, questionsAttempted);
}

function displayScoreBasedFeedback(userScore, questionsAttempted) {
    let feedbackCategory;
    let percentage = 0;
    if (questionsAttempted > 0) { percentage = (userScore / questionsAttempted) * 100; }
    else { feedbackCategory = scoreFeedback.low; }

    if (!feedbackCategory) {
        if (percentage >= 80) feedbackCategory = scoreFeedback.high;
        else if (percentage >= 50) feedbackCategory = scoreFeedback.medium;
        else feedbackCategory = scoreFeedback.low;
    }
    const randomIndex = Math.floor(Math.random() * feedbackCategory.length);
    feedbackEmojiEl.textContent = feedbackCategory[randomIndex].emoji;
    feedbackTextMessageEl.textContent = feedbackCategory[randomIndex].message;
}

function resetAndShowStartScreen() {
    currentQuestions = []; currentQuestionIndex = 0; score = 0;
    currentDifficulty = 'medium';
    if (feedbackQuestionTextEl) feedbackQuestionTextEl.textContent = '';
    loadingMessage.style.display = 'none';
    if (feedbackEmojiEl) feedbackEmojiEl.textContent = '';
    if (feedbackTextMessageEl) feedbackTextMessageEl.textContent = '';
    
    populateTopicButtons(); // Refresh topic buttons
    
    // Instant switch to start screen
    const currentActiveScreen = document.querySelector('.screen.active');
    if (currentActiveScreen) currentActiveScreen.classList.remove('active');
    showScreen('start-screen'); // showScreen will handle removing .animate-fade-in from quizScreen
}

async function fetchQuestionsFromOpenTriviaDB(categoryId, appDifficulty, count) {
    let otdbDifficultyParam = appDifficulty.toLowerCase();
    if (!['easy', 'medium', 'hard'].includes(otdbDifficultyParam)) otdbDifficultyParam = '';
    const url = `https://opentdb.com/api.php?amount=${count}&category=${categoryId}&difficulty=${otdbDifficultyParam}&type=multiple`;
    try {
        const response = await fetch(url);
        const responseText = await response.text();
        if (!response.ok) throw new Error(`OTDB API request failed: ${response.status}`);
        const data = JSON.parse(responseText);
        if (data.response_code !== 0) {
            let msg = "Could not fetch questions.";
            if (data.response_code === 1) msg = "Not enough questions for this category/difficulty.";
            else if (data.response_code === 5) msg = "Rate limit. Wait a moment.";
            throw new Error(msg);
        }
        if (!data.results || data.results.length === 0) throw new Error("No questions found for this criteria.");
        return data.results.map(q => {
            const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
            return {
                text: decodeHtmlEntities(q.question), options: options.map(decodeHtmlEntities),
                answer: decodeHtmlEntities(q.correct_answer), apiDifficulty: q.difficulty, answered: false
            };
        });
    } catch (error) {
        console.error("Error OTDB:", error.message);
        if (error.message.includes("Failed to fetch")) throw new Error("Network error. Check connection.");
        throw error;
    }
}
function decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}