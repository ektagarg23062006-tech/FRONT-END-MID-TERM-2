const questions = [
  {
    text: "Which keyword declares a block-scoped variable that cannot be reassigned?",
    options: ["var", "let", "const", "static"],
    answerIndex: 2
  },
  {
    text: "Which array method adds a new item to the end of an array?",
    options: ["push()", "shift()", "slice()", "map()"],
    answerIndex: 0
  },
  {
    text: "Which operator checks both value and type for equality?",
    options: ["=", "==", "!=", "==="],
    answerIndex: 3
  },
  {
    text: "What does document.querySelector() return?",
    options: ["Every matching element", "The first matching element", "A new HTML page", "The element count"],
    answerIndex: 1
  }
];

let currentQuestion = 0;
let score = 0;

const answerForm = document.querySelector("#answer-form");
const optionsList = document.querySelector("#options-list");
const nextButton = document.querySelector("#next-button");
const questionView = document.querySelector("#question-view");
const resultView = document.querySelector("#result-view");

function showQuestion() {
  const question = questions[currentQuestion];
  const questionNumber = currentQuestion + 1;

  document.querySelector("#question-counter").innerHTML = `QUESTION ${questionNumber} <span>/ ${questions.length}</span>`;
  document.querySelector("#progress-percent").textContent = `${Math.round((questionNumber / questions.length) * 100)}%`;
  document.querySelector("#progress-track").setAttribute("aria-valuenow", questionNumber);
  document.querySelector("#progress-fill").style.width = `${(questionNumber / questions.length) * 100}%`;
  document.querySelector("#question-text").textContent = question.text;
  document.querySelector("#next-label").textContent = questionNumber === questions.length ? "Finish quiz" : "Next question";
  document.querySelector("#selection-hint").textContent = "Choose one answer to continue";

  optionsList.innerHTML = "";
  for (let index = 0; index < question.options.length; index += 1) {
    const option = question.options[index];
    const optionLetter = String.fromCharCode(65 + index);
    optionsList.innerHTML += `
      <label class="answer-option" for="answer-${index}">
        <input id="answer-${index}" type="radio" name="answer" value="${index}" />
        <span class="option-letter" aria-hidden="true">${optionLetter}</span>
        <span class="option-text">${option}</span>
      </label>`;
  }

  nextButton.disabled = true;
}

function showResults() {
  const percentage = Math.round((score / questions.length) * 100);
  let message;

  if (percentage === 100) {
    message = "Excellent work! You got every question right.";
  } else if (percentage >= 50) {
    message = "Good job! Keep building on what you know.";
  } else {
    message = "Keep practising! Every answer is a step forward.";
  }

  document.querySelector("#score-result").textContent = `${score}/${questions.length}`;
  document.querySelector("#percentage-result").textContent = `${percentage}%`;
  document.querySelector("#result-message").textContent = message;
  questionView.hidden = true;
  resultView.hidden = false;
}

optionsList.addEventListener("change", () => {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  nextButton.disabled = selectedAnswer === null;

  if (selectedAnswer !== null) {
    document.querySelector("#selection-hint").textContent = "Answer selected";
  }
});

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');

  if (selectedAnswer === null) {
    return;
  }

  if (Number(selectedAnswer.value) === questions[currentQuestion].answerIndex) {
    score += 1;
  }

  currentQuestion += 1;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

document.querySelector("#restart-button").addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  resultView.hidden = true;
  questionView.hidden = false;
  showQuestion();
});

showQuestion();