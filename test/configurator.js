//const configurator = require('../src/config/configurator.js');
const misc = require('../src/config/misc.js')
var assert = require('assert');
describe("Class Path",function(){
	it("correct array with string arg",function(){
		var path = "teste.subPart.otherSub";
		var Path =new misc.Path(path);
		assert.strictEqual(Path.pathArray.toString(),["teste","subPart","otherSub"].toString())
	});
	it("correct string with array arg",function(){
		var path = ["teste","subPart","otherSub"];
		var Path =new misc.Path(path);
		assert.strictEqual(Path.path,"teste.subPart.otherSub");
	})
})