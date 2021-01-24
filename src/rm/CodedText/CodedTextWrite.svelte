<script lang="ts">
    /**
     * Coded Text Read component
     * @param {'dropdown'|'search'} type - Drop down or Search for Writing
     * @param {true | false} displayTitle - To diaply title or not
     */
    import type { Tree, writableKeyValue } from "../../types/types";
    import DropDown from "./DropDown.svelte";
    export let path: string;
    export let store: writableKeyValue;
    export let tree: Tree;
    export let wrapperClass: string = "field";
    export let labelClass: string = "label";
    export let selectWrapperClass: string = "select";

    export let type: "dropdown" | "search" = "dropdown";
</script>

{#if type === "dropdown"}
    <DropDown {...$$props} />
{/if}
