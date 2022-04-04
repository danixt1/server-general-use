var misc = require("./misc");
var eventEmitter = require("events");
class Configurator extends eventEmitter{
    #configs  = [];
    #values = [];
    constructor(){
        super();
    };
    putConfig(obj){
        if(typeof obj != "object"){
            throw misc.generateError("invalid_type",[{},obj,"arg obj"]).message;
        }
        let name = obj.name;
        let type = obj.type;
        let on_active = obj.on_active;
    };
    putConfigs(obj){

    };
    set(config,value){

    };
    get(config){

    };
}
module.exports = Configurator