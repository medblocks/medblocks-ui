
<script lang="ts">
    let hospitalNumber = '1234'
    let input 

    const getHospitalNumber = () => {
        hospitalNumber=input; 
        input=null
    }
</script>
<section class="section">


    <div class="container">
        <!-- <div class="columns">
            {#if hospitalNumber}
            <div class="column">
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
            </div>
            {:else}
            <div class="column">
                <p>No patient selected</p>
            </div>
            {/if}
            <div class="column">
                <form on:submit|preventDefault={getHospitalNumber}>
                    <div class="field has-addons">
                        <div class="control">
                          <input class="input" type="text" placeholder="Hospital number/name" bind:value={input}>
                        </div>
                        <div class="control">
                          <button class="button is-success">
                            Get
                          </button>
                        </div>
                        <div class="control">
                            <button class="button" type="button">
                              Temp.
                            </button>
                          </div>
                    </div>
                </form>
            </div>
        </div> -->
        {#if hospitalNumber}
            <slot name="templates"></slot>
            <slot {hospitalNumber}></slot>
        {/if}
    </div>

</section>
