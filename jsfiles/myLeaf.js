//Map Border Values
let topBorder = 51.51175;
let bottomBorder = 51.50245;
let rightBorder = -0.15621;
let leftBorder = -0.18758;
let borderBuffer = 0.0006
let monsterAdapter = adapter('http://localhost:3000/api/v1/monsters')
let monstersFromAPI = [];
let wildMonsters = [];
let caughtMonsters = [];
let selectedMonster = {}

let caughtCode = [];
let monsterBoundaries = [];
const foundPokecount = 0;
let intersection = false;

// DOM Variables
let quizContainer = document.getElementById('quiz-container')
let codemonBelt = document.getElementById('codemon-belt')


//Start Point of Game
let latitude = 51.50789;
let longitude = -0.16825;
let center = [latitude, longitude];
let currentLatitude = center[0]
let currentLongitude = center[1]
let map = L.map('map', {drawControl: false, zoomControl: false}).setView(center, 17);
map.scrollWheelZoom.disable()
map.keyboard.disable();

//Global values for our player icon movement event listeners
let horizontal = 0;
let vertical = 0;
let keyCodes = [37, 38, 39, 40]
let warning = 'No capturing of codemon! Codemon catching is only allowed in this park!';

//Player Icon and Attributes
let myIcon = L.icon({
    iconUrl: './img/littleman.gif',
    iconSize: [80, 80]
  });

let icon = L.marker(center, {
    autoPan: true,
    autoPanSpeed: 10,
    icon: myIcon,
    zIndexOffset: 1500
  }).addTo(map)
  // What i probably want to do... store location in a dif variable than the icon, change that 

  // TODO: Add these circles for monsters on genereation
let circle = new L.Circle(center, 35, {color: 'red', display: 'none'}).addTo(map);

// console.log(icon._latlng.lat, icon._latlng.lng)

//Code for Generating Our Random Pokemon
let rando  = L.marker([51.50794, -0.15829]).addTo(map);
let randoCir = new L.Circle([51.50794, -0.15829], 35, {color: 'red', opacity: 0.001}).addTo(map)


//Building our Map
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//********************************Game Application Run*************************************/


document.addEventListener("keydown", movePlayer);


//********************************Player Movement Logic*************************************/

// Execute movement
function movePlayer(e) {
  switch (e.keyCode) {
  case 39: playerStep(right)
  break;
  case 37: playerStep(left)
  break;
  case 38: playerStep(up)
  break;
  case 40: playerStep(down)
  break;
  default: alert("Please press an arrow key");
}
}

// Step direction movement and boundary checks
function left() {
  if (leftBorder <= currentLongitude + borderBuffer) {
    horizontal -= 0.0005;
  }
}
function right() {
  if (rightBorder >= currentLongitude - borderBuffer) {
    horizontal += 0.0005;
  }
}
function up() {
  if (topBorder >= currentLatitude + borderBuffer) {
    vertical += 0.0005;
  }
}
function down() {
  if (bottomBorder <= currentLatitude - borderBuffer) {
  vertical -= 0.0005;
}
}

function playerStep(direction) {
  map.removeLayer(icon);
  map.removeLayer(circle);
  let newIcon;
  let newCircle;
  direction()
  center = [latitude + vertical, longitude + horizontal];
  currentLatitude = center[0]
  currentLongitude = center[1]
  newIcon = L.marker(center, {
    autoPan: true,
    autoPanSpeed: 10,
    icon: myIcon,
    zIndexOffset: 1000
  }).addTo(map)
  icon = newIcon;
  newCircle = new L.Circle(center, 35, {color: 'red', opacity: 0.001}).addTo(map)
  circle = newCircle;
  map.panTo(icon.getLatLng());

  // check for Codemon interaction
  initiateQuiz(checkIntersection())
}

// ******************************************Codemon Interaction Logic******************************

