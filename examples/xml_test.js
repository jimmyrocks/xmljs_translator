var js2xml = require('../app'),
//xml = '<node type="good"><element><![CDATA[6]]></element><element>26</element><element>27</element><element>28</element></node>';

//xml = '<node id="267" visible="true"><tag k="name" v="test"></tag><tag k="operator" v="test"/></node>';

xml = '<osm><node user="jimmy" uid="1212"><tag k="fun" v="yes" /><tag k="building" v="yes" /></node></osm>';

console.log(JSON.stringify(js2xml.jsize(xml),null, 2));
//console.log(js2xml.xmlize(js2xml.jsize(xml)));


