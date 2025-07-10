const API_URL = "https://script.google.com/macros/s/AKfycbxp3fJgA4W1a0UYj1Zmvt5931M8YeGE2btWI5oUq_2ivDbagHEoCp9TDbB00coMvG7cJg/exec";
let allQuestions = [];
let questions = [];
let currentIndex = 0;
let correctCount = 0;
let incorrectQuestions = [];

document.getElementById("categorySelect").addEventListener("change", async function () {
  const selectedCategory = this.value;
  if (!selectedCategory) {
    document.getElementById("startButton").style.visibility = "hidden";
    return;
  }

  const response = await fetch(`${API_URL}?category=${encodeURIComponent(selectedCategory)}`);
  allQuestions = await response.json();

  document.getElementById("startButton").style.visibility = "visible";
  document.getElementById("startButton").onclick = () => startQuiz(allQuestions);
});

function startQuiz(questionSet) {
    questions = [...questionSet];
    shuffleArray(questions);
    currentIndex = 0;
    correctCount = 0;
    incorrectQuestions = [];
    document.getElementById("quizContainer").style.visibility = "visible";
    document.getElementById("startButton").style.visibility = "hidden";
    document.getElementById("scoreText").textContent = "";
    document.getElementById("reviewButton").style.visibility = "hidden";
    showQuestion();
}

function showQuestion() {
  if (currentIndex < questions.length) {
    const question = questions[currentIndex];
    document.getElementById("questionText").textContent = question.question;
    document.getElementById("resultText").textContent = "";
    document.getElementById("nextButton").style.visibility = "hidden";
    updateProgressBar();
  } else {
    showResult();
  }
}

function checkAnswer(userAnswer) {
  const correctAnswer = questions[currentIndex].answer;
  const explanation = questions[currentIndex].explanation;

  const resultText = document.getElementById("resultText");
  if (userAnswer === correctAnswer) {
    resultText.textContent = "正解！" + (explanation ? ` 解説：${explanation}` : "");
    resultText.style.color = "green";
    correctCount++;
  } else {
    resultText.textContent = "不正解..." + (explanation ? ` 解説：${explanation}` : "");
    resultText.style.color = "red";
    incorrectQuestions.push(questions[currentIndex]);
  }

  document.getElementById("nextButton").style.visibility = "visible";
}

function showNextQuestion() {
  currentIndex++;
  showQuestion();
}

function showResult() {
    const score = (correctCount / questions.length) * 100;
    document.getElementById("questionText").textContent = "クイズ終了！";
    document.getElementById("resultText").textContent = `正解率は ${score.toFixed(2)}% です。`;
    document.getElementById("nextButton").style.visibility = "hidden";

    const reviewButton = document.getElementById("reviewButton");
    if (incorrectQuestions.length > 0) {
        reviewButton.style.visibility = "visible";
        reviewButton.onclick = () => startQuiz(incorrectQuestions);
    } else {
        reviewButton.style.visibility = "hidden";
    }
}

function updateProgressBar() {
  const progress = ((currentIndex + 1) / questions.length) * 100;
  document.getElementById("progressBar").style.width = `${progress}%`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
