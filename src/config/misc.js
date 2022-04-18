class Path{
	#pathArray;
	#path = "";
	constructor(pathItem){
		if(typeof pathItem === 'string'){
			this.#path = pathItem;
			this.#pathArray = pathItem.split(/[/.]/g);
		}else{
			if(!Array.isArray(pathItem)){
				throw generateError("invalid_type",["string | array<string>",pathItem,"arg pathItem"]);
			}
			this.#pathArray = [...pathItem];
			this.#path = this.#pathArray.join(".");
		}
		
	};
	get pathArray(){
		return this.#pathArray;
	};
	get path(){
		return this.#path;
	};
	searchPath(fromObj,throwError = false){
		return getValueInPath(fromObj,this,throwError);
	}
}
function generateError(errorName,arrData = []){
	var initial = {
		name:errorName,
	};
	var detail = {}
	switch(errorName){
		case "invalid_path":
			detail = {
				obj:arrData[0],
				path:arrData[1],
				property:arrData[2],
				value:arrData[3],
				message:"path \""+arrData[1]+"\" not found, invalid part: "+arrData[2] +
					" expected object sended "+ typeof arrData[3]
			}
		break;
		case "unknown":
			detail = {
				message:"unexpected error ocurred",
				data:arrData
			}
			break;
		case "invalid_type":
			let expType =typeof arrData[0];
			let returned = typeof arrData[1];
			let propertyName = arrData[2];
			detail = {
				message:`invalid type in ${propertyName} expected:${expType} returned:${returned}`,
				expected:expType,
				returned:returned,
				variable:propertyName
			}
			break;
	}
	return Object.assign(initial,detail)
}
function getValueInPath(fromObj,path,throwError = false){
	let actualPart = fromObj;
	path = path.pathArray;
	for(var index = 0;index < path.length;index++){
		const propName = path[index];
		actualPart = actualPart[propName];
		if(typeof actualPart != "object" && index +1 < path.length){
			if(throwError){
				throw generateError("invalid_path",[fromObj,path,propName,actualPart]);
			};
			return undefined;
		};
		if(index+1 == path.length){
			return actualPart;
		}
	}
}
module.exports = {
	Path,
	generateError,
	getValueInPath
}