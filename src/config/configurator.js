var misc = require("./misc");
var isType = require("./types");
var eventEmitter = require("events");
const Sname = Symbol("name"),
Stype = Symbol("type"),
SnotStarted = Symbol("notStarted"),
Sprevious = Symbol("previous");

class Configurator extends eventEmitter{
    #configs  = {
        [Sname]:"main"
    };
    #required = [];
    #values = {};
    #override = false;
    constructor(configs){
        super();
        if(configs)
            this.putConfig(configs);
    };
    putConfig(config,pathConfig){
        let validatorObject = validator.call(this,config);
        if(validatorObject.state === 2)
            return;
        if(validatorObject.state === 1){
            throw validatorObject.error;
        };
        if(pathConfig === undefined){
            generateConfig.call(this,config);
        }else{
            let path =new misc.Path(pathConfig);
            let obj = path.searchPath(this.#configs,true);
            generateConfig.call(this,config,obj);
        }
        function generateConfig(obj,putIn){
            let name = obj.name;           
            let type = obj.type || "any";
            let on_active = obj.on_active;
            let defaultValue = obj.def;
            let required = obj.required || false;
            if(!putIn)
                putIn = this.#configs;
            if(typeof on_active === "function"){
                this.on("change/"+name,on_active);
            }
            const finalObj = {[Sname]:name,[Stype]:type,[SnotStarted]:required,[Sprevious]:putIn};
            putIn[name] = finalObj;
            if(required){
                this.#required.push(name);
            }
            if(defaultValue != undefined)
                this.set(name,defaultValue);

        };
        function validator(obj){
            if(typeof obj != "object"){
                return{state:1,error:misc.generateError("invalid_type",[{},obj,"arg obj"])}
            }
            if(Array.isArray(obj)){
                obj.forEach(value =>this.putConfig(value));
                return {state:2};
            };
            if(this.#configs[obj.name] && !this.#override){
                return {state:1,error: new SyntaxError("config '"+obj.name+"' already been declared")};
            };
            if(obj.name === undefined){
                return {state:1,error:misc.generateError("invalid_type",["",obj,"prop name"])};
            }
            return {state:0};
        };
    };
    readAndSetObj(obj){
        for(const key of obj){
            this.set(key,obj[key]);
        };
    };
    get allowOverride(){
        return this.#override;
    };
    set allowOverride(value){
        if(typeof value === "boolean"){
            this.#override = value;
        }else{
            throw misc.generateError("invalid_type",[true,value,"arg value"]);
        }
    }
    set(configName,value){
        let path = new misc.Path(configName);
        const pathString = path.path;
        let config = path.searchPath(this.#configs,false);
        if(!config){
            throw new ReferenceError(configName + " is not defined");
        }
        let type = config[Stype];
        if(!isType(type,value) && value != null){
            throw misc.generateError("invalid_type",[type,value,"set arg configName"]);
        }
        if(config[SnotStarted]){
            config[SnotStarted] = false;
        }
        this.#values[pathString] = value;
        this.emit("change/"+pathString,value);
        this.emit("change",pathString,value);
    };
    get(configName){
        let config = this.#configs[configName];
        if(!config){
            throw new ReferenceError(configName + " is not defined");
        };
        if(config[SnotStarted]){
            throw {name:"notInitialized",message:configName + " not started"};
        };
        return this.#values[configName];
    };
    exist =(config)=>typeof this.#configs[config] === "object";
    get notConfigured(){
        const list = [];
        for(const configName of this.#required){
            if(this.#values[configName] != undefined){
                list.push(configName);
            };
        };
        return list;
    }
}

module.exports = Configurator