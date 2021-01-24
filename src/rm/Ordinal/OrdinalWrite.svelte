<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { keyValue, Tree } from "../../types/types";
    import { onMount } from "svelte";
    import { triggerDestroy } from "../utils";
    // Setup
    export let store: Writable<keyValue>;
    export let path: string;
    export let tree: Tree;
    /**
     * @param {true|false} display - To display or not
     * @param {string} ordinalPathAppend - The path that comes after ordinal: Eg: /glasgow_coma_scale_e/value|ordinal. In this example "value" is the appended path.
     * @param {number} defaultOrdinal - The default ordinal (number) 
     */
    export let label: string | undefined = undefined
    export let defaultOrdinal: number | undefined = undefined;
    export let wrapperClass: string = "field"
    export let labelClass: string = "label"
    export let selectWrapperClass: string = "select"
    //TODO: Needs to be changed to "" and include all specifics in cofig
    export let ordinalPathAppend: string = "/value" 
    let internalPath: string;
    let selected: number;
    
    // Computed
    $: {
        //TODO: Needs to be changed later. Must append even it /ordinal_value not present. 
        //Convenient for passing tests for now.
        internalPath = path.replace("/ordinal_value", ordinalPathAppend); 
        triggerDestroy(
        ["|ordinal", "|code", "|value"].map((a) => internalPath + a),
        store
    );
    }
    $: selected = $store[internalPath + "|ordinal"];
    $: if (selected) {
        if (tree.inputs && tree.inputs[0].list) {
            let option = tree.inputs[0].list.filter(
                (option) => option.ordinal == selected
            )[0];
            let { label, value } = option;
            store.update((store) => ({
                ...store,
                [internalPath + "|code"]: value,
                [internalPath + "|value"]: label,
            }));
        } else {
            console.error("Tree does not have input/ input.list");
        }
    }

    //Triggers
    onMount(() => {
        if (defaultOrdinal) {
            $store[internalPath + "|ordinal"] = defaultOrdinal;
        }
    });
</script>

<div class={wrapperClass}>
    <label class={labelClass} for={path}>{label || tree.name}</label>
    {#if tree.inputs && tree.inputs[0].list}
        <div class={selectWrapperClass}>
            <select
                id={path}
                name="code"
                bind:value={$store[internalPath + '|ordinal']}
                disabled={tree.inputs[0].list.length === 1}>
                <option value={undefined} selected disabled>Select an option</option>
                {#each tree.inputs[0].list as option}
                    <option value={option.ordinal}>{typeof option.ordinal !== 'undefined' ? `${option.ordinal}. ${option.label}` : option.label}</option>
                {/each}
            </select>
        </div>
    {:else}
        <p>Tree does not have inputs/inputs does not have list</p>
    {/if}
</div>
