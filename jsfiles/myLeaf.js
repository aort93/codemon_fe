//Map Border Values
let topBorder = 51.51175;
let bottomBorder = 51.50245;
let rightBorder = -0.15621;
let leftBorder = -0.18758;
let monsterAdapter = adapter('http://localhost:3000/api/v1/monsters')
let monstersFromAPI;
let caughtCode = [];
let monsterBoundaries = [];
const foundPokecount = 0;

// DOM Variables
let quizContainer = document.getElementById('quiz-container')
let codemonBelt = document.getElementById('codemon-belt')


//Start Point of Game
let latitude = 51.50789;
let longitude = -0.16825;
let center = [latitude, longitude];
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


document.addEventListener("keydown", keyDownHandler);
function keyDownHandler(e) {
  //Check to see that user only clicks arrow key
  if (keyCodes.includes(e.keyCode)) {
  map.removeLayer(icon);
  map.removeLayer(circle);
  let newIcon;
  let newCircle;
    //right arrow logic
    if(e.keyCode === 39) {
      if (rightBorder - 0.0006 >= icon._latlng.lng) {
        horizontal += 0.0005;
        center = [latitude + vertical, longitude + horizontal];
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

        monstersFromAPI.forEach(monster => {
          let border = monster.monsterBorder;
          if (circle.getBounds().intersects(border.getBounds())) {
            border.bindPopup(`${monster.name} : ${monster.phrase}`).openPopup()
            setTimeout(() => {
              map.closePopup();
            }, 500)
            renderBattle(monster)
            alert(`Now's my chance to catch ${monster.name}!`)
            quizContainer.addEventListener('click', function(e){
              if (e.target.dataset.correct === "true") {
                alert(`I caught ${monster.name}!`)
                catchMonster(monster)
              } else {
                alert(`${monster.name} ran away!`)
                monsterFled(monster)
              }
              clearQuiz()
            })
          }
        })

      } else {
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
          newIcon.bindPopup(warning).openPopup();
          setTimeout( () => {
            map.closePopup()
          }, 2000)
      }
    }

    //left arrow logic
    if(e.keyCode == 37) {
      if (leftBorder + 0.0006 <= icon._latlng.lng) {
        horizontal -= 0.0005
        center = [latitude + vertical, longitude + horizontal];
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

        monstersFromAPI.forEach(monster => {
          let border = monster.monsterBorder;
          if (circle.getBounds().intersects(border.getBounds())) {
            border.bindPopup(`${monster.name} : ${monster.phrase}`).openPopup()
            setTimeout(() => {
              map.closePopup();
            }, 500)
            renderBattle(monster)
            alert(`Now's my chance to catch ${monster.name}!`)
            quizContainer.addEventListener('click', function(e){
              if (e.target.dataset.correct === "true") {
                alert(`I caught ${monster.name}!`)
                catchMonster(monster)
              } else {
                alert(`${monster.name} ran away!`)
                monsterFled(monster)
              }
              clearQuiz()
            })
          }
        })
      } else {
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
          newIcon.bindPopup(warning).openPopup();
          setTimeout( () => {
            map.closePopup()
          }, 2000)
      }
    }

    //Up arrow key logic
    if(e.keyCode == 38) {
      if (topBorder - 0.0006 >= icon._latlng.lat) {
        vertical += 0.0005;
        center = [latitude + vertical, longitude + horizontal];
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

        monstersFromAPI.forEach(monster => {
          let border = monster.monsterBorder;
          if (circle.getBounds().intersects(border.getBounds())) {
            border.bindPopup(`${monster.name} : ${monster.phrase}`).openPopup()
            setTimeout(() => {
              map.closePopup();
            }, 500)
            renderBattle(monster)
            alert(`Now's my chance to catch ${monster.name}!`)
            quizContainer.addEventListener('click', function(e){
              if (e.target.dataset.correct === "true") {
                alert(`I caught ${monster.name}!`)
                catchMonster(monster)
              } else {
                alert(`${monster.name} ran away!`)
                monsterFled(monster)
              }
              clearQuiz()
            })
          }
        })
      } else {
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
          newIcon.bindPopup(warning).openPopup();
          setTimeout( () => {
            map.closePopup()
          }, 2000)
      }
    }

    //Down Arrow Key logic
    if(e.keyCode == 40) {
      if (bottomBorder + 0.0006 <= icon._latlng.lat) {
        vertical -= 0.0005
        center = [latitude + vertical, longitude + horizontal];
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

        monstersFromAPI.forEach(monster => {
          let border = monster.monsterBorder;
          if (circle.getBounds().intersects(border.getBounds())) {
            border.bindPopup(`${monster.name} : ${monster.phrase}`).openPopup()
            setTimeout(() => {
              map.closePopup();
            }, 500)
            renderBattle(monster)
            alert(`Now's my chance to catch ${monster.name}!`)
            quizContainer.addEventListener('click', function(e){
              if (e.target.dataset.correct === "true") {
                alert(`I caught ${monster.name}!`)
                catchMonster(monster)
              } else {
                alert(`${monster.name} ran away!`)
                monsterFled(monster)
              }
              clearQuiz()
            })
          }
        })
      } else {
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
          newIcon.bindPopup(warning).openPopup();
          setTimeout( () => {
            map.closePopup()
          }, 2000)
      }
    }
  }
}

function clearQuiz() {
  quizContainer.innerHTML = ""
}

function monsterFled(monster) {
  map.removeLayer(monster.monsterBorder);
  map.removeLayer(monster.marker);
}

// TODO: Update to grid, populate grid with images and monster names
function catchMonster(monster) {
  if (!caughtCode.includes(monster.name)) {
    caughtCode.push(monster.name);
    monster.caughtOrder = caughtCode.indexOf(monster.name) + 1
    console.log(monster)
    console.log(monster.caughtOrder)
    renderCodemonBelt(monster)
  }

  map.removeLayer(monster.monsterBorder);
  map.removeLayer(monster.marker);
}



//function to help us find longitude and latitude on our map
// function onMapClick(e) {
//   alert("You clicked the map at " + e.latlng);
// }
// map.on('click', onMapClick);

// *****************Code for Quiz***************************** Refactor out interaction logic, quiz logic etc.
function renderCodemonBelt(monster) {
  renderNumber(monster)
  renderCaughtCodemonImg(monster)
  renderCaughtCodemonName(monster)
}

function renderNumber(monster) {
  const caughtNum = document.createElement('div')
  caughtNum.innerText = 1
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


function renderBattle(monster) {
  // extend this to render the battle scene, pause other activity, render question, etc.
  renderQuestion(monster)
  monster.answers.forEach(renderAnswer)
}

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
