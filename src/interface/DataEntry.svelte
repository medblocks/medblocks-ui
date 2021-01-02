<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { testConfig } from "../form/configuration";
    import Form from "../form/Form.svelte";
    import type { keyValue, Template, UITemplate } from "../types/types";
    import Patient from "./Patient.svelte";

    export let config;
    console.log("From data entry", config);
    let activeTemplates: Template[];
    $: {
        activeTemplates = $config.templates
            .filter((t) => t.active)
            .map((t) => t.template);
    }
    let currentTemplate: Template | null;
    let store = writable({});
    let readOnly = true;
    interface composition {
        data: keyValue;
        template: Template;
    }
    let allData: composition[] = [];

    const createComposition = (template, data) => {
        allData = [
            ...allData,
            {
                template,
                data,
            },
        ];
        currentTemplate = null;
        console.log({ template, data });
    };
</script>

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
                    <a>{template.tree.name}</a>
                </li>
            {/each}
        </ul>
    </div>
    <div class="columns">
        <div class="column is-half">
            {#if currentTemplate}
                <Form
                    template={currentTemplate}
                    configuration={testConfig}
                    {store}
                    on:done={(e) => createComposition(currentTemplate, e.detail)} />
            {:else}
                {#each allData as data}
                    {#key readOnly + JSON.stringify(data.template)}
                        <Form
                            template={data.template}
                            data={data.data}
                            {readOnly}
                            on:close={() => {
                                readOnly = false;
                            }}
                            on:done={(e) => createComposition(data.template, e.detail)} />
                        <pre>{JSON.stringify(data.data, null, 2)}</pre>
                    {/key}
                {/each}
            {/if}
        </div>
    </div>
</Patient>
