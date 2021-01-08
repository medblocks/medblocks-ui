<script lang="ts">
import { afterUpdate, beforeUpdate, onMount } from "svelte";
import type { Writable } from "svelte/store";
import { copy } from "../../form/utils";

    import Global from "./Global.svelte"
    export let configurationStore: Writable<any>
    export let options
    const components = {
        'Global': Global,
    }
    let configutaionJSON: string
    function updateFromJson(){
        const value = JSON.parse(configutaionJSONlocal)
        console.log(value)
        configurationStore.set(value)
    }
    $: configutaionJSON = JSON.stringify($configurationStore, null, 2)
    let configutaionJSONlocal: string
    onMount(()=>{
        configutaionJSONlocal = configutaionJSON
    })
    let aqlDisplay: string
    $: aqlDisplay = options.aqlPath.replaceAll("/", "<wbr>/")
</script>
<div class="box">
    <p>Type: {options.type}</p>
    <p>Path: {@html aqlDisplay}</p>
    <div class="field">
        <span class="button is-small is-white" on:click={()=>{copy(options.aqlPath)}}>Copy AQL path 📋</span>
    </div>
    <svelte:component this={components[options.type]} {configurationStore} {...options}></svelte:component>
    <div class="field">
        <textarea name="" id="jsoneditor" cols="30" rows="10" class="textarea" bind:value={configutaionJSONlocal}/>
    </div>
    <div class="field">
        <pre>{configutaionJSON}</pre>
    </div>
    <div class="field">
        <button class="button" on:click={updateFromJson}>Update from JSON</button>
    </div>

</div>