<script lang="ts">
import { onDestroy } from "svelte";

    import type { keyValue, readableKeyValue, Tree, writableKeyValue } from "../types/types";
    import { triggerDestroy } from "./utils";
    export let tree: Tree;
    export let path: string;
    export let type: string;
    export let aqlPath: string;
    export let customize: boolean = false;
    export let readOnly: boolean;
    export let store: readableKeyValue
    export let customizeFunction: Function = (options) => console.log(options)
    if (type !== "Context") {
        throw new Error(`Context component got type ${type}`);
    }
    let processed = true;
    let data: keyValue;
    switch (tree.id) {
        case "start_time":
        case "time":
            data = {
                [path]: new Date().toISOString(),
            };
            break;
        case "category":
            data = {
                [path + "|code"]: "433",
                [path + "|value"]: "event",
                [path + "|terminology"]: "openehr",
            };
            break;
        case "setting":
            data = {
                [path + "|code"]: "238",
                [path + "|value"]: "Other Care",
                [path + "|terminology"]: "openehr",
            };
            break;
        case "language":
            data = {
                [path + "|code"]: "en",
                [path + "|terminology"]: "ISO_639-1",
            };
            break;
        case "territory":
            data = {
                [path + "|code"]: "IN",
                [path + "|terminology"]: "ISO_3166-1",
            };
            break;
        case "encoding":
            data = {
                [path + "|code"]: "UTF-8",
                [path + "|terminology"]: "IANA_character-sets",
            };
            break;
        case "composer":
            data = {
                [path + "|name"]: "Sidharth Ramesh",
            };
            break;
        case "subject":
            data = {};
            break;
        default:
            processed = false;
            data = {};
    }
    let paths = Object.keys(data);
    if (!readOnly) {
        paths.forEach((path) => {
            (store as writableKeyValue).update((s) => ({ ...s, [path]: data[path] }));
        });
        triggerDestroy(Object.keys(data), (store as writableKeyValue))
    }
</script>
<style>
    .tag {
        cursor: pointer;
    }
</style>
{#if customize}

    <div class="tag is-dark" on:click={customizeFunction({tree, path, type, aqlPath})}>{tree.id.toUpperCase()}</div>
{/if}
{#if !processed}
    <p class="has-text-danger">Context not processed: {path}</p>
    <!-- <pre>
    {JSON.stringify(tree, null, 2)}
    </pre> -->
{/if}
