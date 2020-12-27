<script lang="ts">
import { createEventDispatcher } from "svelte";

let files
let error = false
const dispatch = createEventDispatcher()
const handleUpload = (file) => {
        let reader = new FileReader()
        reader.onload = async (event: any)=>{
            try {
                let template = JSON.parse(event.target.result);
                console.log("Updating template", {template})
                dispatch('upload', template)
                files = null
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

<div class="field">
    <div class="file">
        <label class="file-label">
          <input class="file-input" type="file" bind:files>
          <span class="file-cta">
            <span class="file-label">
              Add Template
            </span>
          </span>
          {#if files && files[0]}    
            <span class="file-name">
                {files[0].name}
            </span>
          {/if}
        </label>
      </div>
</div>