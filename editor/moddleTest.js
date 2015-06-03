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
        { "name": "cars", "type": "Car", "isMany": true },
        { "name": "moreCars", "type": "Car", "isMany": true, 'isReference': true }

      ]
    },
    {
      "name": "Car",
      "superClass": [ "Base" ],
      "properties": [
        { "name": "name", "type": "String", "isAttr": true, "default": "No Name" }
      ]
    },
    {
      "name": "Car2",
      "superClass": [ "Car" ],
      "properties": [
        { "name": "power", "type": "Integer", "isAttr": true },
        { "name": "similar", "type": "Car", "isMany": true, "isReference": true }
      ]
    }
  ]
};


var model = new Moddle([ dmnJSON ]);
/*
var t = dmn.create('dmn:Test');
var r = dmn.create('dmn:Definitions', { name : t });

console.log(r);

var writer = new ModdleXML.Writer();

var xml = writer.toXML(r);

console.log(xml);
*/


var taiga = model.create('my:Car', { name: 'Taiga' });

console.log(taiga);
// { $type: 'c:Car', name: 'Taiga' };
var cars = model.create('my:Root', { moreCars: [taiga] });

var options = { format: false, preamble: false };
var writer = new ModdleXML.Writer(options);

var xml = writer.toXML(cars);

console.log(xml);
/*
var reader = new ModdleXML.Reader(dmn);
var rootHandler = reader.handler('dmn:Definitions');

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

*/
