<script lang="ts">
    export let src: string
    export let selected: boolean = false
    let playing = false
    $: audio = new Audio(src)
    const play = ()=>{
        audio.play()
        playing = true
    }
    const pause = ()=>{
        audio.pause()
        playing = false
    }
    

</script>

<div class="box" on:click class:has-background-primary={selected}>
    {#if playing}
    <button class="button" on:click={pause}>Pause</button>
    {:else}
    <button class="button" on:click={play}>Play</button>
    {/if}
</div>