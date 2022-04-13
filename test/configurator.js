//const configurator = require('../src/config/configurator.js');
const ZONE = "config";
const LOC = "../src/config"
const misc = require("../src/config/misc")
const Configurator = require("../src/config/configurator")
var assert = require('assert');
describe(ZONE+"/misc",function(){
	describe("Class Path",function(){
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
	describe("getValueInPath()",function(){
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
	});
});
describe(ZONE+"/types",function(){
	const ops = require('../src/config/const');
	const typer = require('../src/config/types');
	
	const validValues ={
		ANY:undefined,
		ARRAY:[],
		FLOAT:1.23,
		GENERIC_OBJECT:{},
		INT:23,
		TEXT:""
	};
	const validKeys = Object.keys(validValues);
	
	it("test is up to data",function(){
		const opsKey = Object.keys(ops);
		const fails = [];
		for(const key of opsKey){
			if(!validKeys.includes(key)){
				fails.push(key);
			}
		};
		if(fails.length > 0){
			assert.ok(false,"test not defined to:"+fails.toString());
		}else{
			assert.ok(true);
		}
		
	});
	it("return true for all options",function(){
		const fails = [];
		for(const key of validKeys){
			const selectedType = ops[key];
			if(!typer(selectedType[0],validValues[key])){
				fails.push(selectedType[0]);
			};
		};
		assert.ok(fails.length === 0,"returned false to:"+fails.toString());
	});
});
describe(ZONE+"/configurator",function(){
	let config;
	let defConfig;
	this.beforeEach(function(){
		config = new Configurator();
		defConfig = {name:"test",type:"string"}
	});
	it("set and return value",function(){
		config.putConfig(defConfig);
		config.set("test","testing");
		assert.strictEqual(config.get("test"),"testing");
	});
	describe("get()",function(){
		it("Throw case config not exist",function(){
			assert.throws(function(){
				config.get("test");
			})
		},{
			name:"ReferenceError"
		});
		it("Throw case required option is on, and called get() before set()",function(){
			assert.throws(()=>{
				defConfig.required = true;
				config.putConfig(defConfig);
				config.get("test");
			},{name:"notInitialized"})
		});
		it("Not throw with assigned value in property with required",function(){
			assert.doesNotThrow(()=>{
				defConfig.required = true;
				config.putConfig(defConfig);
				config.set("test","testing");
				config.get("test");
			})
		});
	});
	describe("set()",function(){
		it("Throw case config not exist",function(){
			assert.throws(()=>{
				config.set("test");
			},{
				name:"ReferenceError"
			})
		});
		it("Throw case type is invalid",function(){
			assert.throws(()=>{
				config.putConfig(defConfig);
				config.set("test",22);
			},{
				name:"invalid_type"
			})
		});
		it("Event change activated",function(){
			config.putConfig(defConfig);
			config.on("change/test",(a,b)=>{
				assert.ok(true);
			})
		});
	});
	describe("putConfig()",function(){
		it("Return default value",function(){
			defConfig.def = "testing";
			config.putConfig(defConfig);
			assert.strictEqual(config.get("test"),"testing");
		});
		it("Throw with incompatible default value",function(){
			assert.throws(function(){
				defConfig.def = 12;
				config.putConfig(defConfig);
			},misc.generateError("invalid_type",["string",12,"set arg configName"]))
		});
		it("Throw on overriding configuration",function(){
			assert.throws(function(){
				for(let a =0;a < 2;a++){
					config.putConfig(defConfig);
				};
			},{name:"SyntaxError"});
		});
	});
});
