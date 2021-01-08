<script>
import { createEventDispatcher, onDestroy, onMount } from "svelte";


    let seconds = 3;
    let interval
    const dispatch = createEventDispatcher()
    onMount(()=>{
        interval = setInterval(() => {
            if (seconds <= 1) {
                dispatch('done')
            } else {
                seconds -= 1
            }
        }, 1000);
    })
    onDestroy(()=>clearInterval(interval))
</script>

<button class="button is-small is-success is-light is-rounded">{seconds}</button>