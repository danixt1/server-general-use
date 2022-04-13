var misc = require("./misc");
var isType = require("./types");
var eventEmitter = require("events");

class Configurator extends eventEmitter{
    #configs  = {};
    #values = {};
    #override = false;
    constructor(configs){
        super();
        if(configs)
            this.putConfig(configs);
    };
    putConfig(obj){
        if(typeof obj != "object"){
            throw misc.generateError("invalid_type",[{},obj,"arg obj"]);
        }
        if(Array.isArray(obj)){
            obj.forEach(value =>this.putConfig(value));
            return;
        };
        let name = obj.name;
        let type = obj.type || "any";
        let on_active = obj.on_active;
        let defaultValue = obj.def;
        let required = obj.required || false;
        if(this.#configs[name] && !this.#override){
            throw new SyntaxError("config '"+name+"' already been declared");
        };
        if(typeof on_active === "function"){
            this.on("change/"+name,on_active);
        }
        this.#configs[name] = {name,type,notStarted:required}
        if(defaultValue != undefined)
            this.set(name,defaultValue);
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
        let config = this.#configs[configName];
        if(!config){
            throw new ReferenceError(configName + " is not defined");
        }
        let type = config.type;
        if(!isType(type,value)){
            throw misc.generateError("invalid_type",[type,value,"set arg configName"]);
        }
        if(config.notStarted){
            config.notStarted = false;
        }
        this.#values[configName] = value;
        this.emit("change/"+configName,value);
        this.emit("change",configName,value);
    };
    get(configName){
        let config = this.#configs[configName];
        if(!config){
            throw new ReferenceError(configName + " is not defined");
        };
        if(config.notStarted){
            throw {name:"notInitialized",message:configName + " not started"};
        };
        return this.#values[configName];
    };
    exist =(config)=>typeof this.#configs[config] === "object";
    get notConfigured(){

    }
}

module.exports = Configurator