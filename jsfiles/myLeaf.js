const codemonAdapter = adapter('http://localhost:3000/api/v1/monsters')

let caughtPoke = [];
//Map Border Values
let topBorder = 51.51175;
let bottomBorder = 51.50245;
let rightBorder = -0.15621;
let leftBorder = -0.18758;
let monsterAdapter = adapter('http://localhost:3000/api/v1/monsters')


//Start Point of Game
let latitude = 51.50789;
let longitude = -0.16825;
let center = [latitude, longitude];
let map = L.map('map', {drawControl: false}).setView(center, 15);

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
    zIndexOffset: 1000
  }).addTo(map)

let circle = new L.Circle(center, 35, {color: 'red', display: 'none'}).addTo(map);

// console.log(icon._latlng.lat, icon._latlng.lng)

//Code for Generating Our Random Pokemon
let rando  = L.marker([51.50794, -0.15829]).addTo(map);
let randoCir = new L.Circle([51.50794, -0.15829], 35, {color: 'red', opacity: 0.001}).addTo(map)


//Building our Map
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var options = {
  position: 'topright',
  draw: {
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#97009c'
      }
    },
    polyline: {
    	shapeOptions: {
        color: '#f357a1',
        weight: 10
          }
    },
    // disable toolbar item by setting it to false
    polyline: false,
    circle: true, // Turns off this drawing tool
    polygon: true,
    marker: true,
    rectangle: true,
  },
  edit: {
    featureGroup: editableLayers,
    edit: true,
    remove: true
  }
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
let drawControl = new L.Control.Draw(options);

let newImg = map.addControl(drawControl);

var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

map.on('draw:created', function(e) {
  let type = e.layerType,
    layer = e.layer;

  if (type === 'polyline') {
    layer.bindPopup('A polyline!');
  } else if ( type === 'polygon') {
  	layer.bindPopup('A polygon!');
  } else if (type === 'marker')
  {layer.bindPopup('marker!');}
  else if (type === 'circle')
  {layer.bindPopup('A circle!');}
   else if (type === 'rectangle')
  {layer.bindPopup('A rectangle!');}


  editableLayers.addLayer(layer);
});


//Event Listener for our player movement
//Need to refractor code!
(async () => {
  let monstersFromAPI = await monsterAdapter.getAll();
  // Create monsters
  
  // Render monsters
  monstersFromAPI.forEach(renderMonster);
  })();
  
  // Create monster icon(marker) and add to the map
  function renderMonster(monster) {
    // randomly generate monster location
    let newMonsterMarker = L.marker(generateMonsterLocation()).addTo(map)
    // randomly generate interaction border use .002 as starting distance attempt? How do I do this.... need to persist
    // an interaction border that interferes with movement and triggers the event

    // Associate marker with monster
    monster.marker = newMonsterMarker

    // Add icon from DB
  };
  
  function generateMonsterLocation() {
  // generate random gps within bounds *need numbers rather than variables for fixed* 
  const monsterLatitude = parseFloat((Math.random() * (51.51000 - 51.50245) + 51.50245).toFixed(7));
  const monsterLongitude = parseFloat((Math.random() * (-0.15621 + 0.18758) - 0.18758).toFixed(7));
  const monsterLocation = [monsterLatitude, monsterLongitude];
  return monsterLocation
  }

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
        if (circle.getBounds().intersects(randoCir.getBounds())) {
          rando.bindPopup('It is time to battle! RAWRRR!').openPopup();
          setTimeout(() => {
            map.closePopup();
          }, 5500)
          document.addEventListener('keydown', ansInput)
        }
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
        if (circle.getBounds().intersects(randoCir.getBounds())) {
          console.log('caught the random pokemon!!!')
          map.removeLayer(randoCir);
          map.removeLayer(rando);
        }
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
        if (circle.getBounds().intersects(randoCir.getBounds())) {
          console.log('caught the random pokemon!!!')
          map.removeLayer(randoCir);
          map.removeLayer(rando);
        }
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
        if (circle.getBounds().intersects(randoCir.getBounds())) {
          console.log('caught the random pokemon!!!')
          map.removeLayer(randoCir);
          map.removeLayer(rando);
        }
      } else {
      alert(warning);
      }
    }
  }
}

function ansInput (e) {
  if (e.keyCode === 65) {
    console.log('nice!')
    caughtPoke.push('codemon1');
    map.removeLayer(randoCir);
    map.removeLayer(rando);
    return true;
  }
}





//function to help us find longitude and latitude on our map
// function onMapClick(e) {
//   alert("You clicked the map at " + e.latlng);
// }
// map.on('click', onMapClick);
function onMapClick(e) {
  alert("You clicked the map at " + e.latlng);
}
map.on('click', onMapClick);



var latlngs = [
  [51.50803, -0.16849],
  [51.50805, -0.16785],
  [51.50762, -0.16829],
  [51.50803, -0.16849]
];
var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
// zoom the map to the polyline
map.fitBounds(polyline.getBounds());
