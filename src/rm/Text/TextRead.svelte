<script lang="ts">
    import type { readableKeyValue, Tree } from "../../types/types";
    
        export let path: string
        export let store: readableKeyValue
        export let tree: Tree
    
    </script>
    
    <div class="field">
        <h1 class="label">{tree.name}</h1>
        <p class="subtitle is-5">
            {#if $store[path]}
            {$store[path]}
            {:else}
            -
            {/if}
        </p>
    </div>