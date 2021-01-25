<script lang="ts">
    import ListTemplates from "./settings/ListTemplates.svelte";
    import Upload from "./settings/Upload.svelte";
    import { onMount } from "svelte";
    import Navbar from "./Navbar.svelte";
    import { defaultConfig, getConfig, parseFn, serizlizeFn, setConfig } from "./config";
    import { writable } from "svelte/store";

    let config = writable(defaultConfig);
    onMount(async () => {
        config.set(await getConfig());
    });

    $: if (JSON.stringify($config) != JSON.stringify(defaultConfig)) {
        console.log("persisting config")
        setConfig($config);
    }

    let exportLink: string;

    const downloadObjectAsJson = (exportName) => {
        var dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify($config, serizlizeFn));
        var downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const updateTemplate = (template) => {
        config.update((c) => ({
            ...c,
            templates: [
                ...c.templates,
                {
                    template,
                    id: c.templates.length + 1,
                    active: true,
                    configuration: {},
                },
            ],
        }));
    };
    let ehr: string | undefined,
        demographics: string | undefined,
        terminology: string | undefined;
    onMount(() => {
        ({ ehr, demographics, terminology } = $config);
    });
    const updateSettings = () => {
        config.update((c) => ({
            ...c,
            demographics,
            terminology,
            ehr,
        }));
    };
    let inSync: boolean;
    $: inSync =
        $config.demographics == demographics &&
        $config.terminology == terminology &&
        $config.ehr == ehr;
</script>

<Navbar />
<section class="section">
    <div class="container">
        <h1 class="title">Settings</h1>
        <hr />
        <h1 class="subtitle">Templates</h1>
        <ListTemplates {config} />
        <Upload on:upload={(event) => updateTemplate(event.detail)} />
        <hr />
        <form on:submit|preventDefault={updateSettings}>
            <h1 class="subtitle">Services</h1>
            <div class="field">
                <label for="ehrURL" class="label">openEHR</label>
                <input id="ehrURL" class="input" type="url" bind:value={ehr} />
            </div>
            <div class="field">
                <label for="terminology" class="label">Terminology</label>
                <input
                    id="terminology"
                    class="input"
                    type="url"
                    bind:value={terminology}
                />
            </div>
            <div class="field">
                <label for="demographics" class="label">Demographics</label>
                <input
                    id="demographics"
                    class="input"
                    type="url"
                    bind:value={demographics}
                />
            </div>
            <div class="field">
                <button class="button is-success" disabled={inSync}
                    >Update settings</button
                >
            </div>
        </form>
        <hr />
        <h1 class="subtitle">Export/Import</h1>
        <div class="field">
            <button
                class="button"
                on:click={() =>
                    downloadObjectAsJson(
                        "MedblocksExport-" + new Date().toISOString()
                    )}>Export</button
            >
        </div>
        <p class="label">Importing will clear all your current configuration!!!</p>
        <Upload on:upload={e=>config.set(e.detail)} customParser={parseFn} errorMessage="Invalid JSON. Please upload a proper configuration file.">Import</Upload>
    </div>
</section>
