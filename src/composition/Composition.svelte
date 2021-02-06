<script lang="ts">
    import type {
Extracted,
                keyValue,
        readableKeyValue,
                Template,
                UITemplate,
    } from "../types/types";
    import Leaf from "./Leaf.svelte";
    import Group from "./Group.svelte";
    import { writable } from "svelte/store";
    import { createEventDispatcher, setContext} from "svelte";
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
    let contextItems: Extracted[]
    let groupLeafItems: Extracted[]
    setContext("contextPaths", writable([]))
    const dispatch = createEventDispatcher();
    function partition(array: Extracted[], isValid: (a: Extracted)=>boolean): [Extracted[], Extracted[]] {
        return array.reduce(([pass, fail], elem) => {
            return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
        }, [[], []]);
        }
    let mainGroup: Extracted
    $: {
        try {
            mainGroup = generateSchema(template, configuration, readOnly);
            // ([contextItems, groupLeafItems] = partition(uiTemplate.schema, s=>s.type === 'Context'))
            // if (uiTemplate.options.horizontal) {
            //     parentClass = "columns";
            //     childClass = "column";
            // } else {
            //     parentClass = "field";
            //     childClass = "field";
            // }
        } catch (e) {
            error = true;
        }
    }
    if (store){
        internalStore = store
        // if (!readOnly){
        //     (internalStore as writableKeyValue).update(s=>({...s, ...initialData}))
        // }
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
        COMPOSITION
    </div>
{/if}
<div class="box" class:bordered={customize == true}>
    <form on:submit|preventDefault={submit}>
        <h1 class="subtitle">
            {#if !error}{template.tree.name || ''}{:else}Template Error{/if}
        </h1>
        {#if !error}
                {#key mainGroup.path}
                        <Group
                            {...mainGroup}
                            {childClass}
                            {customize}
                            {customizeFunction} 
                            {readOnly}
                            store={internalStore}
                            />
                {/key}
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