function checkIntersection() {
  let foundMonster = wildMonsters.find(monster => {
    return monster.monsterBorder.getBounds().intersects(circle.getBounds())
  })  
    return foundMonster
}

function initiateQuiz(monster) {
  if (monster) {
      // TODO: initiatePopup(monster)
      renderBattle(monster)
  }
}

quizContainer.addEventListener('click', function(e){
  if (e.target.dataset.correct === "true") {
    catchMonster(setMonster(e))
  } else if (e.target.dataset.correct === "false") {
    monsterFled(setMonster(e))
  }
})

// *****************************Code for Quiz***********************************************

function renderQuestion(monster) {
  const questionBox = document.createElement('div')
  // TODO: refactor to pull random question from this monsters question list after mvp
  questionBox.className = "question"
  questionBox.innerText = monster.questions[0].question_text
  quizContainer.appendChild(questionBox)
  questionBox.style.gridArea = "quizHeader"
}

function renderAnswer(answer) {
  const answerBox = document.createElement('div')
  answerBox.className = "answer"
  answerBox.dataset.letter = answer.letter
  answerBox.dataset.correct = answer.correct
  answerBox.innerText = answer.letter + ". " + answer.answer_text
  quizContainer.appendChild(answerBox)
  answerBox.style.gridArea = "question"+answer.letter
}

function renderBattle(monster) {
  // extend this to render the battle scene, pause other activity, render question, etc.
  quizContainer.dataset.monstername = monster.name
  renderQuestion(monster)
  monster.answers.forEach(renderAnswer)
}

// ********************************Interaction Outcome Logic*******************************
function setMonster(e) {
  selectedMonster = wildMonsters.find(monster => monster.name === e.target.parentNode.dataset.monstername)
  return selectedMonster
} 

function clearQuiz() {
  quizContainer.innerHTML = ""
}

function monsterFled(monster) {
  map.removeLayer(monster.monsterBorder);
  map.removeLayer(monster.marker);
  monster.monsterBorder = null
  wildMonsters.splice(wildMonsters.indexOf(monster),1)
  clearQuiz()
}

function catchMonster(monster) {
  ++caughtCode
  monster.caughtOrder = caughtCode
  caughtMonsters.push(monster)
  renderCodemonBelt(monster)
  map.removeLayer(monster.monsterBorder);
  map.removeLayer(monster.marker);
  monster.monsterBorder = null
  wildMonsters.splice(wildMonsters.indexOf(monster),1)
  clearQuiz()
}

// **********************************Successful Catch Functions**************************************

function renderCodemonBelt(monster) {
  renderNumber(monster)
  renderCaughtCodemonImg(monster)
  renderCaughtCodemonName(monster)
}

function renderNumber(monster) {
  const caughtNum = document.createElement('div')
  caughtNum.innerText = monster.caughtOrder
  caughtNum.className = "caught-num"
  codemonBelt.appendChild(caughtNum)
  caughtNum.style.gridArea = "codemon" + monster.caughtOrder + "Num"
}

function renderCaughtCodemonImg(monster) {
  const caughtImgDiv = document.createElement('div')
  const caughtImg = document.createElement('img')
  caughtImg.src = monster.image
  caughtImg.className = "caught-img"
  caughtImgDiv.appendChild(caughtImg)
  codemonBelt.appendChild(caughtImgDiv)
  caughtImgDiv.style.gridArea = "codemon" + monster.caughtOrder +  "Img"
}

function renderCaughtCodemonName(monster) {
  const caughtName = document.createElement('div')
  caughtName.innerText = monster.name
  caughtName.className = "caught-name"
  codemonBelt.appendChild(caughtName)
  caughtName.style.gridArea = "codemon" + monster.caughtOrder + "Name"
}


//---------------------------helper -------------------
// function to help us find longitude and latitude on our map
// function onMapClick(e) {
//   alert("You clicked the map at " + e.latlng);
// }
// map.on('click', onMapClick);


