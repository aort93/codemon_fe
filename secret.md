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
