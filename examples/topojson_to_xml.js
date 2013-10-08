var libxmljs = require('libxmljs'),
js2xml = require('../app'),
http = require('https'),
options  = {'host': 'raw.github.com', 'port': '443', 'path': '/mbostock/topojson/master/examples/us-10m.json'};

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
  console.log( js2xml.xmlize(JSON.parse(data)) );
}

download(options, convertData);
