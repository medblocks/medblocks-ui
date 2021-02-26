<script lang="ts">
    import ListForms from "./ListForms.svelte";
    import Upload from "./settings/Upload.svelte";
    import { onMount } from "svelte";
    import Navbar from "./Navbar.svelte";
    import { defaultConfig, getConfig, parseFn, serizlizeFn, setConfig } from "./config";
    import { writable } from "svelte/store";

    export let templateManagerUrl = "https://t.medblocks.org"
</script>

<Navbar />
<section class="section">
    <div class="container">
        <h1 class="title">Forms</h1>
        <hr />
        <ListForms {templateManagerUrl}/>
    </div>
</section>
