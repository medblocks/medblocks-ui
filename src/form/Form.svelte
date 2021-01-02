<script lang="ts">
    import type { Extracted, keyValue, Template, UITemplate } from "../types/types";
    import Leaf from "./Leaf.svelte";
    import Group from "./Group.svelte";
    import { writable } from "svelte/store";
    import { createEventDispatcher, setContext } from "svelte";
    import {
        generateSchema,
        sanitizeValues,
        rehydrateValues,
    } from "./webtemplates";
    import Context from "../rm/Context.svelte";
    import Display from "./Display.svelte";
    export let template: Template;
    export let readOnly: boolean = false;
    export let store = writable<keyValue>({});
    export let status: "pending" | "done" | "entered" = "pending";
    export let configuration: any
    let contextStore = writable<keyValue>({});
    export let data: keyValue;
    let parentClass: string
    setContext("store", store);
    setContext("contextStore", contextStore);
    setContext("readOnly", readOnly);
    let error = false;
    let uiTemplate: UITemplate;
    $: {
        try {
            uiTemplate = generateSchema(template, configuration);
            console.log(uiTemplate);
            parentClass = uiTemplate.options.parentClass || "field"
        } catch (e) {
            error = true;
        }
    }
    $: if (data) {
        store.set(rehydrateValues(data));
    }
    const dispatch = createEventDispatcher();

    function submit() {
        console.log($contextStore);
        const contextCombined = { ...$contextStore, ...$store };
        dispatch("done", sanitizeValues(contextCombined));
    }
</script>

<Display {readOnly} {status} on:close on:done={submit}>
    <span slot="title">
        {#if !error}{template.tree.name || ''}{:else}Template Error{/if}
    </span>
    {#if !error}
    <div class={parentClass}>
        {#each uiTemplate.schema as item}
            {#if item.type === 'Group'}
                <Group {...item} {...item.options} />
            {:else if item.type === 'Leaf'}
                <Leaf {...item} />
            {:else if item.type === 'Context'}
                <Context {...item} />
            {:else}
                <p>Type {item.type} not recognized</p>
                <pre>{JSON.stringify(item, null, 2)}</pre>
            {/if}
        {/each}
    </div>
    {:else}
        <p>Invalid template</p>
    {/if}
    <span slot="title" />
</Display>
