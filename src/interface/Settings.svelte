<script lang="ts">

    import ListTemplates from "./settings/ListTemplates.svelte";
    import Upload from "./settings/Upload.svelte"
    import {defaultConfig, getConfig, setConfig} from "./config"
    import type {Config} from "./config"
    import { writable } from "svelte/store";
    export let config

    $: if (JSON.stringify($config) != JSON.stringify(defaultConfig)) {
            setConfig($config)
            console.log("Updated config", $config)
        }

    

    const updateTemplate = (template)=>{
        config.update(c=>({
            ...c, 
            templates: [
                ...c.templates, 
                {
                    template, 
                    id: c.templates.length +1,
                    active: true
                }
            ] 
        }))
    }
</script>

<section class="section">
    <div class="container">
        <h1 class="title">Settings</h1>
        <hr>
        <h1 class="subtitle">Templates</h1>
        <ListTemplates {config}></ListTemplates>
        <Upload on:upload={event=>updateTemplate(event.detail)}></Upload>
    </div>
</section>