<script lang="ts">
    import type { Extracted, keyValue, Template } from "../types/types";
    import Leaf from "./Leaf.svelte";
    import Group from "./Group.svelte";
    import { writable } from "svelte/store";
    import { createEventDispatcher, setContext } from "svelte";
    import {
        generateSchema,
        sanitizeValues,
        rehydrateValues,
    } from "./webtemplates";
    import Context from "../rm/legacy/Context.svelte";
    import Display from "./Display.svelte";
    export let template: Template;
    export let readOnly: boolean = false;
    export let store = writable<keyValue>({});
    export let status: "pending" | "done" | "entered" = "pending";
    let contextStore = writable<keyValue>({});
    export let data: keyValue;
    setContext("store", store);
    setContext("contextStore", contextStore);
    setContext("readOnly", readOnly);
    let error = false;
    let schema: Extracted[];
    $: {
        try {
            schema = generateSchema(template);
            // console.log(schema);
        } catch (e) {
            error = true;
        }
    }
    $: if (data) {
        store.set(rehydrateValues(data));
    }
    const dispatch = createEventDispatcher();

    function submit() {
        console.log($contextStore)
        const contextCombined = { ...$contextStore, ...$store };
        dispatch("done", sanitizeValues(contextCombined));
    }
</script>

<Display {readOnly} {status} on:close on:done={submit}>
    <span slot="title">
        {#if !error}{template.tree.name || ''}{:else}Template Error{/if}
    </span>
    {#if !error}
        {#each schema as item}
            {#if item.type === 'Group'}
                <Group {...item} />
            {:else if item.type === 'Leaf'}
                <Leaf {...item} />
            {:else if item.type === 'Context'}
                <Context {...item} />
            {:else}
                <p>Type {item.type} not recognized</p>
                <pre>{JSON.stringify(item, null, 2)}</pre>
            {/if}
        {/each}
    {:else}
        <p>Invalid template</p>
    {/if}
    <span slot="title" />
</Display>
