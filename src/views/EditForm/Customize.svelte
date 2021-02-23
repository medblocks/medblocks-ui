<script lang="ts">
    import Navbar from "../Navbar.svelte";
    import { writable } from "svelte/store";
    import { createEventDispatcher, onMount, tick } from "svelte";
    import { defaultConfig, getConfig, setConfig } from "../config";
    import CustomizeBox from "../customize/CustomizeBox.svelte";
    import ConfigDisplay from "../customize/ConfigDisplay.svelte";
    import { push } from "svelte-spa-router";
    import Composition from "../../composition/Composition.svelte";
    import Autogen from "../Autogen.svelte";
    import axios from "axios";
    import type { Template } from "../../types/types";
    export let form
    export let templateManagerUrl
    const dispatch = createEventDispatcher()
    let selectedTemplate: Template;

    let currentConfiguration = writable({});

    let config = writable({});
    let readOnly = false;
    

    $: {
        selectedTemplate = form?.template?.webtemplate
        if (form?.configuration?.data) {
            currentConfiguration.set(form?.configuration?.data)
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
        const data = $currentConfiguration
        if (form?.configuration) {
            await axios.put(`${templateManagerUrl}/configuration/${form.configuration.id}`, {data})
        } else {
            await axios.post(`${templateManagerUrl}/form/${form.id}/configuration`, {data})    
        }
        dispatch('reload')
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
    .small-box {
        max-height: calc(100vh - 75px);
        overflow-y: auto
    }
    .nice-scrollbar::-webkit-scrollbar {
    background-color: #fff;
    width: 16px;
}

    /* background of the scrollbar except button or resizer */
    .nice-scrollbar::-webkit-scrollbar-track {
        background-color: #fff;
    }

    /* scrollbar itself */
    .nice-scrollbar::-webkit-scrollbar-thumb {
        background-color: #babac0;
        border-radius: 16px;
        border: 4px solid #fff;
    }

    /* set button(top and bottom of the scrollbar) */
    .nice-scrollbar::-webkit-scrollbar-button {
        display:none;
    }
</style>

    <div class="container">
        <div class="sourcebox box" class:is-hidden={!sourceView}>
            <span class="delete" on:click={()=>{sourceView=false}}></span>
            <p class="subtitle">Viewing source:</p>
            <pre id="data">{JSON.stringify($store, null, 2)}</pre>
        </div>
        {#if selectedTemplate}
        <div class="columns is-mobile">
            <div class="column">
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
                        >Reset</button
                    >
                </div>
            </div>
        </div>
           
            <div class="columns is-mobile">
                <div class="column is-two-thirds" id="component">
                    <div>
                        <Composition
                            template={selectedTemplate}
                            configuration={$currentConfiguration}
                            customize={true}
                            {customizeFunction}
                            {store}
                            {readOnly}
                        />
                    </div>
                </div>
                <div class="column">
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
                            <div class="field small-box nice-scrollbar">
                                <div class="field">
                                    {#if sourceView}
                                    <span class="tag is-dark" on:click={()=>{sourceView=false}}>Hide source</span>
                                    {:else}
                                    <span class="tag is-dark" on:click={()=>{sourceView=true}}>View source </span>
                                    {/if}
                                </div>
                                <CustomizeBox
                                    options={selectedElement}
                                />
                                <Autogen
                                    {...selectedElement}
                                    {readOnly}
                                    {store}
                                    configurationStore={currentConfiguration}
                                />
                                <!-- <ConfigDisplay configurationStore={currentConfiguration}/> -->
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        {:else}
        <p>Please upload a template first</p>
        {/if}
    </div>