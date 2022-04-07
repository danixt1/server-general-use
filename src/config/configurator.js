var misc = require("./misc");
var isType = require("./types");
var eventEmitter = require("events");

class Configurator extends eventEmitter{
    #configs  = {};
    #values = {};
    #override = false;
    #container = {};
    constructor(){
        super();
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
        let on_active = obj.on_active || function(){};
        let def = obj.def;
        if(this.#configs[name] && !this.#override){
            throw "Config already registred"
        };
        this.#configs[name] = {name,type,on_active,def}
        if(def != undefined)
            this.set(name,def);
    };
    readJson(obj){
    };
    getConfig(configName){
        if(!this.#configs[configName]){
            return false;
        }
        return Object.assign({},this.#configs[configName]);
    };
    get override(){
        return this.#override;
    };
    set override(value){
        if(typeof value === "boolean"){
            this.#override = value;
        }else{
            throw misc.generateError("invalid_type",[true,value,"arg value"]);
        }
    }
    set(configName,value){
        let config = this.#configs[configName];
        if(!config){
            throw "invalid config";
        }
        let type = config.type;
        if(isType(type,value)){
            this.#values[configName] = value;
        }
    };
    get(config){
        return this.#values[config];
    };
}

new Configurator().putConfig([{},{name:"test"}]);
module.exports = Configurator