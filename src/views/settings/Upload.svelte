<script lang="ts">
import { createEventDispatcher } from "svelte";
export let errorMessage: string = "Unable to parse JSON. Please upload web template."
export let customParser: Function | undefined = undefined
let files
let error = false
const dispatch = createEventDispatcher()
const handleUpload = (file) => {
        let reader = new FileReader()
        reader.onload = async (event: any)=>{
            try {
                let template = JSON.parse(event.target.result, customParser);
                dispatch('upload', template)
                files = null
                error = false
            } catch (e) {
                console.error("Error parsing JSON")
                error = true
            }
        }
        reader.readAsText(file)
    }
$: if (files && files[0]) {
  handleUpload(files[0])
}
</script>
{#if error}
<div class="notification is-danger">
  {errorMessage}
</div>
{/if}
<div class="field">
    <div class="file">
        <label class="file-label">
          <input class="file-input" type="file" bind:files>
          <span class="file-cta">
            <span class="file-label">
              <slot>
                Add Template
              </slot>
            </span>
          </span>
        </label>
      </div>
</div>