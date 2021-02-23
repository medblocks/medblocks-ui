<script lang="ts">
    import type { readableKeyValue, Tree, writableKeyValue } from "../../types/types";
    import DisplayLabel from "../helpers/DisplayLabel.svelte";
    import { getLabel } from "../utils";
    
        export let path: string
        export let store: readableKeyValue
        export let tree: Tree
        export let wrapperClass: string = "field"
        export let labelClass: string = "label"
        export let unitClass: string = ""
        export let magnitudeClass: string = "subtitle is-5"
        let unitPath: string
        let magnitudePath: string
        $: unitPath = path + '|unit'
        $: magnitudePath = path + '|magnitude'

    </script>
    
    <div class={wrapperClass}>
        <p class={labelClass}>
            {tree.name}
        </p>
        {#if typeof $store[magnitudePath] != "undefined"}
            {#if tree.inputs}
                <p>
                    <span class={magnitudeClass}>{$store[magnitudePath]}</span>
                    <span class={unitClass}>{getLabel($store[unitPath], tree.inputs[1])}</span>
                </p>
            {:else}
            <p>Tree does not have inputs</p>
            {/if}
        {:else}
            <p class={magnitudeClass}>-</p>
        {/if}
    </div>