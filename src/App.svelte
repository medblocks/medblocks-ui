<script lang="ts">
import DataEntry from "./interface/DataEntry.svelte";
import Settings from "./interface/Settings.svelte";
import { onMount } from "svelte";
import { defaultConfig, getConfig } from "./interface/config";
import { writable } from "svelte/store";
import Customize from "./interface/Customize.svelte";
let page = 'data'
let components = {
    'data': DataEntry,
    'settings': Settings,
    'customize': Customize
}
const toggle = () => {
    if (page == 'data') {
        page = 'settings'
    } else {
        page = 'data'
    }
}
let config = writable(defaultConfig)
const loadConfig = async () => {
        let localConfig = await getConfig()
        config.set(localConfig)
    }
onMount(async ()=>{
        await loadConfig()
    })
</script>

<style>
    .button {
        position: relative;
        /* right: 2rem; */
        left: 2rem;
        top: 1rem;
    }
    div {
        position: relative
    }
</style>
<div>
    <button class="button is-rounded" on:click={toggle}>
        {#if page == 'data'}
            Settings
        {:else}
            Go back
        {/if}
    </button>
</div>
<svelte:head>
    <title>Medblocks Forms</title>
</svelte:head>
<svelte:component this={components[page]} {config}></svelte:component>