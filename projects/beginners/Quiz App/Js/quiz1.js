var questions = [
    {
      question: "Which type of language is JavaScript?",
      option1: "Object-Oriented",
      option2: "Object-Based",
      option3: "Procedural",
      corrAnswer: "Object-Based",
    },
    {
      question: "Which company developed JavaScript?",
      option1: "Netscape",
      option2: "Mozilla",
      option3: "Microsoft",
      corrAnswer: "Netscape",
    },
    {
      question: "Inside which HTML element do we put JavaScript code?",
      option1: "<script>",
      option2: "<js>",
      option3: "<javascript>",
      corrAnswer: "<script>",
    },
    {
      question: "How do you write 'Hello World' in an alert box?",
      option1: "alertBox('Hello World');",
      option2: "msg('Hello World');",
      option3: "alert('Hello World');",
      corrAnswer: "alert('Hello World');",
    },
    {
      question: "How do you create a function in JavaScript?",
      option1: "function:myFunction()",
      option2: "function = myFunction()",
      option3: "function myFunction()",
      corrAnswer: "function myFunction()",
    },
    {
      question: "Which operator is used to assign a value to a variable?",
      option1: "*",
      option2: "=",
      option3: "-",
      corrAnswer: "=",
    },
    {
      question: "Which method is used to write something in the console?",
      option1: "console.write()",
      option2: "console.log()",
      option3: "console.print()",
      corrAnswer: "console.log()",
    },
    {
      question: "How do you declare a JavaScript variable?",
      option1: "v carName;",
      option2: "variable carName;",
      option3: "var carName;",
      corrAnswer: "var carName;",
    },
    {
      question: "Which built-in method adds one or more elements to the end of an array?",
      option1: "push()",
      option2: "append()",
      option3: "insert()",
      corrAnswer: "push()",
    },
    {
      question: "How can you convert a string into an integer in JavaScript?",
      option1: "parseInt()",
      option2: "stringToInt()",
      option3: "intParse()",
      corrAnswer: "parseInt()",
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
  
  
  