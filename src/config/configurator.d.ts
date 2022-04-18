import EventEmitter from "events";
/**
 * Basic object to add a new configuration
 */
export interface objConfig{
    name:string,
    type:string,
    on_active?:(value:string)=>void,
    def?:any,
    required?:boolean
}
/**
 * Class to storage values with check type
 */
export = class Configurator extends EventEmitter{
    constructor(obj:objConfig | objConfig[])
    /**
     * @param obj Object(s) to put in configuration
     */
    public putConfig(obj:objConfig | objConfig[]):void;
    public readAndSetObj(obj:any):void;
    /**
     * Return all configurations with no value and property required is true
     */
    get notConfigured():Array<string>;
    get allowOverride():boolean;
    set allowOverride(value:boolean);
    public set(configName:string,value:any):boolean;
    public get(configName:string):any
}