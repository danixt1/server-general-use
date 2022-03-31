class Path{
	#pathArray;
	#path = "";
	constructor(pathItem){
		if(typeof pathItem === 'string'){
			this.#path = pathItem;
			this.#pathArray = pathItem.split(/[/.]/g);
		}else{
			for(let a = 0;a < pathItem.length;a++){
				this.#path += pathItem[a];
				if((a+1) < pathItem.length){
					this.#path+='.';
				}
			}
		}
		
	};
	get pathArray(){
		return this.#pathArray;
	};
	get path(){
		return this.#path;
	}
}
function generateError(errorName,arrData){
	var initial = {
		error:errorName,
	};
	var detail = {}
	switch(errorName){
		case "invalid_path":
			detail = {
				obj:arrData[0],
				path:arrData[1],
				property:arrData[2],
				value:arrData[3],
				message:"SERVER:<INVALID_PATH>: path \""+arrData[1]+"\" not found, invalid part: "+arrData[2] +
					" expected object sended "+ typeof arrData[3]
			}
		break;
	}
	return Object.assign(initial,detail)
}
function getValueInPath(fromObj,path,throwError = false){
	let actualPart = fromObj;
	path = path.pathArray
	for(var index = 0;index < path.length;index++){
		const propName = path[index];
		actualPart = actualPart[propName];
		if(typeof actualPart != "object" && index +1 < path.length){
			if(throwError){
				throw generateError("invalid_path",[fromObj,path,propName,actualPart]);
			};
			return actualPart;
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