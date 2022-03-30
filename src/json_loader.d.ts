export interface config {
    type:listType | configList,
    aux?:string,
    depend?:""
    on_active?:(value:any,object:any)=>void
}
type listType = "string" | "number" |"int" |"float" |"object" |"array" |"generic_object" |"boolean"
export type configList = {
    [Key: string]:config
}
declare function start(config:configList,reader:any,throwCaseNotValidProp?:boolean):void
export = start
