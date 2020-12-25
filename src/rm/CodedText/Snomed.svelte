<script lang="ts">
    import type { Tree } from "../../types/types";
    import type { SearchResult } from "./search";
    import { createQueryBody, parseSearchResult } from "./search";
    import { initialize, destroyAction } from "../utils";
    import { fade } from "svelte/transition";
    import axios from "axios";
    import Error from "../helpers/Error.svelte";
    import { writable } from "svelte/store";
    import DisplayLabel from "./../helpers/DisplayLabel.svelte";
    import Loading from "../helpers/Loading.svelte";
    import { BehaviorSubject } from "rxjs"
    import { debounceTime, switchMap, startWith} from "rxjs/operators"
    import DisplayContent from "../helpers/DisplayContent.svelte";
    export let path: string;
    export let tree: Tree;
    export let terminologyUrl: string;

    let results = writable<SearchResult[]>([]);
    const enum State {
        Initial,
        Loading,
        Done,
        Error,
    }
    let state = writable<State>(State.Initial);
    let paths: string[] = [
        path + "|code",
        path + "|value",
        path + "|terminology",
    ];
    let { store, readOnly } = initialize(paths, tree);

    let searchTerm: string;
    let searchResult: Promise<SearchResult[]>;
    let selected: SearchResult | undefined
    function loadSearchResults(searchTerm: string) :void{
        if (!searchTerm){
            state.set(State.Initial);
            return
        }
        let query = createQueryBody(searchTerm, [
            "404684003",
            "243796009",
            "272379006",
        ]);
        let result = axios.post(terminologyUrl + "_search", query);
        searchResult = parseSearchResult(result);
        searchResult.then((value) => {
            results.set(value);
            state.set(State.Done);
        }).catch(error=>{
            console.error(error)
            state.set(State.Error)
        });
    }
    let searchTermStream = new BehaviorSubject<string>('')
    
    let searchObservable = searchTermStream.pipe(
        debounceTime(250),
        startWith('')
    );
    $:{
        loadSearchResults($searchObservable)
    }
    $: if (searchTerm && !readOnly) {
        
        searchTermStream.next(searchTerm)
    }
    $: {
        if (!selected){
            destroyAction(paths, store)
        }
        else {
            let {code , value} = selected
            store.update(s=>({
                ...s, 
                [paths[0]]: code,
                [paths[1]]: value,
                [paths[2]]: "SNOMED-CT"
            }))
        }
    }
    $: {
        if (readOnly){
            if ($store[paths[0]]) {
                selected = {
                    code: $store[paths[0]],
                    display: $store[paths[1]], //Get display based on user preference?
                    value: $store[paths[1]]
                }
            } else {
                selected = undefined
            }
        }
    }
    // TODO: Communicate with other snomed widgets and offer suggestions
    function select(result: SearchResult) :void {
        selected = result
        searchTerm = ''
        state.set(State.Initial)
        results.set([])
    }

</script>
{#if readOnly}
<div class="field">
    <DisplayLabel>{tree.name}</DisplayLabel>
    {#if selected}
    <DisplayContent>{selected.display}</DisplayContent>
    {:else}
    <Loading></Loading>
    {/if}
</div>
{:else}
    <div class="field">
        <label class="label" for={path}>{tree.name}</label>
        {#if tree.inputs && tree.inputs[0] && tree.inputs[0].defaultValue}
            <div class="control" class:is-loading={$state === State.Loading} class:has-icons-right={$state===State.Error}>
                {#if selected}
            <label class="is-size-5" for={path + ".delete"}>{selected.value}</label>
            <button class="delete" id={path + "delete"} on:click|preventDefault={()=>{selected = undefined}} type="button"></button>
        {:else}
            <input
            id={path}
            type="search"
            class="input"
            bind:value={searchTerm}
            placeholder={tree.inputs[0].defaultValue} />
            {#if $state===State.Error}    
            <span class="icon is-right" >
                ⚠️
            </span>
            {/if}
        {/if}
                
            </div>
            {#if $state === State.Error}
            <p class="has-text-danger">Network error</p>
            {/if}
        {:else}
            <Error>Default value of terminology not set</Error>
        {/if}
        <div class="container">
            <aside transition:fade={{ duration: 150 }} class="box menu" class:is-hidden={!searchTerm || $state === State.Error}>
                <ul class="menu-list">   
                {#if $results.length === 0 && $state !== State.Initial}
                    <li><a class:has-text-grey={$state === State.Loading} href="#/">No results found</a></li>
                {:else}
                    {#each $results as result}
                        <li><a class:has-text-grey={$state === State.Loading} href="#/" on:click|preventDefault={()=>select(result)}> {result.display}</a></li>
                    {/each}
                {/if}
                </ul>
            </aside>
        </div>
    </div>
{/if}

<style>
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
</style>