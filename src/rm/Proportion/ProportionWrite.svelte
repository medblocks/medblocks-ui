<script lang="ts">
    import type {
        readableKeyValue,
        Tree,
        writableKeyValue,
    } from "../../types/types";
    import { triggerDestroy } from "../utils";
    /**
     * @param {true|false} hideUnits - Still adds the value to the output, but does not show the units during data entry.
     * @param {true|false} displayTitle - To display the title or not.
     */
    export let path: string;
    export let store: readableKeyValue;
    export let tree: Tree;
    export let wrapperClass: string = "field";
    export let labelClass: string = "label";
    export let displayTitle: boolean = true;
    export let component: "percentage" | "fraction" = "percentage";
    let defaultDenominator: number = 100
    let numberatorPath: string;
    let denominatorPath: string;
    $: {
        numberatorPath = path + "|numerator";
        denominatorPath = path + "|denominator";
        triggerDestroy(
            [numberatorPath, denominatorPath],
            store as writableKeyValue
        );
    }
    $: numeratorStoreValue = $store[numberatorPath];
    $: {
        if (typeof numeratorStoreValue != "undefined") {
            if (numeratorStoreValue === null) {
                (store as writableKeyValue).update((s) => ({
                    ...s,
                    [numberatorPath]: undefined,
                    [denominatorPath]: undefined,
                }));
            } else if ($store[denominatorPath] !== defaultDenominator) {
                (store as writableKeyValue).update((s) => ({ ...s, [denominatorPath]: defaultDenominator }));
            }
        }
    }
</script>

<div class={wrapperClass}>
    {#if displayTitle}
        <label for={path} class={labelClass}>{tree.name}</label>
    {/if}
    <div class="field has-addons">
        <p class="control">
            <input
                class="input"
                type="number"
                placeholder={tree.name}
                bind:value={$store[numberatorPath]}
            />
        </p>
        <p class="control">
            <a class="button is-static"> % </a>
        </p>
    </div>
</div>
