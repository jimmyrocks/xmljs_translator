var js2xml = require('../app');

var json = {
  "group1": {
    "data": [["1","2"],"3"],
    "fields": [{'k': 'a', 'v': 'b'}]
  }
};

console.log(JSON.stringify(js2xml.jsize(js2xml.xmlize(json)),null,2));
//console.log(js2xml.xmlize(json));


