
const question = document.getElementById('question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('lds-default');
const game = document.getElementById('game');


let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 1;
let availableQuestions = [];


let questions = [];

fetch('https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple')
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };

            const answerChoices = [... loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    // .catch(error => {
    //     alert('Something went wrong. Please Try Again!');
    // })



const SCORE_POINTS = 10;
const MAX_QUESTIONS = 10;

const startGame = () => {
    questionCounter = 1;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    // game.classList.remove('hidden');
    game.style.display = 'block';
    loader.style.display = 'none';
}


const getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        
        return window.location.assign('end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter - 1} out of ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${((questionCounter - 1) / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
}


choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply == 'correct') {
            incrementScore(SCORE_POINTS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        },1000);
    })
});


const incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};


