var libxmljs = require('libxmljs'),
js2xml = require('../app'),
http = require('http'),
options  = {'host': 'sampleserver1.arcgisonline.com', 'port': '80', 'path': '/ArcGIS/rest/services/TaxParcel/TaxParcelQuery/MapServer?f=json'};

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
  console.log( JSON.stringify(js2xml.jsize(js2xml.xmlize(JSON.parse(data))), null, 2));
}

download(options, convertData);
