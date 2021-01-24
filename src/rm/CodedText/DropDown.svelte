<script lang="ts">
    import type { Tree, writableKeyValue } from "../../types/types";
    import { getLabel, triggerDestroy } from "../utils";
    
        export let path: string
        export let store: writableKeyValue
        export let tree: Tree
        export let wrapperClass: string = "field"
        export let labelClass: string = "label"
        export let selectWrapperClass: string = "select"
        
        let terminologyPath: string
        let codePath: string
        let valuePath: string
        
        $: {
            terminologyPath = path + '|terminology'
            codePath = path + '|code'
            valuePath = path + '|value'
            triggerDestroy([terminologyPath, codePath, valuePath], store)
        }
    
        $: codeStoreValue = $store[codePath]
        $: if (codeStoreValue){
            if (tree.inputs && tree.inputs[0].list){
                    let selectedLabel = getLabel(codeStoreValue, tree.inputs[0])
                    store.update(store=>({...store, [valuePath]: selectedLabel, [terminologyPath]: 'local'}))
                }
                else {
                    console.error("Tree does not have input/ input.list")
                }
        }
    </script>
    
    <div class={wrapperClass}>
        <label for={path} class={labelClass}>{tree.name}</label>
        {#if tree.inputs && tree.inputs[0].list}    
            <div class={selectWrapperClass}>
                <select id={path} bind:value={$store[codePath]} disabled={tree.inputs[0].list.length === 1}>
                    <option value={undefined} selected>Select an option</option>
                    {#each tree.inputs[0].list as option}
                    <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
            </div>
        {:else}
            <p>Tree does not have inputs/inputs does not have list</p>
        {/if}
    </div>