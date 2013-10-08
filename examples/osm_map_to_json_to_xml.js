var libxmljs = require('libxmljs'),
js2xml = require('../app'),
http = require('http'),
options  = {'host': 'www.openstreetmap.org', 'port': '80', 'path': '/api/0.6/map?bbox=-104.9908447265625,39.73253798438173,-104.9853515625,39.73676229957947'};

// Utility function that downloads a URL and invokes
// callback with the data.
function download(options, callback) {
  http.get(options, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      console.log('downloading');
      data += chunk;
    });
    res.on("end", function() {
      console.log('download done');
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}

function convertData(data) {
//  console.log( js2xml.xmlize(js2xml.jsize(data)) );
  console.log( JSON.stringify(js2xml.jsize(data),null,2) );
}

console.log('starting...');
download(options, convertData);
