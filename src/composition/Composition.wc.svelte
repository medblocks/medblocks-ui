<svelte:options tag="mui-composition" />

<script lang="ts">
    import "./main.scss"
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
    import { createEventDispatcher, onMount, setContext } from "svelte";
    import { generateSchema } from "./webtemplates";
    import Context from "../rm/Context.svelte";
import { get_current_component } from "svelte/internal";

    export let template: Template;
    export let readOnly: boolean = false;
    export let store: readableKeyValue | undefined = undefined;
    export let configuration: any;
    export let initialData: keyValue = {};
    export let customize: boolean = false;
    export let customizeFunction: Function = console.log;
    $: {
        console.log({ template, configuration, store, internalStore });
    }
    let internalStore: readableKeyValue;
    let parentClass: string;
    let childClass: string;
    let error = false;
    let uiTemplate: UITemplate;
    let contextItems: Extracted[];
    let groupLeafItems: Extracted[];
    setContext("contextPaths", writable([]));
    const dispatch = createEventDispatcher();
    function partition(
        array: Extracted[],
        isValid: (a: Extracted) => boolean
    ): [Extracted[], Extracted[]] {
        return array.reduce(
            ([pass, fail], elem) => {
                return isValid(elem)
                    ? [[...pass, elem], fail]
                    : [pass, [...fail, elem]];
            },
            [[], []]
        );
    }
    $: {
        try {
            uiTemplate = generateSchema(template, configuration, readOnly);
            console.log({ uiTemplate, template, configuration });
            [contextItems, groupLeafItems] = partition(
                uiTemplate.schema,
                (s) => s.type === "Context"
            );
            if (uiTemplate.options.horizontal) {
                parentClass = "columns";
                childClass = "column";
            } else {
                parentClass = "field";
                childClass = "field";
            }
            error = false;
        } catch (e) {
            error = true;
        }
    }
    onMount(() => {
        console.log({ store, from: "composition" });
        if (store) {
            console.log("store present");
            internalStore = store;
            // if (!readOnly){
            //     (internalStore as writableKeyValue).update(s=>({...s, ...initialData}))
            // }
        } else {
            console.log("initializing store");
            internalStore = writable(initialData);
        }
    });
    // function emitCustomEvent(name, detail){
    //     const event = new CustomEvent(name, {
    //       detail: detail,
    //       bubbles: true,
    //       composed: true, // needed for the event to traverse beyond shadow dom
    //   })
    //     this.dispatchEvent(event)
    // }
    const el = get_current_component()
    $: {
        console.log("Store changed")
        const event = new CustomEvent('change', {
          detail: $internalStore,
          bubbles: true,
          composed: true, // needed for the event to traverse beyond shadow dom
        })
        console.log("Emitting event")
        el.dispatchEvent(event)
    }
    function submit() {
        console.log("dispatching done")
        dispatch("done", $internalStore);
        const event = new CustomEvent('done', {
          detail: $internalStore,
          bubbles: true,
          composed: true, // needed for the event to traverse beyond shadow dom
      })
        el.dispatchEvent(event)
    }
</script>

{#if customize}
    <div
        class="tag"
        on:click={() =>
            customizeFunction({
                aqlPath: "global",
                type: "COMPOSITION",
                path: "global",
            })}
    >
        COMPOSITION
    </div>
{/if}
<div class="box" class:bordered={customize == true}>
    <form on:submit|preventDefault={submit}>
        <h1 class="subtitle">
            {#if !error}{template.tree.name || ""}{:else}Template Error{/if}
        </h1>
        {#if !error}
            <div class={parentClass}>
                {#each groupLeafItems as item}
                    {#key item.path}
                        {#if item.type === "Group"}
                            <Group
                                {...item}
                                {childClass}
                                {customize}
                                {customizeFunction}
                                {readOnly}
                                store={internalStore}
                            />
                        {:else if item.type === "Leaf"}
                            <Leaf
                                {...item}
                                {customize}
                                {customizeFunction}
                                {readOnly}
                                store={internalStore}
                            />
                        {:else}
                            <p>Type {item.type} not recognized</p>
                            <pre>{JSON.stringify(item, null, 2)}</pre>
                        {/if}
                    {/key}
                {/each}
            </div>
            <div class="field">
                {#each contextItems as item}
                    <Context
                        {...item}
                        {customize}
                        {customizeFunction}
                        {readOnly}
                        store={internalStore}
                    />
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


<style>
    @import "bulma.css";
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
