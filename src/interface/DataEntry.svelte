<script lang="ts">
    import Form from "../form/Form.svelte";
import type { Template } from "../types/types";
    import {templateList, templates} from "../views/templates"
    let forms: Template[] = []
</script>
<section class="section">
    <div class="buttons">
        {#each templateList as template}
            <button class="button is-info" on:click={()=>forms = [...forms, template]}>
                {template.tree.name}
            </button>
        {/each}
    </div>
</section>

<section class="section">
    <div class="columns">
        <div class="column is-half">
            {#each forms as template}
            <Form {template} ></Form>
            {/each}
        </div>
        <div class="column">
            
        </div>
    </div>
    
</section>