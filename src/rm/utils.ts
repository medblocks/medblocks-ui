import {onDestroy, getContext} from 'svelte'
import type { Writable } from 'svelte/store'
import type {Tree, keyValue, Input, writableKeyValue, readableKeyValue} from '../types/types'

export function getFullPaths(path: string, tree: Tree) :string[] {
    let paths: string[]
    if (tree.inputs){
        paths = tree.inputs.map(
            input=>{
                if (input.suffix) {
                    return path + '|' + input.suffix
                }
                return path
            }
        )
        return paths
    }
    throw new Error("Tree does not have inputs")
}

export function destroyAction(paths: string[], store: writableKeyValue){
    store.update((obj) => {
        let newObj = {...obj}
        paths.forEach(path=>{
            let { [path]: _, ...excluded } = newObj;
            newObj = excluded
        })
        return newObj;
    });
}

export function triggerDestroy(paths: string[], store: writableKeyValue){
    onDestroy(()=>destroyAction(paths, store))
}

export function initialize(path: string|string[], tree: Tree, store: Writable<keyValue> = getContext('store')): {paths: string[], readOnly: boolean, store: Writable<keyValue>}{
    let readOnly: boolean = getContext('readOnly')
    if (typeof path == 'string'){
        let paths = getFullPaths(path, tree)
        triggerDestroy(paths, store)
        return {paths, store, readOnly}
    } else {
        triggerDestroy(path, store)
        return {paths: path, store, readOnly}
    }
}

export function getLabel(value: string, input: Input) :string {
    if (input.list){
        let label = input.list.filter(option=>option.value == value)[0]
        if (label && label.label){
            return label.label
        }
        throw new Error(`Cannot find label for ${value} in list`)
    }
    throw new Error(`Cannot find list in provided input`)
}

export function getLabelOrdinal(value: number, input: Input) :string {
    if (input.list){
        let label = input.list.filter(option=>option.ordinal == value)[0]
        if (label && label.label){
            return label.label
        }
        throw new Error(`Cannot find label for ${value} in list`)
    }
    throw new Error(`Cannot find list in provided input`)
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