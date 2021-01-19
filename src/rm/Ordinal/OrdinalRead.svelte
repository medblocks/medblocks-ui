<script lang="ts">
    import type { Tree, writableKeyValue } from "../../types/types";
    import {getLabelOrdinal} from "../utils";
    export let store: writableKeyValue
    export let path: string;
    export let tree: Tree;
    
    /**
     * The class for the <p> tag that the ordinal will be in
     * @param {strong|bold} ordinalClass
    */
    export let ordinalClass: string = "subtitle is-4 has-text-weight-bold"
    /**
     * @param {string} labelClass
     */
    export let labelClass: string = "is-6 has-text-grey has-text-weight-semibold"
    let selected: number;
    let internalPath: string
    $: internalPath = path.replace("/ordinal_value", "")
    $: selected = $store[internalPath + '|ordinal'];
</script>

<div class="field">
        <p class={labelClass}>{tree.name}</p>
            {#if tree.inputs}
            <p class={ordinalClass}>
                {#if selected}
                {$store[internalPath + '|ordinal']} - {getLabelOrdinal($store[internalPath + '|ordinal'], tree.inputs[0])}
                {:else}
                -
                {/if}
            </p>
            {:else}
                <p>
                    No inputs found in tree
                </p>
            {/if}
</div>
