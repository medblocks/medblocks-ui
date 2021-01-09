<script lang="ts">
    import type { Writable } from "svelte/store";
    import { copy } from "../../composition/utils";
    import Global from "./Global.svelte";
    import Leaf from "./Leaf.svelte";
    import OrdinalWriteCustomize from "./OrdinalWriteCustomize.svelte";
    export let readOnly: boolean;
    export let configurationStore: Writable<any>;
    export let options;
    const components = {
        write: {
            Global: Global,
            DV_ORDINAL: OrdinalWriteCustomize,
        },
        read: {
            Global
        }
        
    };
    const getComponent = (type: string, readOnly: boolean) => {

    }

</script>


<p class="label">{options.type}: {readOnly?'Read':'Write'} mode</p>
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
        this={components[readOnly?'read':'write'][options.type] || Leaf}
        {configurationStore}
        {...options} />
{/key}
<!-- <div class="field">
    <textarea name="" id="jsoneditor" cols="30" rows="10" class="textarea" bind:value={configutaionJSONlocal}/>
</div> -->

<!-- <div class="field">
    <button class="button" on:click={updateFromJson}>Update from JSON</button>
</div> -->

