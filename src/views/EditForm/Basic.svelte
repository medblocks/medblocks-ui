<script lang="ts">
    import axios from "axios";
    import Dropzone from "svelte-file-dropzone";
    import { createEventDispatcher } from "svelte";
    import { timeDiff } from "../utils";
    export let form;
    export let templateManagerUrl;

    const dispatch = createEventDispatcher();
    let newName = form.name;
    let error: string | undefined;
    const put = async (options: {name: string, template_id?: number, configuration_id?: number}) => {
        const {name, template_id, configuration_id} = options
        await axios.put(`${templateManagerUrl}/form/${form.id}`, {
            name,
            template_id: template_id || form?.template?.id,
            configuration_id: configuration_id || form?.configuration?.id,
        });
        dispatch("reload")
    };

    
    const handleDrop = async (e)=>{
        const {acceptedFiles} = e.detail
        if (acceptedFiles.length < 1) {
            error = 'Invalid file format. Please upload a .json file.'
            return
        }
        await handleUpload(acceptedFiles[0])
    }
    
    const handleUpload = async (file: File) => {
        const string = await file.text()
        try {
            const template = JSON.parse(string);
            const r = await axios.post(`${templateManagerUrl}/form/${form.id}/template`, {
                    webtemplate: template
                })
            const newTemplateId = r.data.id
            await put({name: newName, template_id: newTemplateId})
            error = undefined
        } catch (e) {
            error = e
        }
    }
</script>

<div class="block">
    <label for="rename" class="label"> Name </label>
    <input type="text" id="rename" class="input" bind:value={newName} />
</div>

<div class="block">
    <label for="dropzone" class="label">Webtemplate</label>
    
    <Dropzone on:drop={handleDrop} multiple={false}>Drag 'n drop a webtemplate file here. Or click to select.</Dropzone>
    <div class="field">
        {#if form.template && form.template.webtemplate}
        <p>
            <p>Updated {timeDiff(form.template.last_updated)} ago</p>
        {:else}
        <p>No webtemplate uploaded</p>
        {/if}
    </div>
    {#if error}
        <p class="has-text-danger">
            {error}
        </p>
    {/if}
</div>

<div class="field">
    <button class="button" on:click={()=>{put({name: newName, template_id: undefined, configuration_id: undefined})}}> Save </button>
</div>
