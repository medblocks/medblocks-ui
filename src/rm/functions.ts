import type { Writable } from "svelte/store";
import type { keyValue } from "../types/types";

export interface Child {
    component: string,
    config: Config
}

export interface Config {
    path: string,
    store: Writable<keyValue>,
    name: string,
    displayLabel: boolean,
    display: boolean,
    displayFuntion?: ((s:keyValue)=>any),
    computeFunction?: ((s:keyValue)=>any),
    defaultValue: string,
    widget: string,
    widgetClass: string,
    labelClass: string,
    valueClass: string,
    fieldClass: string,
    errorClass: string,
    children?: Child []
}

export function sanitizeDisplayFunction(path: string, fn: Function, store: keyValue) :boolean{
        try {
            const result = fn(store)
            if (typeof result != 'boolean'){
                console.warn(`[${path}] Got a non boolean result from displayFunction. Ignoring function.`)
                return false
            } else {
                return result
            }
        } catch (error) {
            console.error(`[${path}] Error while evaluating displayFunction: ${error}`)
            return false
        }
}

export function sanitizeComputeFunction(path: string, fn: Function, store: keyValue) :string|undefined {
    try {
        let computed = fn(store)
        if (typeof computed != 'string') {
            console.warn(`[${path}] computeFunction did not return string. Ignoring function.`)
            return
        } else {
            return computed
        }
    } catch (error) {
        console.error(`[${path}] Error while evaluating computeFunction: ${error}`)
        return
    }
}