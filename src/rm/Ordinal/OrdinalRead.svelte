<script lang="ts">
    import type { Tree, writableKeyValue } from "../../types/types";
    import {getLabelOrdinal} from "../utils";
    export let store: writableKeyValue
    export let path: string;
    export let tree: Tree;
    /**
     * @param {string} ordinalPathAppend - The path that comes after ordinal: Eg: /glasgow_coma_scale_e/value|ordinal. In this example "value" is the appended path.
     */
    export let ordinalPathAppend: string = "/value"
    export let ordinalClass: string = "subtitle is-5"
    export let labelClass: string = "has-text-grey has-text-weight-semibold is-size-6"
    let selected: number;
    let internalPath: string
    $: internalPath = path.replace("/ordinal_value", ordinalPathAppend)
    $: selected = $store[internalPath + '|ordinal'];
</script>

<div class="field">
        <p class={labelClass}>{tree.name}</p>
            {#if tree.inputs}
            <p class={ordinalClass}>
                {#if typeof selected !== 'undefined'}
                {selected} - {getLabelOrdinal($store[internalPath + '|ordinal'], tree.inputs[0])}
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
