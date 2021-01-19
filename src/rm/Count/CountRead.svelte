<script lang="ts">
import type { readableKeyValue, Tree } from "../../types/types";


    export let path: string
    export let store: readableKeyValue
    export let tree: Tree

</script>

<div class="field">
    <p class="is-6 has-text-grey has-text-weight-semibold">{tree.name}</p>
    <p class="subtitle is-4 has-text-weight-bold">
        {#if $store[path]}
        {$store[path]}
        {:else}
        -
        {/if}
    </p>
</div>