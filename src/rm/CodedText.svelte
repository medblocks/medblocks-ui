<script lang="ts">
    import type { Tree } from "../types/types";
    import Snomed from "./CodedText/Snomed.svelte";
    import DropDown from "./CodedText/DropDown.svelte";
    import { initialize } from "./utils";
    import DisplayLabel from "./helpers/DisplayLabel.svelte";
    import Error from "./helpers/Error.svelte";
    import SnomedReadOnly from "./CodedText/SnomedReadOnly.svelte";
    export let path: string;
    export let tree: Tree;
    export let terminologyUrl: string = "http://localhost:9200/";
    let terminology: string;

    if (tree.inputs && tree.inputs[0] && tree.inputs[0].terminology) {
        terminology = tree.inputs[0].terminology;
    }
    console.log(tree);
    let readOnly: boolean;
    $: {
        ({ readOnly } = initialize(path, tree));
    }
</script>

{#if terminology}
    {#if terminology === 'SNOMED-CT'}
        {#if readOnly}
            <SnomedReadOnly {path} {tree} />
        {:else}
            <Snomed {path} {tree} {terminologyUrl} />
        {/if}
    {:else if terminology === 'openehr'}
        <input hidden />
    {:else}
        <div class="field">
            {#if readOnly}
                <DisplayLabel>{tree.name}</DisplayLabel>
            {:else}<label for={path} class="label">{tree.name}</label>{/if}
            <Error>
                The terminology URI in the template: "{terminology}" is not
                supported. Currently only "SNOMED-CT" is supported.
            </Error>
        </div>
    {/if}
{:else}
    <DropDown {path} {tree} />
{/if}
