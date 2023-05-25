// STARTER CODE COMMENTS IN LOWERCASE
// MY COMMENTS IN CAPS  -YAJIIT


// variables to keep track of quiz state
var currentQuestionIndex = 0;
//time left value here
// var time = ;
var timerId;

// variables to reference DOM elements
// ADDED ELEMENT NAMES
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');
// STARTING TIMER
var time = 120;
var feedbackTimer;

function startQuiz() {
  // hide start screen
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');
  // un-hide questions section
  questionsEl.removeAttribute('class');

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById('question-title');
  // ADDED AFTER =
  titleEl.textContent = currentQuestion.title; //think dot notation

  // clear out any old question choices
  choicesEl.innerHTML = '';

  // loop over choices
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    // create new button for each choice
    var choice = currentQuestion.choices[i];
    // DEFINED ELEMENT BUTTON
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', i);
// ADDED PARENTHESIS TO i + 1
    choiceNode.textContent = (i + 1) + '. ' + choice;
    // display on the page
    // DEFINED ChoiceNode
    choicesEl.appendChild(choiceNode);



}
}

function questionClick(event) {
  var buttonEl = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!buttonEl.matches('.choice')) {
    return;
  }



  // check if user guessed wrong
  // ADDED VARIABLES
  var selectedChoice = buttonEl.getAttribute('value');
  var correctChoice = questions[currentQuestionIndex].answer;



    // CLEARS THE .500 SECOND TIMER ON CORRECT/WRONG FEEDBACK
    clearTimeout(feedbackTimer);

  if (selectedChoice !== correctChoice) {
     // penalize time
    time -= 10;

    // display new time on page
   timerEl.textContent = time;


  // flash right/wrong feedback on page for half a second
 feedbackEl.textContent = 'Wrong!';
 feedbackEl.setAttribute('class', 'feedback wrong');
//  ADDED DELAYED FUNCTION WITH SETTIMEOUT TO REMOVE AFTER HALF SECOND
feedbackTimer = setTimeout(function () {
  feedbackEl.textContent = '';
  feedbackEl.removeAttribute('class');
}, 500);
 
  } else {
    feedbackEl.textContent = 'Correct!';
    feedbackEl.setAttribute('class', 'feedback correct');
    //  ADDED DELAYED FUNCTION WITH SETTIMEOUT TO REMOVE AFTER HALF SECOND
   feedbackTimer = setTimeout(function () {
      feedbackEl.textContent = '';
      feedbackEl.removeAttribute('class');
    }, 500);


  // move to next question
  // PUT INTO ELSE-CURLY SO QUIZ ONLY ADVANCES ON CORRECT ANSWER
  currentQuestionIndex++;
  
  }
  // check if we've run out of questions or if time ran out?
  if (currentQuestionIndex >= questions.length || time <= 0) {

    //if it did ???
    quizEnd();
  } else {
    
    // if it didnt??
    getQuestion();    
  }
}

function quizEnd() {
  // stop timer
 clearInterval(timerId);
  // show end screen
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');

  // show final score
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;

  // hide questions section
  questionsEl.setAttribute('class', 'hide');
}

function clockTick() {
  // update time
  time--;
  // decrement the variable we are using to track time
  timerEl.textContent = time; // update out time


  // SETS CLOCK RED AND BIG IN LAST 10 SECONDS
  if (time <= 10) {
      timerEl.style.color = '#ff0000';
      timerEl.style.fontSize = '170%';
  }

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  // make sure value wasn't empty
  if (initials !== '') {

    // get saved scores from localstorage, or if not any, set to empty array
    var highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    // var highscores =
    //   JSON.parse() /* what would go inside the PARSE??*/ || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials,
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // redirect to next page
    window.location.href = './highscores.html';
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
