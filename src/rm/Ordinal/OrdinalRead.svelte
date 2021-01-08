<script lang="ts">
    import type { Tree } from "../../types/types";
    import DisplayContent from "../helpers/DisplayContent.svelte";
    import DisplayLabel from "../helpers/DisplayLabel.svelte";
    import Error from "../helpers/Error.svelte";
    import Loading from "../helpers/Loading.svelte";

    import {getLabelOrdinal} from "../utils";
    export let store
    export let path: string;
    export let tree: Tree;
    // Need to add path|value = `label` and remove on component delete
    let selected: number;
    let internalPath: string
    $: internalPath = path.replace("/ordinal_value", "")
    $: selected = $store[internalPath + '|ordinal'];
</script>

<div class="field">
        <DisplayLabel>{tree.name}</DisplayLabel>
        {#if selected}
            {#if tree.inputs}
                <DisplayContent>
                    {$store[internalPath + '|ordinal']} - {getLabelOrdinal($store[internalPath + '|ordinal'], tree.inputs[0])}
                </DisplayContent>
            {:else}
                <Error>No inputs found in tree</Error>
            {/if}
        {:else}
            <Loading />
        {/if}
</div>
