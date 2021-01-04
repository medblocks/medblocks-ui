<script lang="ts">
import DataEntry from "./interface/DataEntry.svelte";
import Settings from "./interface/Settings.svelte";
import Customize from "./interface/Customize.svelte";
import Router from 'svelte-spa-router'
import {wrap} from 'svelte-spa-router/wrap'
import { defaultConfig, getConfig } from "./interface/config";
import { writable } from "svelte/store";
import { onMount } from "svelte";


const routes = {
    '/': DataEntry,
    '/settings': Settings,
    '/customize/:templateIndex?': Customize
}
</script>


<svelte:head>
    <title>Medblocks Forms</title>
</svelte:head>

<Router {routes}/>
