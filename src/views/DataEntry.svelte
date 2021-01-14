<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Composition from "../composition/Composition.svelte";
    import type { keyValue, Template, UITemplate } from "../types/types";
    import type {TemplateConfig} from "./config"
    import BackButton from "./BackButton.svelte";
    import Patient from "./Patient.svelte";
    let activeTemplates: TemplateConfig[];
    
    import { defaultConfig, getConfig } from "./config";
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
        template: Template;
    }
    let allData: composition[] = [];

    const createComposition = (template: TemplateConfig | null, data) => {
        if (template) {
            allData = [
                ...allData,
                {
                    template: template.template,
                    data,
                },
            ];
            currentTemplate = null;
            console.log({ template, data });
        }
    };
</script>

<BackButton href="/settings">Settings</BackButton>
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
                />
            {:else}
                {#each allData as data}
                    {#key readOnly + JSON.stringify(data.template)}
                        <Composition
                            template={data.template}
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
