// STARTER CODE COMMENTS IN LOWERCASE
// MY COMMENTS IN CAPS  -YAJIIT
// GLOBAL VARIABLES FOR TRACKING QUIZ STATE
// STARTING TIMER NUMBER
var time = 120;
var feedbackTimer;
var currentQuestionIndex = 0;
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


function startQuiz() {
  // HIDES OPENING SCREEN ON START CLICK
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');
  // REMOVES HIDE CLASS FROM QUESTIONS
  questionsEl.removeAttribute('class');
  // BEGINS THE TIMER
  timerId = setInterval(clockTick, 1000);
  // REVEALS STARTING TIMER COUNT
  timerEl.textContent = time;
  getQuestion();
}

function getQuestion() {
  // GRABS CURRENT QUESTION FROM QUESTIONS ARRAY
  var currentQuestion = questions[currentQuestionIndex];
  // PUTS QUESTION INTO QUESTION TITLE ELEMENT
  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title;
  // REMOVES PREVIOUS QUESTION CHOICES
  choicesEl.innerHTML = '';
  // LOOP TO MAKE BUTTON FOR EACH CHOICE
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', i);
    choiceNode.textContent = (i + 1) + '. ' + choice;
    // DISPLAY CHOICES ON THE PAGE
    choicesEl.appendChild(choiceNode);
  }
}

function questionClick(event) {
  var buttonEl = event.target;
  // DO NOTHING IF SOMETHING OTHER THAN CHOICE BUTTON IS CLICKED
  if (!buttonEl.matches('.choice')) {
    return;
  }
  // ADDED VARIABLE FOR CLICKED BUTTON AND CORRECT BUTTONS TO COMPARE TO
  var selectedChoice = buttonEl.getAttribute('value');
  var correctChoice = questions[currentQuestionIndex].answer;
    // CLEARS THE .500 SECOND TIMER ON CORRECT/WRONG FEEDBACK TO ENSURE FEEDBACK LASTS A FULL .500 SECONDS
    clearTimeout(feedbackTimer);
   // CHANGED 'IF' CONDITIONAL TO CHECK ARRAY FOR MULTIPLE POSSIBLE CORRECT ANSWERS. ALSO FLIPPED CORRECT/INCORRECT'S POSITIONING IN THE IF/ELSE
  if (correctChoice.includes(selectedChoice)) {
    feedbackEl.textContent = 'Correct!';
    feedbackEl.setAttribute('class', 'feedback correct');
    //  ADDED DELAYED FUNCTION WITH SETTIMEOUT TO REMOVE AFTER HALF SECOND
   feedbackTimer = setTimeout(function () {
      feedbackEl.textContent = '';
      feedbackEl.removeAttribute('class');
    }, 500);
  // CONTINUES TO NEXT QUESTION
  // PUT INTO ELSE-CURLY SO QUIZ ONLY ADVANCES ON CORRECT ANSWER
  currentQuestionIndex++;
    } else {
    // SUBTRACT TEN SECONDS FROM TIMER
   time -= 10;
   // DISPLAYS NEW TIME VALUE ON PAGE
  timerEl.textContent = time;
 // FLASH "WRONG!" FEEDBACK
feedbackEl.textContent = 'Wrong!';
feedbackEl.setAttribute('class', 'feedback wrong');
//  ADDED DELAYED FUNCTION WITH SETTIMEOUT TO REMOVE AFTER HALF SECOND
feedbackTimer = setTimeout(function () {
 feedbackEl.textContent = '';
 feedbackEl.removeAttribute('class');
}, 500);
 } 
  // CHECK FOR END OF QUESTIONS OR TIMER
  if (currentQuestionIndex >= questions.length || time <= 0) {
    quizEnd();
  } else {    
    getQuestion();    
  }
}

function quizEnd() {
  // END TIMER
 clearInterval(timerId);
  // REVEAL END SCREEN
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');
  // REVEAL FINAL SCORE
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;
  // HIDE QUESTIONS
  questionsEl.setAttribute('class', 'hide');
}

function clockTick() {
  // SUBTRACT ONE FROM TIME
  time--;
  // UPDATES DISPLAYED TIMER
  timerEl.textContent = time;
  // SETS CLOCK RED AND BIG IN LAST 10 SECONDS
  if (time <= 10) {
      timerEl.style.color = '#ff0000';
      timerEl.style.fontSize = '170%';
  }
  // CHECK IF TIME RUNS OUT
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // GET VALUE OF INPUT FOR HIGH SCORE
  var initials = initialsEl.value.trim();
  // ENSURE THERE IS A VALUE
  if (initials !== '') {
    // GET LOCAL STORAGE OR CREATE IF THERE IS NONE
    var highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    // FORMAT NEWLY ENTERED SCORE
    var newScore = {
      score: time,
      initials: initials,
    };
    // SAVE SCORES TO LOCAL STORAGE
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));
    // AUTO REDIRECT TO HIGH SCORE PAGE
    window.location.href = './highscores.html';
  }
}

function checkForEnter(event) {
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