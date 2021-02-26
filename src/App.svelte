<script lang="ts">
import Forms from "./views/Forms.svelte";
import Router from 'svelte-spa-router'
import EditForm from "./views/EditForm.svelte";

const routes = {
    '/': Forms,
    '/customize/:templateIndex/:view?': EditForm
}
</script>


<svelte:head>
    <title>Medblocks UI</title>
</svelte:head>

<Router {routes}/>
