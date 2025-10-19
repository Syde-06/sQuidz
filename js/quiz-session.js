// Quiz data for different topics
const quizData = {
  "world-capitals": {
    title: "World Capitals",
    questions: [
      {
        question: "What is the capital of France?",
        options: ["Berlin", "Paris", "Madrid", "Rome"],
        correctAnswer: "Paris",
      },
      {
        question: "What is the capital of Japan?",
        options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
        correctAnswer: "Tokyo",
      },
      {
        question: "What is the capital of Brazil?",
        options: ["São Paulo", "Rio de Janeiro", "Brasília", "Buenos Aires"],
        correctAnswer: "Brasília",
      },
      {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correctAnswer: "Canberra",
      },
      {
        question: "What is the capital of Canada?",
        options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
        correctAnswer: "Ottawa",
      },
    ],
    timePerQuestion: 30,
  },
  "science-challenge": {
    title: "Science Challenge",
    questions: [
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: "Au",
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
      },
      {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correctAnswer: "Diamond",
      },
    ],
    timePerQuestion: 20,
  },
  "history-trivia": {
    title: "History Trivia",
    questions: [
      {
        question: "In which year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        correctAnswer: "1945",
      },
      {
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
        correctAnswer: "George Washington",
      },
      {
        question: "Which ancient civilization built the Machu Picchu?",
        options: ["Aztec", "Maya", "Inca", "Olmec"],
        correctAnswer: "Inca",
      },
      {
        question: "When was the Declaration of Independence signed?",
        options: ["1774", "1776", "1781", "1789"],
        correctAnswer: "1776",
      },
      {
        question: "Who discovered penicillin?",
        options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Robert Koch"],
        correctAnswer: "Alexander Fleming",
      },
      {
        question: "Which empire was ruled by Genghis Khan?",
        options: ["Ottoman Empire", "Roman Empire", "Mongol Empire", "Byzantine Empire"],
        correctAnswer: "Mongol Empire",
      },
      {
        question: "In which year did the Titanic sink?",
        options: ["1905", "1912", "1918", "1923"],
        correctAnswer: "1912",
      },
      {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: "Leonardo da Vinci",
      },
      {
        question: "Which country was the first to give women the right to vote?",
        options: ["United States", "United Kingdom", "New Zealand", "France"],
        correctAnswer: "New Zealand",
      },
      {
        question: "When did the Berlin Wall fall?",
        options: ["1985", "1989", "1991", "1993"],
        correctAnswer: "1989",
      },
    ],
    timePerQuestion: 25,
  },
}

// Quiz state variables
let currentQuiz = null
let currentQuestionIndex = 0
let score = 0
let streak = 0
let timeLeft = 0
let timerInterval
let answered = false

// DOM elements
const questionCounter = document.getElementById("questionCounter")
const progressBar = document.getElementById("progressBar")
const questionText = document.getElementById("questionText")
const optionsGrid = document.getElementById("optionsGrid")
const streakElement = document.getElementById("streak")
const scoreElement = document.getElementById("score")
const minutesElement = document.getElementById("minutes")
const secondsElement = document.getElementById("seconds")

function getQuizIdFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get("quiz")
}

// Initialize quiz on page load
window.addEventListener("DOMContentLoaded", () => {
  const quizId = getQuizIdFromUrl()
  if (quizId && quizData[quizId]) {
    startQuiz(quizId)
  }
})

// Start the selected quiz
function startQuiz(quizId) {
  currentQuiz = quizData[quizId]
  currentQuestionIndex = 0
  score = 0
  streak = 0

  scoreElement.textContent = score
  streakElement.textContent = streak

  // Load first question
  loadQuestion()
}

// Load current question
function loadQuestion() {
  const currentQuestion = currentQuiz.questions[currentQuestionIndex]

  questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${currentQuiz.questions.length}`
  questionText.textContent = currentQuestion.question
  progressBar.style.width = `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`

  // Clear options
  optionsGrid.innerHTML = ""

  // Add new options
  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button")
    button.className = "option"
    button.textContent = option
    button.dataset.answer = option
    button.addEventListener("click", handleAnswer)
    optionsGrid.appendChild(button)
  })

  // Reset timer
  timeLeft = currentQuiz.timePerQuestion
  answered = false
  updateTimer()
  startTimer()
}

// Handle answer selection
function handleAnswer(e) {
  if (answered) return

  answered = true
  clearInterval(timerInterval)

  const selectedOption = e.target
  const selectedAnswer = selectedOption.dataset.answer
  const correctAnswer = currentQuiz.questions[currentQuestionIndex].correctAnswer

  // Highlight correct/incorrect
  const options = document.querySelectorAll(".option")
  options.forEach((option) => {
    option.style.pointerEvents = "none"
    if (option.dataset.answer === correctAnswer) {
      option.classList.add("correct")
    } else if (option === selectedOption && option.dataset.answer !== correctAnswer) {
      option.classList.add("incorrect")
    }
  })

  // Update score and streak
  if (selectedAnswer === correctAnswer) {
    const points = Math.max(1, streak)
    score += points
    streak++
    scoreElement.textContent = score
    streakElement.textContent = streak
  } else {
    streak = 0
    streakElement.textContent = streak
  }

  // Move to next question
  setTimeout(() => {
    currentQuestionIndex++
    if (currentQuestionIndex < currentQuiz.questions.length) {
      loadQuestion()
    } else {
      showResults()
    }
  }, 2000)
}

// Timer functions
function startTimer() {
  timerInterval = setInterval(() => {
    if (timeLeft > 0 && !answered) {
      timeLeft--
      updateTimer()
    } else if (timeLeft === 0 && !answered) {
      handleTimeout()
    }
  }, 1000)
}

function updateTimer() {
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  minutesElement.textContent = mins.toString().padStart(2, "0")
  secondsElement.textContent = secs.toString().padStart(2, "0")
}

function handleTimeout() {
  answered = true
  clearInterval(timerInterval)

  // Show correct answer
  const correctAnswer = currentQuiz.questions[currentQuestionIndex].correctAnswer
  const options = document.querySelectorAll(".option")
  options.forEach((option) => {
    option.style.pointerEvents = "none"
    if (option.dataset.answer === correctAnswer) {
      option.classList.add("correct")
    }
  })

  streak = 0
  streakElement.textContent = streak

  setTimeout(() => {
    currentQuestionIndex++
    if (currentQuestionIndex < currentQuiz.questions.length) {
      loadQuestion()
    } else {
      showResults()
    }
  }, 2000)
}

function showResults() {
  clearInterval(timerInterval)
  alert(`Quiz Complete!\n\nFinal Score: ${score}\nCorrect Answers: ${score} out of ${currentQuiz.questions.length}`)

  // Return to home
  window.location.href = "home.html"
}
