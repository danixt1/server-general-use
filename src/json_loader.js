function generateError(errorName,data){
    const newError = {error:errorName};
    let error = {};
    switch(errorName){
        case "not_equal":
            error = {
                property: data[0],
                expected: data[1],
                received: data[2],
                message: "property \""+getPropertyAddress(data[0]) + "\" receveid invalid value, expected "+data[1] +" receveid " +data[2]
            };
            break;
        case "invalid_property":
            error = {
                property: data[0],
                message: "Property name " + getPropertyAddress(data[0]) + " not is valid"
            }
            break;
    };
    return Object.assign(newError,error);
    function getPropertyAddress(arr){
        if(typeof arr === "string")
            return arr;
        let finalValue = "";
        for(const a in arr){
            finalValue+= arr[a];
            if(a+1 < arr.length){
                finalValue+=".";
            }
        };
        return finalValue;
    }
}
function putInObject(object,address,value){
    address = Array.isArray(address) ? address : [address];
    let putIn = address.pop();
    let actualPart = object;
    for(const a of address){
        if(actualPart[a] === undefined){
            actualPart[a] = {};
        }
        actualPart =  actualPart[a];
    }
    actualPart[putIn] = value;
};
module.exports = function(config,reader,throwCaseNotValidProp=false){
    const baseObject = {};
    if(typeof config != "object"){
        throw "Invalid config type, expected object receveid" + typeof config
    };
    check(config,reader);
    function check(config,reader,dep = []){
        const readerKeys = Object.keys(reader);
        for(const propName of readerKeys){
            const propConfig = config[propName];
            if(typeof propConfig != "object"){
                if(throwCaseNotValidProp){
                    throw generateError("invalid_property",[propName])
                };
                continue;
            }
            const valueReader = reader[propName];
            const expectedType = propConfig["type"];
            const auxFrom = propConfig["aux"] || "";
            const onActive = propConfig["on_active"] || function(){};

            if(auxFrom){
                const isDefined = reader[auxFrom] != undefined;
                if(isDefined){
                    continue;
                }
            }

            if(typeof expectedType == "string"){
                let valType = "unknown";
                switch(typeof valueReader){
                    case "number":
                        if(Number.isInteger(valueReader)){
                            valType = "int";
                        }else{
                            valType = "float"
                        }
                        break;
                    case "string":
                        valType = "string";
                        break;
                    case "boolean":
                        valType = "boolean"
                        break;
                    case "object":
                        if(Array.isArray(valueReader)){
                            valType = "array"
                        }else
                            valType = "object";
                        if(expectedType === "generic_object")
                            valType = expectedType;
                        break;
                };
                if(valType != expectedType){
                    dep.push(propName);
                    throw generateError("not_equal",[dep,expectedType,valType]);
                };
                if(!auxFrom){
                    putInObject(baseObject,dep.concat(propName),valueReader);
                }
                onActive(valueReader,baseObject);
            }else{
                if(typeof valueReader != "object"){
                    dep.push(propName);
                    throw generateError("not_equal",[dep,expectedType,typeof valueReader]);
                }
                const localDep = Object.assign([],dep);
                localDep.push(propName);
                check(config[propName].type,valueReader,localDep);
                if(!auxFrom){
                    putInObject(baseObject,dep.concat(propName),valueReader);
                }
                onActive(valueReader,baseObject);
            }
        }
    };
    return baseObject
}