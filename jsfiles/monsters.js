//Event Listener for our player movement
//Need to refractor code!
var MonsterIcon = L.Icon.extend({
    options: {
        iconSize:     [50, 50]
    }
});

// var greenIcon = new LeafIcon({iconUrl: 'leaf-green.png'}),
//     redIcon = new LeafIcon({iconUrl: 'leaf-red.png'}),
//     orangeIcon = new LeafIcon({iconUrl: 'leaf-orange.png'});


(async () => {
    monstersFromAPI = await monsterAdapter.getAll();
    // Create monsters
  
    // Render monsters
    monstersFromAPI.forEach(renderMonster);
    })();
  


    // Create monster icon(marker) and add to the map
    function renderMonster(monster) {
      // randomly generate monster location
      console.log(monster.image)
      const monsterIcon = new MonsterIcon({iconUrl: monster.image});
      console.log(monsterIcon)
      const newMonsterMarker = L.marker(generateMonsterLocation(), {icon: monsterIcon}).addTo(map).bindPopup(monster.name + ": " + monster.phrase)
      
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
    const monsterBoundary = new L.Circle(monsterLocation, 75, {color: 'red', opacity: 0.001}).addTo(map)
    monsterBoundaries.push(monsterBoundary)
    return monsterLocation
    }