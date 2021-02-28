<script lang="ts">
import Composition from "../../composition/Composition.svelte";
export let form;
export let templateManagerUrl;
let readOnly: boolean = false
let columnClass: string = "is-full"
</script>

{#if form?.template?.webtemplate}
<!-- <div class="columns is-mobile">
    <div class="column">
        <label for="" class="label">Read/Write</label>
        <label class="checkbox is-large">
            <input type="checkbox" bind:checked={readOnly}>
            Read mode
        </label>
    </div>
    <div class="column">
        <label for="" class="label">Layout</label>
        <div class="control" id="type">
            <label class="radio">
              <input type="radio" name="foobar" value="is-full" bind:group={columnClass}>
              Full
            </label>
            <label class="radio">
              <input type="radio" name="foobar" value="is-half" bind:group={columnClass}>
              Half
            </label>
          </div>
    </div>
</div> 
<hr>
-->


<div class="columns">
    <div class={"column" + " " + columnClass}>
        <Composition template={form?.template?.webtemplate} configuration={form?.configuration?.data} {readOnly}></Composition>
    </div>
</div>
{:else}
<p>Please upload a template first</p>
{/if}