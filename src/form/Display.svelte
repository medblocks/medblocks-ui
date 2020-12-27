<script lang="ts">
import { createEventDispatcher } from "svelte";
import Countdown from "./Countdown.svelte";

    export let readOnly: boolean
    export let status: 'pending'|'done'|'entered'
    const dispatch = createEventDispatcher()
</script>


<!-- {#if readOnly}
    <article class="message">
        <form on:submit|preventDefault={()=>dispatch('done')}>
    <div class="message-header">
        {#if status == 'pending'}
            <button class="button is-small is-success is-light is-rounded">✓</button>
        {:else if status == 'entered'}
            <Countdown on:done={()=>dispatch('done')}></Countdown>
        {/if}
        <slot name="title"></slot>
        <button class="delete" type="button" on:click={()=>{dispatch('close')}}></button>
    </div>
    <div class="message-body">
        <slot></slot>
    </div>
        </form>
    </article> -->
<!-- {:else} -->
<div class="box">
    <form on:submit|preventDefault={()=>dispatch('done')}>
    <h1 class="subtitle"><slot name="title"></slot></h1>
    <slot></slot>
    <div class="field">
        <div class="buttons">
            <button class="button is-fullwidth is-success">Submit</button>
        </div>
    </div>
    </form>
</div>
<!-- {/if} -->
