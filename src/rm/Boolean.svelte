<script lang="ts">
import type { Tree } from "../types/types";
import DisplayContent from "./helpers/DisplayContent.svelte";
import DisplayLabel from "./helpers/DisplayLabel.svelte";
import { initialize } from "./utils";


    export let path: string
    export let tree: Tree

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
        <DisplayContent>
            {#if $store[paths[0]]}
            Yes
            {:else}
            No
            {/if}
        </DisplayContent>
    {:else}
        <label for={path} class="label">{tree.name}
            <input type="checkbox" id={path} bind:checked={$store[paths[0]]}>
        </label>
    {/if}
</div>
