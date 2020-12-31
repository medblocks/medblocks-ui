<script lang="ts">
    import type { Tree } from "../../types/types";
    import DisplayContent from "../helpers/DisplayContent.svelte";
    import DisplayLabel from "../helpers/DisplayLabel.svelte";
    import Error from "../helpers/Error.svelte";
    import Loading from "../helpers/Loading.svelte";

    import { initialize, getLabelOrdinal, getFullPaths } from "../utils";

    export let path: string;
    export let tree: Tree;
    // Need to add path|value = `label` and remove on component delete
    let initialPaths: string[] = ["ordinal", "code", "value"].map(
        (suffix) => `${path.replace("/ordinal_value", "")}|${suffix}`
    );

    let { paths, store, readOnly } = initialize(initialPaths, tree);
    let selected: number;
    $: selected = $store[paths[0]];
    $: if (!readOnly) {
        if (selected) {
            if (tree.inputs && tree.inputs[0].list) {
                let option = tree.inputs[0].list.filter(
                    (option) => option.ordinal == selected
                )[0];
                let { label, value } = option;
                store.update((store) => ({
                    ...store,
                    [paths[1]]: value,
                    [paths[2]]: label,
                }));
            } else {
                console.error("Tree does not have input/ input.list");
            }
        }
    }
</script>

<div class="field">
    {#if readOnly}
        <DisplayLabel>{tree.name}</DisplayLabel>
        {#if selected}
            {#if tree.inputs}
                <DisplayContent>
                    {$store[paths[0]]} - {getLabelOrdinal($store[paths[0]], tree.inputs[0])}
                </DisplayContent>
            {:else}
                <Error>No inputs found in tree</Error>
            {/if}
        {:else}
            <Loading />
        {/if}
    {:else}
        <label class="label" for={path}>{tree.name}</label>
        {#if tree.inputs && tree.inputs[0].list}
            <div class="select">
                <select
                    id={path}
                    name="code"
                    bind:value={$store[paths[0]]}
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
    {/if}
</div>
