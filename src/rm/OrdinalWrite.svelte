<script lang="ts">
    import type { Tree } from "../types/types";
import Error from "./helpers/Error.svelte";
    export let store
    export let path: string;
    export let tree: Tree;
    let internalPath: string
    let selected: number;

    $: internalPath = path.replace("/ordinal_value", "")
    $: selected = $store[ internalPath + '|ordinal'];
    $: if (selected) {
            if (tree.inputs && tree.inputs[0].list) {
                let option = tree.inputs[0].list.filter(
                    (option) => option.ordinal == selected
                )[0];
                let { label, value } = option;
                store.update((store) => ({
                    ...store,
                    [internalPath + '|code']: value,
                    [internalPath + '|value']: label,
                }));
            } else {
                console.error("Tree does not have input/ input.list");
            }
    }
</script>

<div class="field">
        <label class="label" for={path}>{tree.name}</label>
        {#if tree.inputs && tree.inputs[0].list}
            <div class="select">
                <select
                    id={path}
                    name="code"
                    bind:value={$store[internalPath + '|ordinal']}
                    disabled={tree.inputs[0].list.length === 1}>
                    <option value={undefined} selected disabled>
                        Select an option
                    </option>
                    {#each tree.inputs[0].list as option}
                        <option
                            value={option.ordinal}
                            label={option.ordinal ? `${option.ordinal}. ${option.label}` : option.label} />
                    {/each}
                </select>
            </div>
        {:else}
            <Error>Tree does not have inputs/inputs does not have list</Error>
        {/if}
</div>
