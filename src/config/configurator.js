var misc = require("./misc");
var eventEmitter = require("events");
class Configurator extends eventEmitter{
    #configs  = {};
    #values = {};
    #override = false;
    constructor(){
        super();
    };
    putConfig(obj){
        if(typeof obj != "object"){
            throw misc.generateError("invalid_type",[{},obj,"arg obj"]).message;
        }
        if(Array.isArray(obj)){
            obj.forEach(value =>this.putConfig(value));
        };
        let name = obj.name;
        let type = obj.type;
        let on_change = obj.on_change;
        let isSugar = obj.sugar;
        if(this.#configs[name] && !this.#override){
            throw "Config already registred"
        };
        
    };
    putObjectReader(obj){

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
    set(config,value){

    };
    get(config){

    };
}
function isTypesEqual(value1,value2){
    value1 = value1.toLowerCase();
    value2 = value2.toLowerCase();
    
};
function getType(value){
    const specialCases = {
        number:()=>{
            if(Number.isInteger(value)){
                return "int";
            }else{
                return "float";
            }
        },
        string:() =>{
            return "text"
        }
    };
    const genericType = typeof value;
    const special = specialCases[genericType];
    if(special){
        return special();
    }else{
        return genericType;
    }
}
new Configurator().putConfig([{},{name:"test"}]);
module.exports = Configurator