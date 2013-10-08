var js2xml = require('../app'),
geoJson = require('./sample_geojson.json');

console.log(JSON.stringify(js2xml.jsize(js2xml.xmlize(geoJson)),null, 2));
//console.log(js2xml.xmlize(geoJson));


