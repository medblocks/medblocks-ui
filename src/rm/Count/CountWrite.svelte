<script lang="ts">
import type { readableKeyValue, Tree, writableKeyValue } from "../../types/types";
import { triggerDestroy } from "../utils";


    export let path: string
    export let store: readableKeyValue
    export let tree: Tree

    $: triggerDestroy([path], store as writableKeyValue)
</script>

<div class="field">
    <label for={path} class="label">{tree.name}</label>
    <input type="number" id={path} class="input" bind:value={$store[path]}>
</div>