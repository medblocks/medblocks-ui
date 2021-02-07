<script lang="ts">
    import { onMount } from "svelte";

    import type {
        readableKeyValue,
        Tree,
        writableKeyValue,
    } from "../../types/types";
    import { destroyAction, getLabel, triggerDestroy } from "../utils";

    export let path: string;
    export let store: readableKeyValue;
    export let tree: Tree;
    export let wrapperClass: string = "field";
    export let labelClass: string = "label";
    export let selectWrapperClass: string = "select";
    export let displayTitle: boolean
    export let defaultValueClass: string = "label";
    let terminologyPath: string;
    let codePath: string;
    let valuePath: string;

    $: {
        terminologyPath = path + "|terminology";
        codePath = path + "|code";
        valuePath = path + "|value";
        triggerDestroy(
            [terminologyPath, codePath, valuePath],
            store as writableKeyValue
        );
    }

    $: codeStoreValue = $store[codePath];
    $: valueStoreValue = $store[valuePath];
    // Don't check length == 2
    $: isDefault = tree.inputs && tree.inputs.length === 2 && $store[codePath] === tree.inputs[0].defaultValue
    $: if (codeStoreValue && !isDefault) {
        if (tree.inputs && tree.inputs[0].list) {
            let selectedLabel = getLabel(codeStoreValue, tree.inputs[0]);
            (store as writableKeyValue).update((store) => ({
                ...store,
                [valuePath]: selectedLabel,
                [terminologyPath]: tree?.inputs?.[0]?.terminology ?? "local",
            }));
        } else {
            console.error("Tree does not have input/ input.list");
        }
    } else {
        if (!isDefault){
            destroyAction([terminologyPath, valuePath], store as writableKeyValue);
        }
    }
    onMount(() => {
        // To check other cases too
        if (tree.inputs && tree.inputs.length === 2) {
            const [codeTree, valueTree] = tree.inputs;
            if (
                codeTree.defaultValue &&
                valueTree.defaultValue &&
                codeTree.terminology
            ) {
                (store as writableKeyValue).update((store) => ({
                    ...store,
                    [codePath]: codeTree.defaultValue,
                    [valuePath]: valueTree.defaultValue,
                    [terminologyPath]: codeTree.terminology,
                }));
            }
        }
        // Set default values
    });
</script>

<div class={wrapperClass}>
    {#if displayTitle}
        <label for={path} class={labelClass}>{tree.name}</label>
    {/if}
    {#if tree.inputs && tree.inputs[0].list}
        <div class={selectWrapperClass}>
            <select
                id={path}
                bind:value={$store[codePath]}
                disabled={tree.inputs[0].list.length === 1}
            >
                <option value={undefined} selected>Select an option</option>
                {#each tree.inputs[0].list as option}
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
        </div>
    {:else if codeStoreValue}
        <p class={defaultValueClass}>{valueStoreValue}</p>
    {:else}
        <p>Tree does not have inputs/inputs does not have list</p>
    {/if}
</div>
