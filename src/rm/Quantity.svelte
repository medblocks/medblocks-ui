<script lang="ts">
    import { initialize, getLabel } from "./utils";
    import DisplayLabel from "./helpers/DisplayLabel.svelte";
    import type { keyValue, Tree } from "../types/types";
    import Error from "./helpers/Error.svelte";
    import Loading from "./helpers/Loading.svelte";
    export let path: string;
    export let tree: Tree;
    import type { Writable } from "svelte/store";
    let paths:string[] , store: Writable<keyValue>, readOnly:boolean
    $:{
        ({ paths, store, readOnly } = initialize(path, tree))
    }
    
</script>

<div class="field">
    {#if readOnly}
        <DisplayLabel>{tree.name}</DisplayLabel>
        {#if $store[paths[0]]}
            {#if tree.inputs}
                <p>
                    <span
                        class="subtitle is-4 has-text-weight-bold">{$store[paths[0]]}</span>
                    <span
                        class="">{getLabel($store[paths[1]], tree.inputs[1])}
                    </span>
                </p>
            {:else}
            <p>Count not find input template</p>
            {/if}
        {:else}
        <Loading></Loading>
        {/if}
    {:else}
        <label class="label" for={path}>{tree.name}</label>
        <div class="columns">
            <div class="column">
                <input
                    id={path}
                    class="input"
                    type="number"
                    name="magnitude"
                    bind:value={$store[paths[0]]} />
            </div>
            <div class="column">
                {#if tree.inputs && tree.inputs[1].list}    
                    <div class="select">
                        <select
                            bind:value={$store[paths[1]]}
                            disabled={tree.inputs[1].list.length === 1}>
                            {#each tree.inputs[1].list as option}
                                <option value={option.value} label={option.label} />
                            {/each}
                        </select>
                    </div>
                {:else}
                <Error>Tree does not have input/input.list</Error>
                {/if}
            </div>
        </div>
    {/if}
</div>
<!-- <pre>{JSON.stringify(tree, null, 2)}</pre> -->
