<script lang="ts">
    import {onMount, afterUpdate, createEventDispatcher} from "svelte"
    import {pressAndHold} from "./pressAndHold.js"
    export let recording: boolean
    onMount(()=>{
        document.documentElement.classList.add("has-navbar-fixed-bottom")
    })
    const scrollToBottom = ()=>{
        let html = document.documentElement
        html.scroll({
            top: html.scrollHeight,
            behavior: 'smooth'
        })
    }
    afterUpdate(scrollToBottom)
</script>
<nav
class="navbar is-fixed-bottom"
class:has-background-transparent={!recording} 
class:has-background-primary-transparent={recording}
role="navigation"
aria-label="main navigation">
    <div class="navbar-menu">
        <div class="navbar-center navbar-start">
            <button use:pressAndHold on:start on:stop class="button is-rounded is-large nofocus" class:is-primary={!recording} class:is-light={recording} class:is-white={recording}>
                <span class="icon" class:has-text-danger={recording}><span class="icon-mic"></span></span>
            </button>
        </div>
    </div>
</nav>


<style>
.has-background-primary-transparent {
    background-color: #6b63ff70;
}
.has-background-transparent {
    background-color: rgba(255, 255, 255, 0.431);
}
.navbar-center {
    flex-grow: 1;
    justify-content: center !important;
    padding-top: 5px;
    padding-bottom: 5px;
}
.button {
      --scale-value: 1;
    transform: scale3d(var(--scale-value), var(--scale-value), 1);
    transition: transform cubic-bezier(0.175, 0.885, 0.32, 1.275) .2s;
    }
</style>