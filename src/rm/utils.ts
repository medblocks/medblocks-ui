import {onDestroy, getContext} from 'svelte'
import type { Writable } from 'svelte/store'
import type {Tree, keyValue, Input} from '../types/types'

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

export function destroyAction(paths: string[], store: Writable<keyValue>){
    store.update((obj) => {
        let newObj = {...obj}
        paths.forEach(path=>{
            let { [path]: _, ...excluded } = newObj;
            newObj = excluded
        })
        return newObj;
    });
}

function triggerDestroy(paths: string[], store: Writable<keyValue>){
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