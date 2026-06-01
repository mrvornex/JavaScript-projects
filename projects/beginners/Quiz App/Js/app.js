// const firebaseConfig = {
//   apiKey: "AIzaSyAP0X5V9l0hKy1mp3YVKNqGvyB9BEJOmAQ",
//   authDomain: "my-project-bd5aa.firebaseapp.com",
//   databaseURL: "https://my-project-bd5aa-default-rtdb.firebaseio.com",
//   projectId: "my-project-bd5aa",
//   storageBucket: "my-project-bd5aa.firebasestorage.app",
//   messagingSenderId: "459567794249",
//   appId: "1:459567794249:web:1cd4a49d6ab6271c67d798",
//   measurementId: "G-2XTRPRNVFQ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

var questions = [
  {
    question: "What does HTML stand for?",
    option1: "Hyperlinks and Text Markup Language",
    option2: "Hyper Text Markup Language",
    option3: "Home Tool Markup Language",
    correctAnswer: "Hyper Text Markup Language",
  },
  {
    question: "Who is the inventor of HTML?",
    option1: "Tim Berners-Lee",
    option2: "Brendan Eich",
    option3: "James Gosling",
    correctAnswer: "Tim Berners-Lee",
  },
  {
    question: "Which HTML element is used for the largest heading?",
    option1: "<h6>",
    option2: "<heading>",
    option3: "<h1>",
    correctAnswer: "<h1>",
  },
  {
    question: "Which tag is used to create a hyperlink in HTML?",
    option1: "<a>",
    option2: "<link>",
    option3: "<href>",
    correctAnswer: "<a>",
  },
  {
    question: "What is the correct HTML element for inserting a line break?",
    option1: "<break>",
    option2: "<br>",
    option3: "<lb>",
    correctAnswer: "<br>",
  },
  {
    question: "Which attribute is used to provide an alternative text for an image?",
    option1: "alt",
    option2: "src",
    option3: "title",
    correctAnswer: "alt",
  },
  {
    question: "Which tag is used to create an unordered list?",
    option1: "<ul>",
    option2: "<ol>",
    option3: "<li>",
    correctAnswer: "<ul>",
  },
  {
    question: "How can you make a numbered list in HTML?",
    option1: "<ul>",
    option2: "<ol>",
    option3: "<dl>",
    correctAnswer: "<ol>",
  },
  {
    question: "Which HTML element is used to display a table?",
    option1: "<list>",
    option2: "<table>",
    option3: "<tab>",
    correctAnswer: "<table>",
  },
  {
    question: "Which tag is used to define a paragraph in HTML?",
    option1: "<p>",
    option2: "<para>",
    option3: "<paragraph>",
    correctAnswer: "<p>",
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

// const firebaseConfig = {
//     apiKey: "AIzaSyD0jmKIhZXlwuZ6zTRMq-xT_0OPyrwgMu0",
//     authDomain: "database-3b189.firebaseapp.com",
//     databaseURL: "https://database-3b189-default-rtdb.firebaseio.com",
//     projectId: "database-3b189",
//     storageBucket: "database-3b189.firebasestorage.app",
//     messagingSenderId: "520673349827",
//     appId: "1:520673349827:web:f765db53e12a3819409276",
//     measurementId: "G-SL51CJ1KRD"
// };

// // Initialize Firebase
// var app = firebase.initializeApp(firebaseConfig);


