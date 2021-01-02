<script lang="ts">
import type { Writable } from "svelte/store";
import type { Template } from "../../types/types";
    import type {Config, TemplateConfig} from "../config"
    export let config: Writable<Config>

    const deleteTemplate = (id)=>{
        config.update(c=>({
            ...c,
            templates: c.templates.filter(template=>template.id != id)
        }))
    }
</script>

<div class="columns">
    <div class="column">
        <table class="table is-hoverable is-fullwidth">
            <thead>
                <th>Template Id</th>
                <th>Name</th>
                <th>Active</th>
                <th>Actions</th>
            </thead>
            <tbody>
                {#each $config.templates as template}
                    <tr>
                        <td>{template.template.templateId}</td>
                        <td>{template.template.tree.name}</td>
                        <td>
                            <div class="field">
                                <input
                                    bind:checked={template.active}
                                    type="checkbox"
                                    class="checkbox is-large" />
                            </div>
                        </td>
                        <td>
                            <div class="buttons">
                                <button class="button">
                                    Customize
                                </button>
                                <button class="button is-danger" on:click={()=>deleteTemplate(template.id)}>
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
