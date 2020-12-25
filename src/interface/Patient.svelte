
<script lang="ts">
import DisplayContent from "../rm/helpers/DisplayContent.svelte";
import DisplayLabel from "../rm/helpers/DisplayLabel.svelte";

    let hospitalNumber
    let input 

    const getHospitalNumber = () => {
        hospitalNumber=input; 
        input=null
    }
</script>
<section class="section">
    <div class="container">
        {#if hospitalNumber}
        <div class="field">
            <div class="control">
                <p>
                    <span class="subtitle">
                        SIDHARTH R, 
                    </span>
                    <span>
                        23 Male
                    </span>
                 </p>
            </div>
        </div>
        {:else}
        <form on:submit|preventDefault={getHospitalNumber}>
        <div class="field has-addons">
            <div class="control">
              <input class="input" type="text" placeholder="Enter Hospital Number" bind:value={input}>
            </div>
            <div class="control">
              <button class="button">
                Get
              </button>
            </div>
        </div>
        </form>
        {/if}
        {#if hospitalNumber}
            <slot name="templates"></slot>
        {/if}
        
    </div>
</section>
{#if hospitalNumber}
    <slot {hospitalNumber}></slot>
{/if}
