<script lang="ts">
    import { onMount } from "svelte";
    import Form from "../form/Form.svelte";
    import type { Template } from "../types/types";
    import Patient from "./Patient.svelte";

    export let config;
    console.log("From data entry", config);
    let activeTemplates: Template[];
    $: {
        activeTemplates = $config.templates
            .filter((t) => t.active)
            .map((t) => t.template);
    }
    let currentTemplate: Template | null
</script>

<style>
    .buttons {
        overflow-x: scroll;
    }
</style>
<Patient>
    <div class="tabs">
        <ul>
            <li class="has-text-weight-semibold	has-text-link" on:click={()=> {currentTemplate = null}}>
                <a>
                   Clear
                </a>
            </li>
            {#each activeTemplates as template}
            <li on:click={() => {currentTemplate = template}}>
                <a>{template.tree.name}</a>
            </li>
        {/each}
        </ul>
      </div>
    <div class="columns">
        <div class="column is-half">
            {#if currentTemplate}
            <Form template={currentTemplate}/>
            {/if}
        </div>
        <div class="column" />
    </div>
</Patient>
