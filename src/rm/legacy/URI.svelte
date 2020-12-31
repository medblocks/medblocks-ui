<script lang="ts">
import type { Tree } from "../../types/types";
import DisplayLabel from "../helpers/DisplayLabel.svelte";
import Loading from "../helpers/Loading.svelte";
import { initialize } from "../utils";


    export let tree: Tree
    export let path: string

    const {paths, store, readOnly } = initialize(path, tree)
    
</script>

<div class="field">
    {#if readOnly}
        <DisplayLabel>{tree.name}</DisplayLabel>
        {#if $store[paths[0]]}
        <a href={$store[paths[0]]}>Open link</a>
        {:else}
        <Loading></Loading>
        {/if}
    {:else}
        <label for={path} class="label">{tree.name}</label>
        <input type="url" class="input" id={path} placeholder="Please enter URI" bind:value={$store[paths[0]]}>
    {/if}
</div>