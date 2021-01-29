<script lang="ts">
    import { BehaviorSubject } from "rxjs";
    import { debounceTime, startWith } from "rxjs/operators";
    import { writable } from "svelte/store";
    import type {
        readableKeyValue,
        writableKeyValue,
        Tree,
    } from "../../types/types";
    import { destroyAction, triggerDestroy } from "../utils";
    import type { SearchFunction, SearchResult } from "./search";
    export let path: string;
    export let store: readableKeyValue;
    export let tree: Tree;
    export let labelClass: string;
    export let wrapperClass: string;
    export let searchFunction: SearchFunction;
    export let constraint: string;
    export let terminologyUrl: string;
    export let displayTitle: boolean;

    let searchTerm: string = "";
    let error = false;
    let loading = false;
    let searchResults = writable<SearchResult[]>([]);

    const searchTermSubject = new BehaviorSubject<string>("");
    let searchTermRx = searchTermSubject.pipe(debounceTime(150), startWith(""));
    $: {
        searchTermSubject.next(searchTerm);
    }
    const handleSearch = async ({
        searchTerm,
        terminologyUrl,
        constraint,
        searchFunction,
        resultStore,
    }) => {
        try {
            loading = true;
            const results = await searchFunction(
                searchTerm,
                constraint,
                terminologyUrl
            );
            resultStore.set(results);
            loading = false;
            error = false;
        } catch (e) {
            error = true;
            console.error(e);
        }
    };
    $: {
        handleSearch({
            searchTerm: $searchTermRx,
            terminologyUrl,
            constraint,
            searchFunction,
            resultStore: searchResults,
        });
    }
    const paths = [path + "|code", path + "|value", path + "|terminology"];
    const deselect = () => {
        destroyAction(paths, store as writableKeyValue);
    };
    const select = (result) => {
        (store as writableKeyValue).update((s) => ({
            ...s,
            [path + "|code"]: result.code,
            [path + "|value"]: result.value,
            [path + "|terminology"]: "SNOMED-CT",
        }));
    };
    triggerDestroy(paths, store as writableKeyValue);
</script>

<div class={wrapperClass}>
    {#if displayTitle}
        <label for={path} class={labelClass}>{tree.name}</label>
    {/if}
    {#if $store[path + "|value"]}
        <div class="control">
            <label class="is-size-5" for={path + ".delete"}
                >{$store[path + "|value"]}</label
            >
            <button
                class="delete"
                id={path + "delete"}
                on:click|preventDefault={deselect}
                type="button"
            />
        </div>
    {:else if !(terminologyUrl && constraint)}
        <p>Please configure terminologyUrl and constraint in the settings.</p>
    {:else}
        <div class="control has-icons-right" class:is-loading={false}>
            <input
                id={path}
                type="search"
                class="input"
                bind:value={searchTerm}
                placeholder="Type to search..."
                autocomplete="off"
            />
            {#if error}<span class="icon is-right">⚠️</span>{/if}
        </div>
        <div class="container">
            <aside class="box menu" class:is-hidden={!searchTerm || error}>
                <ul class="menu-list">
                    {#if searchTerm && !loading && $searchResults.length == 0}
                        <li>
                            <a class:has-text-grey={loading} href="#/"
                                >No results found</a
                            >
                        </li>
                    {:else}
                        {#each $searchResults as result}
                            <li>
                                <a
                                    class:has-text-grey={loading}
                                    href="#/"
                                    on:click|preventDefault={() =>
                                        select(result)}
                                >
                                    {result.display}</a
                                >
                            </li>
                        {/each}
                    {/if}
                </ul>
            </aside>
        </div>
    {/if}
</div>

<style>
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
        display: none;
    }
    input[type="search"]::-webkit-search-cancel-button {
        display: none;
    }
    .delete {
        vertical-align: middle;
    }
    aside {
        margin: auto;
        z-index: 100;
        overflow: auto;
        position: absolute;
        padding: 0;
        margin: 0;
        border: 1px solid #dbdbdb;
        height: 20rem;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.966);
    }
</style>
