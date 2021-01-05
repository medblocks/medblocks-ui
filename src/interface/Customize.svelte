<script lang="ts">
    export let params: {templateIndex?: string} = {}
    import type { TemplateConfig } from './config';
    import BackButton from './BackButton.svelte'
    import { writable } from 'svelte/store';
    import Form from '../form/Form.svelte';
    import { onMount } from 'svelte';
    import { defaultConfig, getConfig, setConfig } from "./config";
    import CustomizeBox from './customize/CustomizeBox.svelte';
    import {push} from 'svelte-spa-router'
    let selectedTemplate: TemplateConfig
    let currentConfiguration = writable({})
    
    let config = writable(defaultConfig)
    onMount(async ()=>{
        config.set(await getConfig())
    })

    $: {
        if ($config && params.templateIndex){
            let index = params.templateIndex
            console.log({index})
            console.log($config.templates)
            selectedTemplate = $config.templates.filter(template=>{
                console.log({templateId: template.id, index})
                return template.id==parseInt(index)
            })[0]
            if (selectedTemplate){
                currentConfiguration.set(selectedTemplate.configuration || {})
            }
        }
    }
    $: {
        console.log($currentConfiguration)
    }
    let store = writable({})
    let selectedElement
    const customizeFunction = (options)=>{
        selectedElement = options
    }
    const saveConfiguration = async () => {
        const oldConfig = $config
        const newConfig = {...oldConfig, templates: oldConfig.templates.map(template=>{
            if (params.templateIndex && template.id==parseInt(params.templateIndex)) {
                return {
                    ...template,
                    configuration: $currentConfiguration
                }
            } else {
                return template
            }
        })}
        await setConfig(newConfig)
        console.log(newConfig)
        push("/settings")
    }
    
</script>
<style>
    .is-cyan {
        background-color: lightcyan;
    }
</style>
<BackButton href="/settings">Go Back</BackButton>
<section class="section">
    <div class="container">
        <h1 class="title">Settings</h1>
        <hr>
        {#if selectedTemplate}    
        <p class="has-text-weight-semibold">Customizing: {selectedTemplate.template.templateId}</p>
        <p class="subtitle">↓ click on an <span class="tag is-cyan">ELEMENT</span> to start editing</p>
        <div class="columns">
            <div class="column is-half">
                <Form
                    template={selectedTemplate.template}
                    configuration={$currentConfiguration}
                    customize={true}
                    {customizeFunction}
                    {store} />
            </div>
            <div class="column is-half">
                {#if selectedElement}    
                    <h1 class="subtitle">Options</h1>
                    <CustomizeBox type={selectedElement.type} configurationStore={currentConfiguration} options={selectedElement}></CustomizeBox>
                    <div class="buttons">
                        <button class="button" on:click={saveConfiguration} type="button">Save</button>
                        <button class="button is-danger is-light" type="button">Restore previous</button>
                    </div>
                {/if}
            </div>
        </div>
        {/if}
    </div>
</section>
    

