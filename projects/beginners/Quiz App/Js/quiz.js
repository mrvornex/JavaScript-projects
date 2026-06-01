var questions = [
  {
    question: "What does CSS stand for?",
    option1: "Colorful Style Sheets",
    option2: "Cascading Style Sheets",
    option3: "Computer Style Sheets",
    corrAnswer: "Cascading Style Sheets",
  },
  {
    question: "Which HTML tag is used to link an external CSS file?",
    option1: "<script>",
    option2: "<link>",
    option3: "<style>",
    corrAnswer: "<link>",
  },
  {
    question: "Which property is used to change the background color?",
    option1: "color",
    option2: "bgcolor",
    option3: "background-color",
    corrAnswer: "background-color",
  },
  {
    question: "Which property is used to change the text color in CSS?",
    option1: "font-color",
    option2: "text-color",
    option3: "color",
    corrAnswer: "color",
  },
  {
    question: "How do you make all letters uppercase in CSS?",
    option1: "text-decoration: uppercase;",
    option2: "text-transform: uppercase;",
    option3: "font-case: upper;",
    corrAnswer: "text-transform: uppercase;",
  },
  {
    question: "Which CSS property controls the text size?",
    option1: "font-style",
    option2: "text-size",
    option3: "font-size",
    corrAnswer: "font-size",
  },
  {
    question: "Which is the correct CSS syntax to make all <p> elements bold?",
    option1: "p {font-weight: bold;}",
    option2: "p {text-weight: bold;}",
    option3: "p {bold: true;}",
    corrAnswer: "p {font-weight: bold;}",
  },
  {
    question: "How do you select an element with id 'header' in CSS?",
    option1: ".header",
    option2: "#header",
    option3: "*header",
    corrAnswer: "#header",
  },
  {
    question: "Which property is used for adding space inside an element's border?",
    option1: "margin",
    option2: "padding",
    option3: "spacing",
    corrAnswer: "padding",
  },
  {
    question: "Which CSS property is used to set the spacing between lines of text?",
    option1: "letter-spacing",
    option2: "line-height",
    option3: "text-spacing",
    corrAnswer: "line-height",
  }
];


var quesElement = document.getElementById("ques");
var option1 = document.getElementById("opt1");
var option2 = document.getElementById("opt2");
var option3 = document.getElementById("opt3");
var resultBox = document.getElementById("result");
var scoreText = document.getElementById("score");
var index = 0;
var score = 0;

function nextQuestion() {
  var nextBtn = document.getElementById("btn");
  var allOptions = document.getElementsByTagName("input");

  for (var i = 0; i < allOptions.length; i++) {
    if (allOptions[i].checked) {
      allOptions[i].checked = false;
      var selectedValue = allOptions[i].value;
      var selectedOption = questions[index - 1][`option${selectedValue}`];
      var correctAnswer = questions[index - 1]["corrAnswer"];

      if (selectedOption === correctAnswer) {
        score++;
      }
    }
  }

  nextBtn.disabled = true;

  if (index >= questions.length) {
    // Jab sab questions khatam ho jaaye
    showResult();
  } else {
    // Agla question
    quesElement.innerText = questions[index].question;
    option1.innerText = questions[index].option1;
    option2.innerText = questions[index].option2;
    option3.innerText = questions[index].option3;
    index++;
  }
}

function clicked() {
  var nextBtn = document.getElementById("btn");
  nextBtn.disabled = false;
}

function showResult() {
  var percentage = ((score / questions.length) * 100).toFixed(2);
  scoreText.innerText = `Your Score: ${percentage}%`;

  document.querySelector(".main").style.display = "none";
  resultBox.style.display = "flex";
  resultBox.classList.add("fade-in");
}
