<script lang="ts">
    export let configurationStore
    export let aqlPath
    let config = $configurationStore[aqlPath] || {}
    $: {
        configurationStore.update(c=>({
          ...c,
          [aqlPath]: config 
        }))
    }
</script>
<div class="field">
    <label for="orientation" class="label">Display</label>
    <div class="select">
        <select name="" id="orientation" bind:value={config.display}>
            <option value={true}>True</option>
            <option value={false}>False</option>
        </select>
    </div>
</div>