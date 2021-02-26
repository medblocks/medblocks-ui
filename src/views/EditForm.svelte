<script lang="ts">
    export let params: {
        templateIndex: string;
        view: "template" | "configuration" | "display" | "history";
    };
    import Navbar from "./Navbar.svelte";
    import { link } from "svelte-spa-router";
    import { push } from "svelte-spa-router";
    import axios from "axios";

    import Basic from "./EditForm/Basic.svelte";
    import View from "./EditForm/View.svelte";
    import Customize from "./EditForm/Customize.svelte";

    import { timeDiff } from "./utils";

    let templateManagerUrl = "https://t.medblocks.org";
    const getData = async () => {
        const r = await axios.get(
            templateManagerUrl + "/form/" + params.templateIndex
        );
        data = r.data;
        return data;
    };

    let data: any = getData();

    const reload = async () => {
        data = getData();
    };
    const views = {
        basic: Basic,
        view: View,
        configure: Customize,
    };
</script>

<Navbar />
<section class="section">
    <div class="container">
        {#await data}
            <h1 class="title">Loading...</h1>
        {:then form}
            <h1 class="title">{form.name}</h1>
            <h1 class="subtitle">Updated {timeDiff(form.last_updated)} ago</h1>
            <div class="tabs">
                <ul>
                    {#each Object.keys(views) as v}
                        <li class:is-active={params.view == v}>
                            <a
                                class="is-capitalized"
                                href="/customize/{params.templateIndex}/{v}"
                                use:link>{v}</a
                            >
                        </li>
                    {/each}
                </ul>
            </div>
            <svelte:component
                this={views[params.view]}
                {form}
                {templateManagerUrl}
                on:reload={reload}
            />
        {/await}
    </div>
</section>
