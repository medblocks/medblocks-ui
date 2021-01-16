import * as localForage from "localforage"
import { writable } from "svelte/store"
import type { Template } from "../types/types"
// import * as serialize from 'serialize-javascript'

// console.log(serialize({
//     'hello': 'world'
// }))
export interface TemplateConfig {
    template: Template,
    active: boolean,
    id: number,
    configuration: any
}
export const defaultConfig: Config = {
    templates: [],
}
export interface Config {
    templates: TemplateConfig [],
    ehr?: string,
    terminology?: string,
    demographics?: string
}

const functionKeys = ['computeFunction', 'displayFunction']
const serizlizeFn = (name, value)=>{
    if (functionKeys.includes(name)){
        return value.toString()
    } else {
        return value
    }
}
const parseFn = (name, value)=>{
    if (functionKeys.includes(name)){
        return Function('return ' + value)()
    } else {
        return value
    }
}

export const setConfig = async (config: Config) => {
    //Serialize functionKeys 
    await localForage.setItem("config", JSON.stringify(config, serizlizeFn))
}

export const getConfig = async () : Promise<Config> => {
    const config: string | null = await localForage.getItem("config")
    if (config) {
        return JSON.parse(config, parseFn)
    } else {
        await setConfig(defaultConfig)
        return defaultConfig
    }
}