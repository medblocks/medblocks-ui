<script lang="ts">
    import type { Writable } from "svelte/store";
    export let configurationStore: Writable<any>;
    let configutaionJSON: string;
    $: configutaionJSON = JSON.stringify($configurationStore, null, 2);
</script>

<style>
    pre {
        white-space: pre-wrap; /* css-3 */
        white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
        white-space: -pre-wrap; /* Opera 4-6 */
        white-space: -o-pre-wrap; /* Opera 7 */
        word-wrap: break-word; /* Internet Explorer 5.5+ */
    }
</style>
<div class="field">
    <label for="configuration" class="label">Current Configuration</label>
    <pre id="configuration">{configutaionJSON}</pre>
</div>
