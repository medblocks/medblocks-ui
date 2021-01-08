<script lang="ts">
    export let href: string
    import {link} from 'svelte-spa-router'

</script>
<style>
    .button {
        position: relative;
        /* right: 2rem; */
        left: 2rem;
        top: 1rem;
    }
    div {
        position: relative
    }
</style>
<div>
    <a {href} class="button is-rounded" use:link>
        <slot></slot>
    </a>
</div>