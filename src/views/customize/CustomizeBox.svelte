<script lang="ts">
    import type { Writable } from "svelte/store";
    import { copy } from "../../composition/utils";
    import Ordinal from "./Ordinal.svelte";
    import Global from "./Global.svelte";
    import Leaf from "./Leaf.svelte";
    export let configurationStore: Writable<any>;
    export let options;
    const components = {
        Global: Global,
        DV_ORDINAL: Ordinal,
    };

</script>

<div class="box">
    <p class="label">{options.type} type</p>
    <div class="field">
        <span
            class="button is-small"
            on:click={() => {
                copy(options.aqlPath);
            }}>Copy AQL path 📋</span>
    </div>
    {#key options.aqlPath}
        <svelte:component
            this={components[options.type] || Leaf}
            {configurationStore}
            {...options} />
    {/key}
    <!-- <div class="field">
        <textarea name="" id="jsoneditor" cols="30" rows="10" class="textarea" bind:value={configutaionJSONlocal}/>
    </div> -->

    <!-- <div class="field">
        <button class="button" on:click={updateFromJson}>Update from JSON</button>
    </div> -->
</div>

