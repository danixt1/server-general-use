//const configurator = require('../src/config/configurator.js');
const misc = require('../src/config/misc.js')
var assert = require('assert');
describe("Class Path:misc.js",function(){
	it("correct array with string arg",function(){
		var path = "teste.subPart.otherSub";
		var Path =new misc.Path(path);
		assert.strictEqual(Path.pathArray.toString(),["teste","subPart","otherSub"].toString(),"Array");
	});
	it("correct string with array arg",function(){
		var path = ["teste","subPart","otherSub"];
		var Path =new misc.Path(path);
		assert.strictEqual(Path.path,"teste.subPart.otherSub","String");
	})
});
describe("func getValueInPath",function(){
	let testObj = {
		part1:{
			part2:{
				catchThis:"catch"
			}
		}
	}
	it("get value in property",function(){
		let path = new misc.Path(["part1","part2","catchThis"]);
		let returnedValue = misc.getValueInPath(testObj,path);
		assert.ok(returnedValue === "catch");
	});
	it("return undefined case path not exist",function(){
		let path = new misc.Path(["part1","part2","catchThis","other"]);
		let returnedValue = misc.getValueInPath(testObj,path);
		assert.ok(returnedValue === undefined);
	});
})