<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Form from "./src/form/Form.svelte";
    import type { keyValue, Template } from "./src/types/types";
    import Patient from "./src/interface/Patient.svelte";

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
        currentTemplate = null
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
                    {store}
                    on:done={(e) => createComposition(currentTemplate, e.detail)} />
            {:else}
                {#each allData as data}
                    {#key readOnly}
                        <Form
                            template={data.template}
                            data={data.data}
                            {readOnly}
                            on:close={() => {
                                readOnly = false;
                            }}
                            on:done={(e) => createComposition(data.template, e.detail)} />
                            <pre>{JSON.stringify(data.data)}</pre>
                    {/key}
                {/each}
            {/if}
        </div>
    </div>
</Patient>
