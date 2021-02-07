<script lang="ts">
    export let params: { templateIndex?: string } = {};
    import type { TemplateConfig } from "./config";
    import Navbar from "./Navbar.svelte";
    import { writable } from "svelte/store";
    import { onMount, tick } from "svelte";
    import { defaultConfig, getConfig, setConfig } from "./config";
    import CustomizeBox from "./customize/CustomizeBox.svelte";
    import ConfigDisplay from "./customize/ConfigDisplay.svelte";
    import { push } from "svelte-spa-router";
    import Composition from "../composition/Composition.svelte";
    import Autogen from "./Autogen.svelte";
    let selectedTemplate: TemplateConfig;
    let currentConfiguration = writable({});

    let config = writable(defaultConfig);
    let readOnly = false;
    onMount(async () => {
        config.set(await getConfig());
    });

    $: {
        if ($config && params.templateIndex) {
            let index = params.templateIndex;
            selectedTemplate = $config.templates.filter((template) => {
                return template.id === parseInt(index);
            })[0];
            if (selectedTemplate) {
                currentConfiguration.set(selectedTemplate.configuration || {});
            }
        }
    }
    let store = writable({});
    let selectedElement;
    let sourceView = false;
    const customizeFunction = (options) => {
        selectedElement = options;
    };
    const restoreDefault = () => {
        currentConfiguration.set({});
    };
    const switchReadWrite = async () => {
        const state = $store;
        readOnly = !readOnly;
        await tick();
        store.set(state);
    };
    const saveConfiguration = async () => {
        const oldConfig = $config;
        const newConfig = {
            ...oldConfig,
            templates: oldConfig.templates.map((template) => {
                if (
                    params.templateIndex &&
                    template.id === parseInt(params.templateIndex)
                ) {
                    return {
                        ...template,
                        configuration: $currentConfiguration,
                    };
                } else {
                    return template;
                }
            }),
        };
        await setConfig(newConfig);
        push("/settings");
    };
</script>
<style>
    .tag{
        cursor: pointer;
        font-family: monospace;
    }
    .is-cyan {
        background-color: lightcyan;
    }
    .sticky {
        position: sticky;
        position: -webkit-sticky;
        top: 0px;
    }
    .sourcebox{
        position: fixed;
        z-index: 100;
        max-width: 700px;
    }
    pre {
        max-height: 500px;
        overflow-y: auto
    }
</style>
<Navbar />
<section class="section">
    <div class="container">
        <div class="sourcebox box" class:is-hidden={!sourceView}>
            <span class="delete" on:click={()=>{sourceView=false}}></span>
            <p class="subtitle">Viewing source:</p>
            <pre id="data">{JSON.stringify($store, null, 2)}</pre>
        </div>
        <h1 class="title">Settings</h1>
        <hr />
        {#if selectedTemplate}
        <div class="columns is-mobile">
            <div class="column">
                    <p class="has-text-weight-semibold">
                        Customizing: {selectedTemplate.template.templateId}.
                    </p>
                    <p class="subtitle">
                        ↓ click on an <span class="tag is-cyan">ELEMENT</span> to start editing. 
                    </p>
            </div>
            <div class="column">
                <div class="buttons is-pulled-right">
                    <button
                        class="button is-success is-outlined"
                        on:click={saveConfiguration}
                        type="button">Save</button
                    >
                    <button
                        class="button is-danger is-outlined"
                        type="button"
                        on:click={restoreDefault}
                        >Restore default</button
                    >
                </div>
            </div>
        </div>
           
            <div class="columns is-mobile">
                <div class="column is-half" id="component">
                    <div>
                        <Composition
                            template={selectedTemplate.template}
                            configuration={$currentConfiguration}
                            customize={true}
                            {customizeFunction}
                            {store}
                            {readOnly}
                        />
                    </div>
                </div>
                <div class="column is-half">
                    <div class="menu sticky">
                        {#if selectedElement}
                            <div class="tabs">
                                <ul>
                                    <li
                                        class:is-active={!readOnly}
                                        on:click={switchReadWrite}
                                    ><a>Write</a></li>
                                    <li
                                        class:is-active={readOnly}
                                        on:click={switchReadWrite}
                                    ><a>Read</a></li>
                                </ul>
                            </div>
                            <div class="field">
                                {#if sourceView}
                                <span class="tag is-dark" on:click={()=>{sourceView=false}}>Hide source</span>
                                {:else}
                                <span class="tag is-dark" on:click={()=>{sourceView=true}}>View source </span>
                                {/if}
                            </div>
                            <CustomizeBox
                                configurationStore={currentConfiguration}
                                options={selectedElement}
                                {readOnly}
                            />
                            <Autogen
                                {...selectedElement}
                                {readOnly}
                                {store}
                                configurationStore={currentConfiguration}
                            />
                            <ConfigDisplay configurationStore={currentConfiguration}/>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </div>
</section>
