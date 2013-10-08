var js2xml = require('../app');

var json = {osm: {
    names: 'fun',
    filler: [[1,2,3],[[4,7,8],5,6]],
    tags: [
      {'k': 'building', 'v': 'yes'},
      {'k': 'awesome', 'v': 'no'},
    ]
  }
};

console.log(JSON.stringify(js2xml.jsize(js2xml.xmlize(json)),null,2));
//console.log(js2xml.xmlize(json));


