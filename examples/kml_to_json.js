var libxmljs = require('libxmljs'),
js2xml = require('../app'),
http = require('http'),
options  = {'host': 'www.cityofmesquite.com', 'port': '80', 'path': '/gis/KML/Fire_Stations.kml'};

// Utility function that downloads a URL and invokes
// callback with the data.
function download(options, callback) {
  http.get(options, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}

function convertData(data) {
  console.log( JSON.stringify(js2xml.jsize(data), null, 2) );
}

download(options, convertData);
