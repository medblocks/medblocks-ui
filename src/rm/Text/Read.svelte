<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { keyValue, Tree } from "../../types/types";

    export let path: string
    export let store: Writable<keyValue>
    export let tree: Tree
    export let displayLabel: boolean = true
    export let display: boolean = true
    export let labelClass: string = 'label'
    export let valueClass: string = 'textarea'
    export let fieldClass: string = 'field'
    export let errorClass: string = 'has-text-danger'
    
    let error: string|null = null

    $: if (tree.rmType != 'DV_TEXT') {
        error = 'rmType of element not DV_TEXT'
    }

</script>

<div class={fieldClass}>
    {#if error}
    <p class={errorClass}>{error}</p>
    {:else}
    {#if display}
        {#if displayLabel}
        <label for={path} class={labelClass}>{tree.name}</label>
        {/if}
        <p class={valueClass}>{$store[path]}</p>
    {/if}
    {/if}
</div>
