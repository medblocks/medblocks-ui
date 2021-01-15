<script lang="ts">
    import type {
CompositionStore,
        keyValue,
readableKeyValue,
                Template,
        UITemplate,
        writableKeyValue,
    } from "../types/types";
    import Leaf from "./Leaf.svelte";
    import Group from "./Group.svelte";
    import { writable, readable } from "svelte/store";
    import { createEventDispatcher} from "svelte";
    import {
        generateSchema,
    } from "./webtemplates";
    import Context from "../rm/Context.svelte";

    export let template: Template;
    export let readOnly: boolean = false;
    export let store: readableKeyValue | undefined = undefined;
    export let configuration: any;
    export let initialData: keyValue = {};
    export let customize: boolean = false;
    export let customizeFunction: Function = console.log;
    let internalStore: readableKeyValue
    let parentClass: string;
    let childClass: string;
    let error = false;
    let uiTemplate: UITemplate;
    $: {
        try {
            uiTemplate = generateSchema(template, configuration);
            if (uiTemplate.options.horizontal) {
                parentClass = "columns";
                childClass = "column";
            } else {
                parentClass = "field";
                childClass = "field";
            }
        } catch (e) {
            error = true;
        }
    }
    $: if (store){
        internalStore = store
    } else {
        if (readOnly) {
        internalStore = readable(initialData, (set)=>{
            set(initialData)
        });
    } else {
        internalStore = writable(initialData)
    }}
    function submit() {
        const dispatch = createEventDispatcher();
        dispatch("done", $internalStore);
    }
</script>

<style>
    .bordered {
        border-style: solid;
        border-width: 4px;
        border-color: lavender;
        border-radius: 5px;
    }
    .tag {
        background-color: lavender;
        cursor: pointer;
    }
</style>

{#if customize}
    <div class="tag" on:click={() => customizeFunction({ aqlPath: 'global', type: 'COMPOSITION', path: 'global'})}>
        COMPOSITION
    </div>
{/if}
<div class="box" class:bordered={customize == true}>
    <form on:submit|preventDefault={submit}>
        <h1 class="subtitle">
            {#if !error}{template.tree.name || ''}{:else}Template Error{/if}
        </h1>
        {#if !error}
            <div class={parentClass}>
                {#each uiTemplate.schema as item}
                    {#if item.type === 'Group'}
                        <Group
                            {...item}
                            {childClass}
                            {customize}
                            {customizeFunction} 
                            {readOnly}
                            store={internalStore}
                            />
                    {:else if item.type === 'Leaf'}
                        <Leaf {...item} {customize} {customizeFunction} {readOnly} store={internalStore}/>
                    {:else if item.type === 'Context'}
                        <Context {...item} {customize} {customizeFunction} {readOnly} store={internalStore}/>
                    {:else}
                        <p>Type {item.type} not recognized</p>
                        <pre>{JSON.stringify(item, null, 2)}</pre>
                    {/if}
                {/each}
            </div>
        {:else}
            <p>Invalid template</p>
        {/if}
        <div class="field">
            <div class="buttons">
                <button class="button is-fullwidth is-success">Submit</button>
            </div>
        </div>
    </form>
</div>
