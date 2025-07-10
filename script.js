const API_URL = "https://script.google.com/macros/s/AKfycbxp3fJgA4W1a0UYj1Zmvt5931M8YeGE2btWI5oUq_2ivDbagHEoCp9TDbB00coMvG7cJg/exec";
let questions = [];
let currentIndex = 0;

document.getElementById("categorySelect").addEventListener("change", async function () {
  const selectedCategory = this.value;
  if (!selectedCategory) return;

  const response = await fetch(`${API_URL}?category=${encodeURIComponent(selectedCategory)}`);
  questions = await response.json();

  if (questions.length === 0) {
    alert("このカテゴリには問題がありません。");
    return;
  }

  currentIndex = 0;
  document.getElementById("quizContainer").style.display = "block";
  showQuestion();
});

function showQuestion() {
  const question = questions[currentIndex];
  document.getElementById("questionText").textContent = question.question;
  document.getElementById("resultText").textContent = "";
  document.getElementById("nextButton").style.display = "none";
}

function checkAnswer(userAnswer) {
  const correctAnswer = questions[currentIndex].answer;
  const explanation = questions[currentIndex].explanation;

  const resultText = document.getElementById("resultText");
  if (userAnswer === correctAnswer) {
    resultText.textContent = "正解！" + (explanation ? ` 解説：${explanation}` : "");
    resultText.style.color = "green";
  } else {
    resultText.textContent = "不正解..." + (explanation ? ` 解説：${explanation}` : "");
    resultText.style.color = "red";
  }

  document.getElementById("nextButton").style.display =
    currentIndex < questions.length - 1 ? "inline-block" : "none";
}

function showNextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  }
}
