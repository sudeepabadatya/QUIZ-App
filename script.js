const startBtn = document.querySelector(".start-btn");
const popupInfo = document.querySelector(".popup-info");
const exitBtn = document.querySelector(".exit-btn");
const main = document.querySelector(".main");
const continueBtn = document.querySelector(".continue-btn");
const quizSelection = document.querySelector(".quiz-selection");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const tryAgainBtn = document.querySelector(".tryAgain-btn");
const goHomeBtn = document.querySelector(".goHome-btn");
const nextBtn = document.querySelector(".next-btn");
const optionList = document.querySelector(".option-list");
const timerText = document.querySelector(".timer");

let questionCount = 0;
let questionNumb = 1;
let userScore = 0;
let timeValue = 15;
let counter;
let lives = 3;

startBtn.onclick = () => {
  popupInfo.classList.add("active");
  main.classList.add("active");
};

exitBtn.onclick = () => {
  popupInfo.classList.remove("active");
  main.classList.remove("active");
};

continueBtn.onclick = () => {
  quizSelection.classList.add("active");
  popupInfo.classList.remove("active");
  main.classList.remove("active");
  quizBox.classList.add("active");
  showQuestions(0);
  questionCounter(1);
  startTimer(timeValue);
  displayHearts();
};

tryAgainBtn.onclick = () => {
  location.reload();
};

goHomeBtn.onclick = () => {
  location.reload();
};

nextBtn.onclick = () => {
  if (questionCount < questions.length - 1) {
    questionCount++;
    questionNumb++;
    showQuestions(questionCount);
    questionCounter(questionNumb);
    nextBtn.classList.remove("active");
    clearInterval(counter);
    startTimer(timeValue);
  } else {
    showResultBox();
  }
};

function showQuestions(index) {
  const questionText = document.querySelector(".question-text");
  questionText.textContent = `${questions[index].numb}. ${questions[index].questions}`;
  let optionTag = questions[index].options
    .map(option => `<div class="option"><span>${option}</span></div>`)
    .join("");
  optionList.innerHTML = optionTag;

  document.querySelectorAll(".option").forEach(option => {
    option.setAttribute("onclick", "optionSelected(this)");
  });

  const factEl = document.querySelector(".fun-fact");
  if (factEl) factEl.remove();
}

function optionSelected(answer) {
  clearInterval(counter);
  let userAnswer = answer.textContent;
  let correctAnswer = questions[questionCount].answer;
  let allOptions = optionList.children.length;

  const factPopup = document.createElement("div");
  factPopup.classList.add("fun-fact");

  if (userAnswer === correctAnswer) {
    userScore++;
    answer.classList.add("correct");
    factPopup.innerHTML = `✅ Correct! <br><strong>Fun Fact:</strong> ${questions[questionCount].fact || "No fact available."}`;
  } else {
    answer.classList.add("incorrect");
    lives--;
    displayHearts();

    for (let i = 0; i < allOptions; i++) {
      if (optionList.children[i].textContent === correctAnswer) {
        optionList.children[i].classList.add("correct");
      }
    }

    factPopup.innerHTML = `❌ Wrong!<br>The correct answer is: <strong>${correctAnswer}</strong>`;
  }

  if (lives <= 0) {
    setTimeout(() => showResultBox(true), 1000);
    return;
  }

  for (let i = 0; i < allOptions; i++) {
    optionList.children[i].classList.add("disabled");
  }

  optionList.parentElement.appendChild(factPopup);
  factPopup.scrollIntoView({ behavior: 'smooth', block: 'center' });

  if (userAnswer !== correctAnswer) {
   
    setTimeout(() => {
      nextBtn.click();
    }, 1500);
  } else {
    nextBtn.classList.add("active");
  }
}

function questionCounter(index) {
  const questionTotal = document.querySelector(".question-total");
  questionTotal.textContent = `${index} of ${questions.length} Questions`;
}

function startTimer(time) {
  timerText.textContent = time;
  counter = setInterval(() => {
    time--;
    timerText.textContent = time;

    if (time <= 0) {
      clearInterval(counter);
      lives--;
      displayHearts();

      if (lives <= 0) {
        showResultBox(true);
      } else {
       
        const factPopup = document.createElement("div");
        factPopup.classList.add("fun-fact");
        factPopup.innerHTML = `⏱️ Time’s up!<br>The correct answer was: <strong>${questions[questionCount].answer}</strong>`;
        optionList.parentElement.appendChild(factPopup);
        factPopup.scrollIntoView({ behavior: 'smooth', block: 'center' });

        for (let i = 0; i < optionList.children.length; i++) {
          if (optionList.children[i].textContent === questions[questionCount].answer) {
            optionList.children[i].classList.add("correct");
          }
          optionList.children[i].classList.add("disabled");
        }

        setTimeout(() => {
          nextBtn.click();
        }, 1500);
      }
    }
  }, 1000);
}

function showResultBox(gameOver = false) {
  quizBox.classList.remove("active");
  resultBox.classList.add("active");

  const scoreText = document.querySelector(".score-text");
  scoreText.textContent = gameOver
    ? `Game Over! Your Score: ${userScore} out of ${questions.length}`
    : `Your Score ${userScore} out of ${questions.length}`;

  const circularProgress = document.querySelector(".circular-progress");
  const progressValue = document.querySelector(".progress-value");

  let progressStartValue = -1;
  let progressEndValue = (userScore / questions.length) * 100;
  let speed = 20;

  let progress = setInterval(() => {
    progressStartValue++;
    progressValue.textContent = `${progressStartValue}%`;
    circularProgress.style.background = `conic-gradient(skyblue ${progressStartValue * 3.6}deg, rgba(116, 118, 119, 0.1) 0deg)`;
    if (progressStartValue === Math.round(progressEndValue)) {
      clearInterval(progress);
    }
  }, speed);
}

function displayHearts() {
  let hearts = document.querySelector(".hearts");
  if (!hearts) {
    hearts = document.createElement("div");
    hearts.className = "hearts";
    hearts.style.display = "flex";
    hearts.style.gap = "5px";
    hearts.style.marginBottom = "10px";
    document.querySelector(".quiz-header").appendChild(hearts);
  }
  hearts.innerHTML = "❤️".repeat(lives) + "🤍".repeat(3 - lives);
}
