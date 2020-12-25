<script lang="ts">
    import {initialize, getLabel, getFullPaths} from '../utils'
    import Loading from '../helpers/Loading.svelte';
    import DisplayContent from '../helpers/DisplayContent.svelte';
    import DisplayLabel from '../helpers/DisplayLabel.svelte'
    import Error from "../helpers/Error.svelte";
    import type { Tree } from '../../types/types';
    export let path: string;
    export let tree: Tree
    // Need to add path|value = `label` and remove on component delete
    let initialPaths: string[] = [...getFullPaths(path, tree), `${path}|value`, `${path}|terminology`]

    let {paths, store, readOnly} = initialize(initialPaths, tree)
    let selected: string
    let selectedLabel: string

    $: selected = $store[paths[0]]
    $: if (!readOnly) {
        if (selected){
            if (tree.inputs && tree.inputs[0].list){
                selectedLabel = tree.inputs[0].list.filter(option=>option.value==selected)[0].label || ''
                store.update(store=>({...store, [paths[1]]: selectedLabel, [paths[2]]: 'local'}))
            }
            else {
                console.error("Tree does not have input/ input.list")
            }
        }
    }
</script>


<div class="field">
    {#if readOnly}
    <DisplayLabel>
        {tree.name}
    </DisplayLabel>
        {#if selected}
            {#if tree.inputs}
                <DisplayContent>{getLabel($store[paths[0]], tree.inputs[0])}</DisplayContent>    
                {:else}
                <Error>No inputs found in tree</Error>
            {/if}
        {:else}
    <Loading></Loading>
    {/if}
    {:else}
    <label class="label" for={path}>{tree.name}</label>
    {#if tree.inputs && tree.inputs[0].list}    
        <div class="select">
            <select id={path} name="code" bind:value={$store[paths[0]]} disabled={tree.inputs[0].list.length === 1}>
                <option value={undefined} selected disabled>Select an option</option>
                {#each tree.inputs[0].list as option}
                <option value={option.value} label={option.label}></option>
                {/each}
            </select>
        </div>
    {:else}
        <Error>Tree does not have inputs/inputs does not have list</Error>
    {/if}
    {/if}
</div>