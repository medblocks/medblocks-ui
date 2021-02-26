<script lang="ts">
    import type { readableKeyValue, Tree, writableKeyValue } from "../../types/types";
    import { triggerDestroy } from "../utils";

    export let path: string;
    export let store: readableKeyValue;
    export let tree: Tree;
    export let wrapperClass: string = "field";
    
</script>

<div class={wrapperClass}>
    <!-- {#if displayTitle}
        <label for={path} class={labelClass}>{tree.name}</label>
    {/if} -->
    <label for={path} class="checkbox">
        <input type="checkbox" disabled id={path} bind:checked={$store[path]}>
        {tree.name}
    </label>
</div>
