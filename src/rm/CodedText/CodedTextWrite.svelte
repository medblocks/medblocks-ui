<script lang="ts">
    /**
     * Coded Text Read component
     * @param {true | false} search - Drop down or Search for Writing
     * @param {true | false} displayTitle - To diaply title or not
     * @param {string} constraint - The snomed ECL to search for the term
     * @param {string} terminologyUrl - The URL for terminology search
     *
     */
    import type { Tree, writableKeyValue } from "../../types/types";
    import type {SearchFunction} from "./search"
    import {hermesSearch} from "./search"
    import DropDown from "./DropDown.svelte";
    import Search from "./Search.svelte";

    export let path: string;
    export let store: writableKeyValue;
    export let tree: Tree;
    export let wrapperClass: string = "field";
    export let labelClass: string = "label";
    export let selectWrapperClass: string = "select";
    export let search: boolean = false;
    export let terminologyUrl: string | undefined = undefined;
    export let searchFunction: SearchFunction  = hermesSearch;
    export let constraint: string | undefined = undefined
</script>

{#if !search}
    <DropDown {path} {store} {tree} {selectWrapperClass} {labelClass} {wrapperClass}/>
{:else}
    <Search {path} {store} {tree} {labelClass} {wrapperClass} {terminologyUrl}  {searchFunction} {constraint}/>
{/if}
