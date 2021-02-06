<script lang="ts">
    /**
     * Coded Text Read component
     * @param {'search' | 'dropbox' | 'buttons'} component - Which component to render for writing
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
    import ButtonList from "./ButtonList.svelte"

    export let path: string;
    export let store: writableKeyValue;
    export let tree: Tree;
    export let displayTitle: boolean = true;
    export let wrapperClass: string = "field";
    export let labelClass: string = "label";
    export let selectWrapperClass: string = "select";
    export let component: 'search' | 'dropbox' | 'buttons' = 'dropbox';
    export let terminologyUrl: string | undefined = undefined;
    export let searchFunction: SearchFunction  = hermesSearch;
    export let constraint: string | undefined = undefined
</script>

{#if component == 'dropbox'}
    <DropDown {path} {store} {tree} {selectWrapperClass} {labelClass} {wrapperClass} {displayTitle}/>
{:else if component == 'search'}
    <Search {path} {store} {tree} {labelClass} {wrapperClass} {displayTitle} {terminologyUrl}  {searchFunction} {constraint}/>
{:else if component == 'buttons'}
    <ButtonList {path} {store} {tree} {labelClass} {wrapperClass} {displayTitle}></ButtonList>
{:else}
    <p>Unknown component type for CodedTextWrite</p>
{/if}
