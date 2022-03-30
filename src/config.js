//const cmd = require("inquirer");
//const def = require("optionator");

const object_loader = require("./json_loader");
const defaultConfig = {
    ports:{
        local:8000,
        lan:8000,
    },
    auto_connect:false,
    confirm_update:true
};
/**
 * @type {object_loader.configList}
 */
const defineProperty = {
    port:{
        type:"int",
        aux:"ports",
        on_active:function(value,options){
            options.ports = {
                local:value,
                lan:value
            }
        }
    },
    ports:{
        type:{
            local:{
                type:"int"
            },
            lan:{
                type:"int"
            }
        }
    },
    auto_connect:{
        type:"boolean"
    },
    confirm_update:{
        type:"boolean"
    }
}
let configsInJson = require("../server-config.json");
let newConfig = Object.create(defaultConfig);
newConfig = Object.assign(configsInJson,newConfig);
newConfig = object_loader(defineProperty,newConfig,true);
console.log(newConfig);
try{
    try{
    }catch(e){
        throw e;
    }
    //module.exports = object_loader(defineProperty,newConfig)
}catch{
    module.exports = Object.create(defaultConfig);
}