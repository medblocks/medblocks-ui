<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Composition from "../composition/Composition.svelte";
    import type { keyValue, Template, UITemplate } from "../types/types";
    import type {TemplateConfig} from "./config"
    import Patient from "./Patient.svelte";
    let activeTemplates: TemplateConfig[];
    
    import { defaultConfig, getConfig } from "./config";
import Navbar from "./Navbar.svelte";
    let config = writable(defaultConfig)
    onMount(async ()=>{
        config.set(await getConfig())
    })
    $: {
        activeTemplates = $config.templates.filter(t => t.active)
    }
    let currentTemplate: TemplateConfig | null;
    let store = writable({});
    let readOnly = true;
    interface composition {
        data: keyValue;
        template: TemplateConfig;
    }
    let allData: composition[] = [];

    const createComposition = (template: TemplateConfig | null, data) => {
        if (template) {
            allData = [
                ...allData,
                {
                    template,
                    data,
                },
            ];
            currentTemplate = null;
            console.log({ template, data });
        }
    };
</script>

<Navbar>Data entry</Navbar>
<Patient>
    <div class="tabs">
        <ul>
            <li
                class="has-text-weight-semibold	has-text-link"
                on:click={() => {
                    currentTemplate = null;
                }}>
                <a> Clear </a>
            </li>
            {#each activeTemplates as template}
                <li
                    on:click={() => {
                        currentTemplate = template;
                    }}>
                    <a>{template.template.tree.name}</a>
                </li>
            {/each}
        </ul>
    </div>
    <div class="columns">
        <div class="column is-half">
            {#if currentTemplate}
            <Composition
                template={currentTemplate.template}
                configuration={currentTemplate.configuration}
                {store}
                initialData={{'ctx/language': 'en'}}
                on:done={e=>createComposition(currentTemplate, e.detail)}
                />
            {:else}
                {#each allData as data}
                    {#key readOnly + JSON.stringify(data.template)}
                        <Composition
                            template={data.template.template}
                            configuration={data.template.configuration}
                            initialData={data.data}
                            {readOnly}/>
                    {/key}
                {/each}
            {/if}
        </div>
        <div class="column is-half">
            <pre>
                {JSON.stringify($store, null, 2)}
            </pre>
        </div>
    </div>
</Patient>
