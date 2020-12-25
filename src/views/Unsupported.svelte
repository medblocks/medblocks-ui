<script lang="ts">
    import Display from "../form/Display.svelte";
    import {templateList} from "./templates"
</script>
<Display on:close readOnly={true} status='done'>
    <span slot="title">Unsupported template</span>
    <div class="content">
        <p>We only support the following templates for now:</p>
        <ul>
            {#each templateList as template}
                <li>{template.tree.name}</li>
            {/each}
        </ul>
        <p>More templates are coming soon. You can also request templates by <a href="mailto:tornadoalert@gmail.com">emailing us</a>.</p>
    </div>
</Display>