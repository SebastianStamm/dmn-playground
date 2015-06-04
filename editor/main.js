/* jshint ignore:start */
'use strict';

var Moddle = require('moddle'),
    ModdleXML = require('moddle-xml'),
    dmnJSON = require('./dmn.json');

var xml =
'<?xml version="1.0" encoding="UTF-8"?>\
<Definitions id="def01" namespace="http://camunda.org/dmn/test01" xmlns="http://www.omg.org/spec/DMN/20130901" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:n1="http://brsilver.com/dmn" name="myDMN" xsi:schemaLocation="http://www.omg.org/spec/DMN/20130901 dmn.xsd">\
  <ItemDefinition id="item1" name="CustomerStatusType">\
    <typeDefinition>string</typeDefinition>\
    <allowedValue id="status01">\
      <text>gold</text>\
    </allowedValue>\
    <allowedValue id="status02">\
      <text>silver</text>\
    </allowedValue>\
    <allowedValue id="status03">\
      <text>bronze</text>\
    </allowedValue>\
  </ItemDefinition>\
  <ItemDefinition id="item2" name="OrderSumType">\
    <typeDefinition>number</typeDefinition>\
  </ItemDefinition>\
  <ItemDefinition id="item3" name="CheckResultType">\
    <typeDefinition>string</typeDefinition>\
    <allowedValue id="result01">\
      <text>ok</text>\
    </allowedValue>\
    <allowedValue id="result02">\
      <text>notok</text>\
    </allowedValue>\
  </ItemDefinition>\
  <ItemDefinition id="item4" name="ReasonType">\
    <typeDefinition>string</typeDefinition>\
  </ItemDefinition>\
  <Decision id="dec01" name="CheckOrder">\
    <DecisionTable id="dec01table" name="CheckOrder" isComplete="true" isConsistent="true" >\
      <clause name="Customer Status">\
        <inputExpression id="dec01-ix1" name="Status">\
          <itemDefinition href="#item1"/>\
        </inputExpression>\
        <inputEntry id="dec01-1-1">\
          <text>bronze</text>\
        </inputEntry>\
        <inputEntry id="dec01-1-2">\
          <text>silver</text>\
        </inputEntry>\
        <inputEntry id="dec01-1-3">\
          <text>gold</text>\
        </inputEntry>\
      </clause>\
      <clause name="Order Sum">\
        <inputExpression id="dec01-ix2" name="Sum">\
          <itemDefinition href="#item2"/>\
        </inputExpression>\
        <inputEntry id="dec01-2-1">\
          <text>&lt; 1000</text>\
        </inputEntry>\
        <inputEntry id="dec01-2-2">\
          <text>&gt;= 1000</text>\
        </inputEntry>\
      </clause>\
      <clause name="Check Result">\
        <outputDefinition href="#item3"/>\
        <outputEntry id="dec01-3-1">\
          <text>notok</text>\
        </outputEntry>\
        <outputEntry id="dec01-3-2">\
          <text>ok</text>\
        </outputEntry>\
      </clause>\
      <clause name="Reason">\
        <outputDefinition href="#item4"/>\
        <outputEntry id="dec01-4-1">\
          <text>work on your status first, as bronze you\'re not going to get anything</text>\
        </outputEntry>\
        <outputEntry id="dec01-4-2">\
          <text>you little fish will get what you want</text>\
        </outputEntry>\
        <outputEntry id="dec01-4-3">\
          <text>you took too much man, you took too much!</text>\
        </outputEntry>\
        <outputEntry id="dec01-4-4">\
          <text>you get anything you want</text>\
        </outputEntry>\
      </clause>\
      <rule>\
        <condition>dec01-1-1</condition>\
        <conclusion>dec01-3-1</conclusion>\
        <conclusion>dec01-4-1</conclusion>\
      </rule>\
      <rule>\
        <condition>dec01-1-2</condition>\
        <condition>dec01-2-1</condition>\
        <conclusion>dec01-3-2</conclusion>\
        <conclusion>dec01-4-2</conclusion>\
      </rule>\
      <rule>\
        <condition>dec01-1-2</condition>\
        <condition>dec01-2-2</condition>\
        <conclusion>dec01-3-1</conclusion>\
        <conclusion>dec01-4-3</conclusion>\
      </rule>\
      <rule>\
        <condition>dec01-1-3</condition>\
        <conclusion>dec01-3-2</conclusion>\
        <conclusion>dec01-4-4</conclusion>\
      </rule>\
    </DecisionTable>\
  </Decision>\
</Definitions>\
';

//console.log(xml);

var dmn = new Moddle([ dmnJSON ]);

var reader = new ModdleXML.Reader(dmn);
var rootHandler = reader.handler('Definitions');

reader.fromXML(xml, rootHandler, function(err, dmnModel, context) {

  if (err) {
    console.log('import error', err);
  } else {

    if (context.warnings.length) {
      console.log('import warnings', context.warnings);
    }

    console.log(dmnModel, context);


    // i have to reference the things and stuff
    var clauses = dmnModel.Decision[0].DecisionTable.clause
    for(var i = 0; i < clauses.length; i++) {
      if(clauses[i].inputExpression && clauses[i].inputExpression.itemDefinition) {
        clauses[i].inputExpression.itemDefinition.definition = context.elementsById[clauses[i].inputExpression.itemDefinition.href.substr(1)];
      } else if(clauses[i].outputDefinition) {
        clauses[i].outputDefinition.definition = context.elementsById[clauses[i].outputDefinition.href.substr(1)];
      }
    }

    console.log(dmnModel);

    var writer = new ModdleXML.Writer({format: true});

    var newxml = writer.toXML(dmnModel);

    console.log(newxml);

  }
});
/*
var taiga = cars.create('c:Car', { name: 'Taiga' });

console.log(taiga);

var cheapCar = cars.create('c:Car');

console.log(cheapCar.name);

cheapCar.get('similar').push(taiga);

var writer = new ModdleXML.Writer();

var xml = writer.toXML(taiga);

console.log(xml);

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
