//Map Border Values
let topBorder = 51.51175;
let bottomBorder = 51.50245;
let rightBorder = -0.15621;
let leftBorder = -0.18758;
let monsterAdapter = adapter('http://localhost:3000/api/v1/monsters')
let monstersFromAPI;
let caughtCode = [];
let monsterBoundaries = [];

// DOM Variables
let quizContainer = document.getElementById('quiz-container')


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
            border.bindPopup(`${monster.name} : ${monster.phrase}`).openPopup();
            setTimeout(() => {
              map.closePopup();
            }, 5500)
            document.addEventListener('keydown', ansInput)
          }
        })

      } else {
          alert(warning);
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
            border.bindPopup(`${monster.name} : ${monster.phrase}`).openPopup();
            setTimeout(() => {
              map.closePopup();
            }, 5500)
            document.addEventListener('keydown', ansInput)
          }
        })
      } else {
      alert(warning);
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
            border.bindPopup(`${monster.name} : ${monster.phrase}`).openPopup();
            setTimeout(() => {
              map.closePopup();
            }, 5500)
            document.addEventListener('keydown', ansInput)
          }
        })
      } else {
        alert(warning);
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
            border.bindPopup(`${monster.name} : ${monster.phrase}`).openPopup();
            setTimeout(() => {
              map.closePopup();
            }, 5500)
            document.addEventListener('keydown', ansInput)
          }
        })
      } else {
      alert(warning);
      }
    }
  }
}

function ansInput (e) {
  if (e.keyCode === 65) {
    console.log('nice!')
    if (!caughtCode.includes('codemon1')) {
      caughtCode.push('codemon1');
      document.getElementById('caught-poke').innerHTML += `<li>hi</li>`
    }
    map.removeLayer(randoCir);
    map.removeLayer(rando);
  }
}

document.addEventListener('click', e => {
  console.log(monstersFromAPI[0])
  console.log(monstersFromAPI[0].questions[0])
  renderQuiz(monstersFromAPI[0])
})


//function to help us find longitude and latitude on our map
// function onMapClick(e) {
//   alert("You clicked the map at " + e.latlng);
// }
// map.on('click', onMapClick);

// *****************Code for Quiz***************************** Refactor out interaction logic, quiz logic etc.
function renderQuiz(monster) {
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

