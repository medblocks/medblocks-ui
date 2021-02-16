<script lang="ts">    
    import { copy } from "../../composition/utils";
    export let options;

</script>


<h1 class="subtitle">{options.type}</h1>
<div class="field">
    <div class="buttons">
    <button
        class="button is-small"
        on:click={() => {
            copy(options.aqlPath);
        }}>Copy AQL path 📋</button>
    <button
    class="button is-small"
    on:click={() => {
        copy(options.path);
    }}>Copy Path 📋</button>
    </div>
</div>
<!-- <div class="field">
    <textarea name="" id="jsoneditor" cols="30" rows="10" class="textarea" bind:value={configutaionJSONlocal}/>
</div> -->

<!-- <div class="field">
    <button class="button" on:click={updateFromJson}>Update from JSON</button>
</div> -->

