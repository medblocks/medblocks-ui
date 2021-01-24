<script lang="ts">
    import type { Writable } from "svelte/store";
    import { copy } from "../../composition/utils";
    import Composition from "./Global.svelte";
    import Leaf from "./Leaf.svelte";

    export let readOnly: boolean;
    export let configurationStore: Writable<any>;
    export let options;
    const components = {
        write: {
            COMPOSITION: Composition,
        },
        read: {
            COMPOSITION: Composition
        }
        
    };
    const getComponent = (type: string, readOnly: boolean) => {

    }

</script>


<h1 class="subtitle">{options.type}</h1>
<div class="field">
    <div class="buttons">
    <button
        class="button is-small"
        on:click={() => {
            copy(options.aqlPath);
        }}>Copy AQL path 📋</button>
    <button
    class="button is-small"
    on:click={() => {
        copy(options.path);
    }}>Copy Path 📋</button>
    </div>
</div>
{#key options.aqlPath + readOnly}
    <svelte:component
        this={components[readOnly?'read':'write'][options.type]}
        {configurationStore}
        {...options} />
{/key}
<!-- <div class="field">
    <textarea name="" id="jsoneditor" cols="30" rows="10" class="textarea" bind:value={configutaionJSONlocal}/>
</div> -->

<!-- <div class="field">
    <button class="button" on:click={updateFromJson}>Update from JSON</button>
</div> -->

