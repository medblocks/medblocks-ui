<script lang="ts">
import type { Writable } from "svelte/store";

import type { keyValue, Tree } from "../types/types";
import DisplayContent from "./helpers/DisplayContent.svelte";
import DisplayLabel from "./helpers/DisplayLabel.svelte";
import Loading from "./helpers/Loading.svelte";
import { initialize } from "./utils";

    export let tree: Tree
    export let path: string

    let paths:string[] , store: Writable<keyValue>, readOnly:boolean
    $:{
        ({ paths, store, readOnly } = initialize(path, tree))
    }

</script>

<div class="field">
    {#if readOnly}
        <DisplayLabel>{tree.name}</DisplayLabel>
        {#if $store[paths[0]] && $store[paths[1]]}
        <DisplayContent>
            {$store[paths[0]]} : {$store[paths[1]]}
        </DisplayContent>
        {:else}
        <Loading></Loading>
        {/if}
    {:else}
    <label for={path} class="label">{tree.name}</label>
    <div class="columns">
        <div class="column"><input type="number" class="input" bind:value={$store[paths[0]]}></div>
        <div class="column is-1"><p class="has-text-centered subtitle">:</p></div>
        <div class="column"><input type="number" class="input" bind:value={$store[paths[1]]}></div>
    </div>
      
    {/if}
</div>