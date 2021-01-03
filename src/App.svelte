<script lang="ts">
import DataEntry from "./interface/DataEntry.svelte";
import Settings from "./interface/Settings.svelte";
import Customize from "./interface/Customize.svelte";
import Router from 'svelte-spa-router'
import {wrap} from 'svelte-spa-router/wrap'
import { defaultConfig, getConfig } from "./interface/config";
import { writable } from "svelte/store";
import { onMount } from "svelte";

let config = writable(defaultConfig)
const loadConfig = async () => {
        let localConfig = await getConfig()
        config.set(localConfig)
    }
onMount(async ()=>{
        await loadConfig()
    })

const routes = {
    '/': wrap({
        component: DataEntry,
        props: {
            config
        }
    }),
    '/settings': wrap({
        component: Settings,
        props: {
            config
        }
    }),
    '/customize/:templateIndex?': wrap({
        component: Customize,
        props: {
            config
        }
    })
    // '/customize': Customize
}
</script>


<svelte:head>
    <title>Medblocks Forms</title>
</svelte:head>

<Router {routes}/>
