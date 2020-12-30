<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { keyValue } from "../../types/types";
    import { onDestroy, onMount } from "svelte";
    import { sanitizeComputeFunction, sanitizeDisplayFunction } from "../functions";

    export let path: string
    export let store: Writable<keyValue>
    export let name: string
    export let displayLabel: boolean = true
    export let display: boolean = true
    export let displayFunction: ((s:keyValue)=>any) | undefined = undefined
    export let computeFunction: ((s:keyValue)=>any) | undefined = undefined
    export let defaultValue: string = ''
    export let labelClass: string = 'label'
    export let textAreaClass: string = 'textarea'
    export let inputClass: string = 'input'
    export let fieldClass: string = 'field'
    export let errorClass: string = 'has-text-danger'
    export let widget: 'textarea'|'input' = 'textarea'
    let error: string|null = null
    let internalDisplay: boolean

    // Evaluate display function
    $: if (displayFunction) {
        internalDisplay = sanitizeDisplayFunction(path, displayFunction, $store)
    } else {
        internalDisplay = display
    }
    // Evaluate compute function
    $: if(computeFunction) {
        let result = sanitizeComputeFunction(path, computeFunction, $store)
        if (result && result !== $store[path]) {
            store.update(s=>({...s, [path]: result}))
        }
    }
    onMount(()=>{
        store.update(s=>({...s, [path]: defaultValue}))
    })
    onDestroy(()=>{
        store.update(s=>{
            let {[path]: _, newObject} = s
            return newObject
        })
    })

</script>

<div class={fieldClass}>
    {#if error}
    <p class={errorClass}>{error}</p>
    {:else}
    {#if internalDisplay}
        {#if displayLabel && name}
        <label for={path} class={labelClass}>{name}</label>
        {/if}
        {#if widget == 'textarea'}
        <textarea type="text" id={path} class={textAreaClass} bind:value={$store[path]}/>
        {:else}
        <input type="text" id={path} class={inputClass} bind:value={$store[path]}>
        {/if}
    {/if}
    {/if}
</div>
