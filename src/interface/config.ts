import * as localForage from "localforage"
import type { Template } from "../types/types"

export interface TemplateConfig {
    template: Template,
    active: boolean,
    id: number
}
export const defaultConfig: Config = {
    templates: []
}
export interface Config {
    templates: TemplateConfig [],
}

export const setConfig = async (config: Config) => {
    await localForage.setItem("config", config)
}

export const getConfig = async () : Promise<Config> => {
    const config: Config | null = await localForage.getItem("config")
    if (config) {
        return config
    } else {
        await setConfig(defaultConfig)
        return defaultConfig
    }
}
// export const templates = Object.fromEntries(templateList.map(template=>([template.templateId,  template])))