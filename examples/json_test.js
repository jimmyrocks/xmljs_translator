var js2xml = require('../app');

var json = {osm: {
    name: 'fun',
    fill: [
      {k: 'building', v: 'yes'},
      {k: 'color', v: 'green'},
      {k: 'border', v: 'thick'}
    ],
    coords: [
      [
      [0,1],
      [5,6]
    ],
    [
      [25,26],
      [32,35]
    ]
    ]
  }
};

//console.log(js2xml.xmlize(json));
console.log(JSON.stringify(js2xml.jsize(js2xml.xmlize(json)),null, 2));


