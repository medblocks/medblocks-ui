<svelte:options tag="custom-button" />

<script>
    import { createEventDispatcher } from "svelte";
    export let name;
    const dispatch = createEventDispatcher();
    $: {
        console.log({name})
    }
    const clickedAction = (data) => {
        console.log(data);
        dispatch("hello", data);
    };
</script>

<button on:click={() => clickedAction({ the: "document", is: "here" })}
    >{name}</button
>
