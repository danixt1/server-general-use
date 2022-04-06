const {
    ANY,ARRAY,FLOAT,GENERIC_OBJECT,INT,TEXT
} = require("./const.js")
const CheckType = [
    [INT,(value)=>Number.isInteger(value)],
    [FLOAT,(value)=>typeof value === "number" && !Number.isInteger(value)],
    [TEXT,(value) =>typeof value === "string"],
    [ANY,()=>true],
    [GENERIC_OBJECT,(value) =>typeof value === "object"],
    [ARRAY,(value) => Array.isArray(value)]
];
const checks = {};
CheckType.forEach(value =>{
    const func = value[1];
    value[0].forEach(value2 =>{
        checks[value2] = func;
    });
});
function isType(type,value){
    const validator = checks[type];
    if(!validator){
        if(typeof value === type){
            return true;
        };
        return false;
    }else{
        return validator(value);
    };
};
module.exports = isType