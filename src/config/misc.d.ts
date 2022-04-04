/**
	Used to store the path value in string and array
*/
export declare class Path {
	private #patharray:Array<string>
	private #path:string
	/**
	 * sugar call for {@link getValueInPath getValueInPath()}
	 */
	searchPath(fromObj:any,throwError:boolean):any
	constructor(path:string | Array<string>)
	readonly pathArray:Array<string>
	readonly path:string
}
export declare function generateError(errorName:"unknown",arrData:Array<any>):{error:"unknown",message:string,data:Array<any>}
export declare function generateError(errorName:"invalid_path",arrData:[obj:any,property:string,value:any]):{
	error:"invalid_path",message:string,obj:any,property:string,value:any
}
export declare function generateError(errorName:"invalid_type",arrData:[expected:any,returned:any,variable:string]):{
	error:"invalid_type",message:string,expected:any,returned:any,variable:string
}
/**
 * search in object and return the value in path
 * @param fromObj Object To search the index
 * @param path Path object with path
 * @param throwError if true, if path is not found throw "invalid_path" object,default: false
 * @returns Value in object or undefined case throwError is equal false
 */
export declare function getValueInPath(fromObj:any,path:Path,throwError?:boolean):any