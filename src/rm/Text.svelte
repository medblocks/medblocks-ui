<script lang="ts">
    import type { Tree } from "../types/types";
    import { initialize } from "./utils";
    import Loading from "./helpers/Loading.svelte";
    import DisplayLabel from "./helpers/DisplayLabel.svelte";
    export let path: string;
    export let tree: Tree;
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
            <p class="subtitle is-5">{$store[paths[0]]}</p>
            {:else}
            <Loading></Loading>
        {/if}
    {:else}
        <label for={path} class="label">{tree.name}</label>
        <textarea type="text" id={path} class="textarea" bind:value={$store[paths[0]]} />
    {/if}
</div>
