<script lang="ts">
import type { readableKeyValue, Tree, writableKeyValue } from "../../types/types";
import { sanitizeComputeFunction, triggerDestroy } from "../utils";


    export let path: string
    export let store: readableKeyValue
    export let tree: Tree
    /**
     * @param {function} computeFunction - Calculates the count (number) based on other values.
     */
    export let computeFunction: Function | undefined = undefined;

    $: if (computeFunction) {
        let result = sanitizeComputeFunction(path, computeFunction, $store, 'number');
        if (result && result !== $store[path]) {
            (store as writableKeyValue).update((s) => ({ ...s, [path]: result }));
        }
    }

    $: triggerDestroy([path], store as writableKeyValue)
</script>

<div class="field">
    <label for={path} class="label">{tree.name}</label>
    <input type="number" id={path} class="input" bind:value={$store[path]}>
</div>