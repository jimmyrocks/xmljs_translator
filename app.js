var libxmljs = require("libxmljs"),
defaults = {
  'xmlRootElement': 'document',
  'textField': '_text',
  'arrayField': '_element',
  'cdataField': '_cdata',
  'breakOutSingleField': true,
  'alwaysUseRootElement': false
};

exports.xmlize = function (jsToConvert, options) {
  var outData = new libxmljs.Document(),
  buildNodes = function (inData, child) {
    var attributes,
    newData,
    currentSubKey;

    for (var key in inData) {
      attributes = {};
      for (var subKey in inData[key]) {
        currentSubKey = inData[key][subKey];

        // Hack to treat arrays as XML elements
        if( Object.prototype.toString.call( inData[key] ) === '[object Array]' ) {
          subKey = options.arrayField;
          if (typeof (currentSubKey) !== 'object') {
            currentSubKey = {};
            currentSubKey[options.textField] = currentSubKey;
          }
        }

        if (typeof currentSubKey === 'object') {
          // It's either a tag or an array of tags
          newData = {};
          if( Object.prototype.toString.call( currentSubKey ) === '[object Array]' ) {
            // It's an array of tags
            for (var index in currentSubKey) {
              if ( Object.prototype.toString.call( currentSubKey[index] ) === '[object Array]' || Object.prototype.toString.call( currentSubKey[index] ) === '[object String]') {
                // Array or text in an array
                newData[key] = {};
                newData[key][options.arrayField] = currentSubKey[index];
              } else {
                // Tags in an array
                newData[subKey] = currentSubKey[index];
              }
              buildNodes(newData, child.node(subKey));
            }
          } else {
            // Just a tag
            newData[subKey] = currentSubKey;
            buildNodes(newData, child.node(subKey));
          }
        } else {
          // It's something we're going to turn into a string
          newData = currentSubKey.toString();
          if (subKey === options.textField || subKey == options.cdataField || subKey == options.arrayField) {
            child.text(newData);
          } else {
            attributes[subKey] = currentSubKey;
          }
        }
      }
      child.attr(attributes);
    }
  };

  // Go through the options and assign them
  for (var option in defaults) {
    options = options ? options : {};
    options[option] = options[option] ? options[option] : defaults[option];
  }


  // Do some error checking on the input
  if (typeof jsToConvert === 'object') {
    if (Object.keys(jsToConvert).length > 1) {
      // If there's more than one object in the root level, we need to put it in a wrapper
      var newJsToConvert = {};
      newJsToConvert[options.xmlRootElement] = jsToConvert;
      jsToConvert = newJsToConvert;
    }
    for (var k in jsToConvert) {
      buildNodes(jsToConvert, outData.node(k));
    }
  } else {
    throw 'Type: ' + typeof(jsToConvert) + ' is not object';
  }

  return outData.toString();
};

exports.old_jsize = function (xmlToConvert, xmlRootElement, arrayEntities) {
  var outData = {},
  xmlData = libxmljs.parseXmlString(xmlToConvert),
  readNodes = function (inData) {
    var child = {};

    // Add in the attributes
    for (var attrIndex in inData.attrs()) {
      child[inData.attrs()[attrIndex].name()] = inData.attrs()[attrIndex].value();
    }

    // Add in the text fields

    // Add in the elements
    for (var elIndex in inData.childNodes()) {
      // Get the next node so we can work on it
      var newNode = readNodes(inData.childNodes()[elIndex]);
      // Make sure there's info in the node (xmlib will add blank text nodes)
      if(typeof(newNode) === 'object') {
        if (true){//(Object.keys(newNode).length > 0) {
          // If we don't already have this node, treat it like text
          if (inData.childNodes()[elIndex].name() === 'text') {
            child = inData.childNodes();
          } else {
            if (!child[inData.childNodes()[elIndex].name()]) {
              child[inData.childNodes()[elIndex].name()] = newNode;
            } else {
              // There are multiples of this node
              // If we already have this node, make an array out of it
              if( Object.prototype.toString.call( child[inData.childNodes()[elIndex].name()] ) !== '[object Array]' ) {
                child[inData.childNodes()[elIndex].name()] = [child[inData.childNodes()[elIndex].name()]];
              }
              // Push the new node to the array
              child[inData.childNodes()[elIndex].name()].push(newNode);
            }
          }
        } else {
          child = 'no children here';
        }
      } else {
      }
    }

    return child;
  };

  outData[xmlData.root().name()] = readNodes(xmlData.root());

  // If the user wants to 'unwrap' the data, this will do it
  if (options.xmlRootElement) {outData = outData[options.xmlRootElement];}

  return outData;
};

exports.jsize = function (xmlToConvert, options) {
  var outData = {},
  xmlData = libxmljs.parseXmlString(xmlToConvert),
  readNodes = function (inData) {
    var child = {},
    currentNode,
    currentAttribute,
    subNode;

    for (var attrIndex in inData.attrs()) {
      currentAttribute = inData.attrs()[attrIndex];
      child[currentAttribute.name()] = currentAttribute.value();
    }

    // First let's see what's in the incoming data
    for (var childIndex in inData.childNodes()) {
      currentNode = inData.childNodes()[childIndex];
      if (!currentNode.name() || currentNode.name() === 'text') {
        var dataField = currentNode.name() ? options.textField : options.cdataField;
        var newText = currentNode.text().replace('\n', '').trim();
        if (newText.length > 0) {
          child[dataField] = newText;
        }
      } else {
        var newNode = readNodes(currentNode);
        if (child[currentNode.name()]) {
          // We already have this node, it should be an array
          if( Object.prototype.toString.call( child[currentNode.name()] ) !== '[object Array]' ) {
            child[currentNode.name()] = [child[currentNode.name()]];
          }
          child[currentNode.name()].push(newNode);
        } else {
          if ( Object.prototype.toString.call( newNode ) === '[object Array]' ) {
            // If the first thing in is an array, then we're also going to need to make the child and array
            child[currentNode.name()] = [newNode];
          } else {
            child[currentNode.name()] = newNode;
          }
        }
      }
    }

    // Take care of the options
    if (options.breakOutSingleField) {
      if (typeof(child) === 'object' && Object.keys(child).length === 1 && child[options.textField]) {
        child = child[options.textField];
      }
      if (typeof(child) === 'object' && Object.keys(child).length === 1 && child[options.cdataField]) {
        child = child[options.cdataField];
      }
      if (typeof(child) === 'object' && Object.keys(child).length === 1 && child[options.arrayField]) {
        child = child[options.arrayField];
      }
    }
    return child;
  };

  // Go through the options and assign them
  for (var option in defaults) {
    options = options ? options : {};
    options[option] = options[option] ? options[option] : defaults[option];
  }
  // Read the data
  outData[xmlData.root().name()] = readNodes(xmlData.root());

  // If the user wants to 'unwrap' the data, this will do it
  if (options.xmlRootElement && outData[options.xmlRootElement]) {outData = outData[options.xmlRootElement];}

  // Return the data to the user
  return outData;
};
