<script lang="ts">
import DisplayContent from "./DisplayContent.svelte";
import DisplayLabel from "./DisplayLabel.svelte";
import Loading from "./Loading.svelte";
export let label: string
export let labelFor: string
export let readOnly: boolean
</script>
<div class="field">
    {#if readOnly}    
        <DisplayLabel>
            {label}
        </DisplayLabel>
        <DisplayContent>
            <slot name="content">
                <Loading></Loading>
            </slot>
        </DisplayContent>
    {:else}
        <label for={labelFor} class="label">
            {label}
        </label>
        <slot></slot>
    {/if}
</div>