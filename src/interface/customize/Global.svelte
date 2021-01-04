<script lang="ts">
    export let configurationStore
    export let type
    let global = $configurationStore.global || {}
    $: {
        configurationStore.update(c=>({
          ...c,
          global
        }))
    }
</script>
<div class="field">
    <label for="orientation" class="label">Layout</label>
    <div class="select">
        <select name="" id="orientation" bind:value={global.horizontal}>
            <option value={false}>Vertical</option>
            <option value={true}>Horizontal</option>
        </select>
    </div>
</div>