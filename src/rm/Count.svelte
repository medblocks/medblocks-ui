<script lang="ts">
    import DisplayContent from "./helpers/DisplayContent.svelte"
import DisplayLabel from "./helpers/DisplayLabel.svelte"
import Loading from "./helpers/Loading.svelte"
    import {initialize} from "./utils"
    export let path
    export let tree
    import type { Writable } from "svelte/store";
    import type {keyValue} from "../types/types"
    let paths:string[] , store: Writable<keyValue>, readOnly:boolean
    $:{
        ({ paths, store, readOnly } = initialize(path, tree))
    }
    
</script>

<div class="field">
    {#if readOnly}
    <DisplayLabel>{tree.name}</DisplayLabel>
    {#if $store[paths[0]]}
    <DisplayContent>{$store[paths[0]]}</DisplayContent>
    {:else}
    <Loading></Loading>
    {/if}
    {:else}
    <label for={path} class="label">{tree.name}</label>
    <input type="number" id={path} class="input" bind:value={$store[paths[0]]}>
    {/if}
</div>