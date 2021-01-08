<script lang="ts">
    import type {
        keyValue,
        Template,
        UITemplate,
        writableKeyValue,
    } from "../types/types";
    import Leaf from "./Leaf.svelte";
    import Group from "./Group.svelte";
    import { writable } from "svelte/store";
    import { createEventDispatcher} from "svelte";
    import {
        generateSchema,
        sanitizeValues,
        rehydrateValues,
    } from "./webtemplates";
    import Context from "../rm/Context.svelte";
    export let template: Template;
    export let readOnly: boolean = false;
    export let store: writableKeyValue = writable({});
    export let configuration: any;
    export let contextStore: writableKeyValue = writable({});
    export let initialData: keyValue;
    export let initialContext: keyValue;
    export let customize: boolean = false;
    export let customizeFunction: Function;
    let parentClass: string;
    let childClass: string;
    let error = false;
    let uiTemplate: UITemplate;
    $: {
        try {
            uiTemplate = generateSchema(template, configuration);
            console.log(uiTemplate);
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
    $: if (initialData) {
        store.set(rehydrateValues(initialData));
    }
    $: if (initialContext){
        contextStore.set(initialContext)
    }
    const dispatch = createEventDispatcher();

    function submit() {
        console.log($contextStore);
        const contextCombined = { ...$contextStore, ...$store };
        dispatch("done", sanitizeValues(contextCombined));
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
    <div class="tag" on:click={() => customizeFunction({ aqlPath: 'global', type: 'Global', path: 'global'})}>
        GLOBAL
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
                            {store}
                            />
                    {:else if item.type === 'Leaf'}
                        <Leaf {...item} {customize} {customizeFunction} {readOnly} {store}/>
                    {:else if item.type === 'Context'}
                        <Context {...item} {readOnly} {store}/>
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
