<script lang="ts">
    import type {
Extracted,
                keyValue,
        readableKeyValue,
                Template,
                UITemplate,
    } from "../types/types";
    import Group from "./Group.svelte";
    import { writable } from "svelte/store";
    import { createEventDispatcher, setContext} from "svelte";
    import {
        generateSchema,
    } from "./webtemplates";

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
    setContext("contextPaths", writable([]))
    const dispatch = createEventDispatcher();
    let mainGroup: Extracted
    $: {
        try {
            mainGroup = generateSchema(template, configuration, readOnly);
        } catch (e) {
            error = true;
            console.error(e)
        }
    }
    if (store){
        internalStore = store
    } else {
        internalStore = writable(initialData)
    }
    function submit() {
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
        GLOBAL
    </div>
{/if}
<div class="box" class:bordered={customize == true}>
    <form on:submit|preventDefault={submit}>
        {#if !error}
                {#key JSON.stringify(mainGroup)}
                        <Group
                            {...mainGroup}
                            {childClass}
                            {customize}
                            {customizeFunction} 
                            {readOnly}
                            store={internalStore}
                            path=""
                            />
                {/key}
        {:else}
            <h1 class="subtitl">Template error</h1>
            <p>Invalid template</p>
        {/if}
        <div class="field">
            <div class="buttons">
                <button class="button is-fullwidth is-success">Submit</button>
            </div>
        </div>
    </form>
</div>
