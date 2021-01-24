<script lang="ts">
import DataEntry from "./views/DataEntry.svelte";
import Settings from "./views/Settings.svelte";
import Customize from "./views/Customize.svelte";
import Router from 'svelte-spa-router'

const routes = {
    '/': DataEntry,
    '/settings': Settings,
    '/customize/:templateIndex?': Customize
}
</script>


<svelte:head>
    <title>Medblocks UI</title>
</svelte:head>

<Router {routes}/>
