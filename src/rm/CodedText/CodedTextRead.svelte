<script lang="ts">
    import type { Tree, writableKeyValue } from "../../types/types";
    import { getLabel } from "../utils";
    /**
     * @param {true | false} displayTitle - To diaply title or not
     */
    export let path: string;
    export let store: writableKeyValue;
    export let tree: Tree;
    export let wrapperClass: string = "field";
    export let labelClass: string =
        "is-6 has-text-grey has-text-weight-semibold";
    export let valueClass: string = "subtitle is-5";
    export let displayTitle: boolean = true;

    let terminologyPath: string;
    let codePath: string;
    let valuePath: string;

    $: terminologyPath = path + "terminology";
    $: codePath = path + "|code";
    $: valuePath = path + "|value";
</script>

<div class={wrapperClass}>
    {#if displayTitle}
        <p class={labelClass}>{tree.name}</p>
    {/if}
    <p class={valueClass}>
        {#if $store[valuePath]}
            {$store[valuePath]}
        {:else}
            -
        {/if}
    </p>
</div>
