// Quiz data
        const quiz = {
            questions: [
                {
                    question: "What is the capital of France?",
                    options: ["Berlin", "Paris", "Madrid", "Rome"],
                    correctAnswer: "Paris"
                },
                {
                    question: "What is the capital of Japan?",
                    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
                    correctAnswer: "Tokyo"
                },
                {
                    question: "What is the capital of Brazil?",
                    options: ["São Paulo", "Rio de Janeiro", "Brasília", "Buenos Aires"],
                    correctAnswer: "Brasília"
                },
                {
                    question: "What is the capital of Australia?",
                    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
                    correctAnswer: "Canberra"
                },
                {
                    question: "What is the capital of Canada?",
                    options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
                    correctAnswer: "Ottawa"
                }
            ]
        };
        
        let currentQuestionIndex = 0;
        let score = 0;
        let streak = 0;
        let timeLeft = 30;
        let timerInterval;
        let answered = false;
        
        // DOM elements
        const questionCounter = document.getElementById('questionCounter');
        const progressBar = document.getElementById('progressBar');
        const questionText = document.getElementById('questionText');
        const optionsGrid = document.getElementById('optionsGrid');
        const streakElement = document.getElementById('streak');
        const scoreElement = document.getElementById('score');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        // Initialize quiz
        function loadQuestion() {
            const currentQuestion = quiz.questions[currentQuestionIndex];
            
            questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${quiz.questions.length}`;
            questionText.textContent = currentQuestion.question;
            progressBar.style.width = `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`;
            
            // Clear options
            optionsGrid.innerHTML = '';
            
            // Add new options
            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'option';
                button.textContent = option;
                button.dataset.answer = option;
                button.addEventListener('click', handleAnswer);
                optionsGrid.appendChild(button);
            });
            
            // Reset timer
            timeLeft = 30;
            answered = false;
            updateTimer();
            startTimer();
        }
        
        // Handle answer selection
        function handleAnswer(e) {
            if (answered) return;
            
            answered = true;
            clearInterval(timerInterval);
            
            const selectedOption = e.target;
            const selectedAnswer = selectedOption.dataset.answer;
            const correctAnswer = quiz.questions[currentQuestionIndex].correctAnswer;
            
            // Highlight correct/incorrect
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                option.style.pointerEvents = 'none';
                if (option.dataset.answer === correctAnswer) {
                    option.classList.add('correct');
                } else if (option === selectedOption && option.dataset.answer !== correctAnswer) {
                    option.classList.add('incorrect');
                }
            });
            
            // Update score and streak
            if (selectedAnswer === correctAnswer) {
                const points = Math.max(1, streak);
                score += points;
                streak++;
                scoreElement.textContent = score;
                streakElement.textContent = streak;
            } else {
                streak = 0;
                streakElement.textContent = streak;
            }
            
            // Move to next question
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < quiz.questions.length) {
                    loadQuestion();
                } else {
                    showResults();
                }
            }, 2000);
        }
        
        // Timer functions
        function startTimer() {
            timerInterval = setInterval(() => {
                if (timeLeft > 0 && !answered) {
                    timeLeft--;
                    updateTimer();
                } else if (timeLeft === 0 && !answered) {
                    handleTimeout();
                }
            }, 1000);
        }
        
        function updateTimer() {
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            minutesElement.textContent = mins.toString().padStart(2, '0');
            secondsElement.textContent = secs.toString().padStart(2, '0');
        }
        
        function handleTimeout() {
            answered = true;
            clearInterval(timerInterval);
            
            // Show correct answer
            const correctAnswer = quiz.questions[currentQuestionIndex].correctAnswer;
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                option.style.pointerEvents = 'none';
                if (option.dataset.answer === correctAnswer) {
                    option.classList.add('correct');
                }
            });
            
            streak = 0;
            streakElement.textContent = streak;
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < quiz.questions.length) {
                    loadQuestion();
                } else {
                    showResults();
                }
            }, 2000);
        }
        
        function showResults() {
            clearInterval(timerInterval);
            alert(`Quiz Complete!\n\nFinal Score: ${score}\nHighest Streak: ${Math.max(...streakHistory)}`);
            window.location.href = 'home.html';
        }
        
        // Track streak history for final display
        const streakHistory = [0];
        const originalStreakTextContent = streakElement.textContent;
        const streakObserver = new MutationObserver(() => {
            streakHistory.push(parseInt(streakElement.textContent));
        });
        streakObserver.observe(streakElement, { characterData: true, subtree: true, childList: true });
        
        // Start the quiz
        loadQuestion();