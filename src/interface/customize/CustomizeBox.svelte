<script lang="ts">
import Global from "./Global.svelte"
    export let configurationStore
    export let options
    const components = {
        'Global': Global,
    }
</script>
<div class="box">
    <h1 class="title is-6">
        Type: {options.type}
    </h1>
    <svelte:component this={components[options.type]} {configurationStore} {...options}></svelte:component>
</div>