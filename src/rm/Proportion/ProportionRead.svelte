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
    export let magnitudeClass: string = "subtitle is-5"
    export let component: "percentage" | "fraction" = "percentage";
    let numberatorPath: string;
    let denominatorPath: string;
    $: {
        numberatorPath = path + "|numerator";
        denominatorPath = path + "|denominator";
    }

</script>

<div class={wrapperClass}>
    {#if displayTitle}
        <label for={path} class={labelClass}>{tree.name}</label>
    {/if}
    {#if $store[numberatorPath]}    
        <p> 
            <span class={magnitudeClass}>
                {$store[numberatorPath]}
            </span>
            <span>%</span>
        </p>
    {:else}
     <p class={magnitudeClass}>-</p>
    {/if}
    {#if $store[denominatorPath] !== 100}
        <p>Denominator not 100. Its is {$store[denominatorPath]}</p>
    {/if}
</div>
