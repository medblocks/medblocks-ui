<script lang="ts">
    export let params: {templateIndex?: string} = {}
    import type { Config, TemplateConfig } from './config';
    import BackButton from './BackButton.svelte'
    import { writable } from 'svelte/store';
    import type {Writable} from 'svelte/store'
    import Form from '../form/Form.svelte';
    import { testConfig } from '../form/configuration';
    export let config: Writable<Config>
    let selectedTemplate: TemplateConfig
    
    $: {
        if ($config && params.templateIndex){
            let index = params.templateIndex
            console.log({index})
            console.log($config.templates)
            selectedTemplate = $config.templates.filter(template=>{
                console.log({templateId: template.id, index})
                return template.id==parseInt(index)
            })[0]
            console.log(selectedTemplate)
        }
    }
    let store = writable({})
    let selectedElement
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
            <div class="column">
                <Form
                    template={selectedTemplate.template}
                    configuration={testConfig}
                    customize={true}
                    {store} />
            </div>
            <div class="column">
                {#if selectedElement}    
                    <h1 class="subtitle">Options</h1>
                    <div class="buttons">
                        <button class="button">Done</button>
                        <a class="button is-danger is-light">Go back</a>
                    </div>
                {/if}
            </div>
        </div>
        {/if}
    </div>
</section>
    

