<script lang="ts">
    import type { Tree, writableKeyValue } from "../../types/types";
    import { triggerDestroy } from "../utils";
    /**
     * @param {true|false} hideUnits - Still adds the value to the output, but does not show the units during data entry.
     * @param {true|false} displayTitle - To display the title or not.
     */
    export let path: string;
    export let store: writableKeyValue;
    export let tree: Tree;
    export let wrapperClass: string = "field";
    export let labelClass: string = "label";
    export let hideUnits: boolean = false;
    export let selectWrapperClass: string = "select";
    export let displayTitle: boolean = true;
    let internalUnits: string;
    let unitPath: string;
    let magnitudePath: string;
    let magnitudeStoreValue: number;
    $: {
        unitPath = path + "|unit";
        magnitudePath = path + "|magnitude";
        triggerDestroy([unitPath, magnitudePath], store);
    }
    $: magnitudeStoreValue = $store[magnitudePath];
    $: {
        if (typeof magnitudeStoreValue != "undefined") {
            if (magnitudeStoreValue === null) {
                store.update((s) => ({
                    ...s,
                    [magnitudePath]: undefined,
                    [unitPath]: undefined,
                }));
            } else if ($store[unitPath] != internalUnits) {
                store.update((s) => ({ ...s, [unitPath]: internalUnits }));
            }
        }
    }
</script>

<div class={wrapperClass}>
    {#if displayTitle}
        <label for={path} class={labelClass}>{tree.name}</label>
    {/if}
    <div class="columns">
        <div class="column">
            <input
                id={path}
                type="number"
                class="input"
                bind:value={$store[magnitudePath]}
            />
        </div>
        <div class="column" class:is-hidden={hideUnits}>
            {#if tree.inputs && tree.inputs[1].list}
                <div class={selectWrapperClass}>
                    <select bind:value={internalUnits}>
                        {#each tree.inputs[1].list as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </div>
            {:else}
                <p>Tree does not have input list</p>
            {/if}
        </div>
    </div>
</div>
