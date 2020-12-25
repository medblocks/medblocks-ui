<script lang="ts">
    import type { Tree } from "../types/types";
import DisplayContent from "./helpers/DisplayContent.svelte";
import DisplayLabel from "./helpers/DisplayLabel.svelte";
import Loading from "./helpers/Loading.svelte";

    export let path: string
    export let tree: Tree

    import {initialize} from "./utils"
    import type { Writable } from "svelte/store";
    import type {keyValue} from "../types/types"
    let paths:string[] , store: Writable<keyValue>, readOnly:boolean
    $:{
        ({ paths, store, readOnly } = initialize(path, tree))
    }

    function parseDateTime(datetime :string) :string {
        const date = new Date(datetime)
        return date.toLocaleDateString()
    }
    
</script>

<div class="field">
    {#if readOnly}
        <DisplayLabel>{tree.name}</DisplayLabel>
        {#if $store[paths[0]]}
        <DisplayContent>
                {parseDateTime($store[paths[0]])}
        </DisplayContent>
        {:else}
        <Loading></Loading>
        {/if}
    {:else}
        <label for={path} class="label">{tree.name}</label>
        <input type="datetime-local" id={path} class="input" bind:value={$store[paths[0]]}>
    {/if}
</div>