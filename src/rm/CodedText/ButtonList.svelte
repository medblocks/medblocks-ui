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
    export let displayTitle: boolean
    export let defaultValueClass: string = "";
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
    $: isDefault = tree.inputs && tree.inputs.length == 2 && $store[codePath] == tree.inputs[0].defaultValue
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
        if (tree.inputs && tree.inputs.length == 2) {
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
    const select = (code: string)=>{
        if (codeStoreValue !== code){
            (store as writableKeyValue).update(s=>({
                ...s,
                [codePath]: code
        }))
        } else {
            destroyAction([codePath], store as writableKeyValue)
        }
       
    }
</script>

<div class={wrapperClass}>
    {#if displayTitle}
        <label for={path} class={labelClass}>{tree.name}</label>
    {/if}
    {#if tree.inputs && tree.inputs[0].list}
        <div class="buttons">
            {#each tree.inputs[0].list as option}
            <button class="button" type="button" class:is-info={option.value === codeStoreValue} on:click={()=>select(option.value)}>
                {option.label}
            </button>
            {/each}
        </div>
    {:else if codeStoreValue}
        <p class={defaultValueClass}>{valueStoreValue}</p>
    {:else}
        <p>Tree does not have inputs/inputs does not have list</p>
    {/if}
</div>
