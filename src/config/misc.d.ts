/**
	Used to store the path value in string and array
*/
export declare class Path {
	private patharray:Array<string>
	private pathPrivate:string
	constructor(path:string | Array<string>)
	readonly pathArray:Array<string>
	readonly path:string
}
export declare function generateError(errorName:"unknown",arrData:Array<any>):{error:"unknown",message:string,data:Array<any>}
export declare function generateError(errorName:"invalid_path",arrData:Array<any>):{
	error:"invalid_path",message:string,obj:any,property:string,value:any
}