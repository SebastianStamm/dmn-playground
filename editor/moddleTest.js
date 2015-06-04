/* jshint node:true */

'use strict';

var Moddle = require('moddle'),
    ModdleXML = require('moddle-xml');

var dmnJSON = {
  "name": "Cars",
  "uri": "http://cars",
  "prefix": "my",
  "types": [
    {
      "name": "Base",
      "properties": [
        { "name": "id", "type": "String", "isAttr": true }
      ]
    },
    {
      "name": "Root",
      "superClass": [ "Base" ],
      "properties": [
        { "name": "cars", "type": "Car", "isMany": true }
      ]
    },
    {
      "name": "Car",
      "superClass": [ "Base" ],
      "properties": [
        { "name": "name", "type": "String", "isAttr": true, "default": "No Name" },
        { "name": "power", "type": "Integer", "isAttr": true },
      ]
    }
  ]
};


var model = new Moddle([ dmnJSON ]);

var cars = model.create('my:Root');
cars.get('cars').push(model.create('my:Car', { power: 10 }));

var options = { format: false, preamble: false };
var writer = new ModdleXML.Writer(options);

var xml = writer.toXML(cars);

console.log(xml);

var reader = new ModdleXML.Reader(dmnJSON);
var rootHandler = reader.handler('my:Root');

reader.fromXML(xml, rootHandler, function(err, cars, context) {

  if (err) {
    console.log('import error', err);
  } else {

    if (context.warnings.length) {
      console.log('import warnings', context.warnings);
    }

    console.log(cars);

  }
});
