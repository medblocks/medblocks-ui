<script lang="ts">
import type { Tree } from "../types/types";
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
    {#each paths as path} 
    <p>
        {path}
    </p>
    {/each}
</div>