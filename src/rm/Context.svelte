<script lang="ts">
    import { getContext, setContext } from "svelte";
    import { writable } from "svelte/store";
    import type { Writable } from "svelte/store";

    import type {
        keyValue,
        readableKeyValue,
        Tree,
        writableKeyValue,
    } from "../types/types";
    import { destroyAction, triggerDestroy } from "./utils";
    export let tree: Tree;
    export let path: string;
    export let type: string;
    export let aqlPath: string;
    export let customize: boolean = false;
    export let readOnly: boolean;
    export let store: readableKeyValue;
    export let customizeFunction: Function = (options) => console.log(options);
    
    let otherContextPaths: Writable<{}> = getContext("contextPaths");

    if (type !== "Context") {
        throw new Error(`Context component got type ${type}`);
    }
    let processed = true;
    let data: keyValue = {};
    // TODO: Register all context paths to a store accessible to other Context components. Exclude context paths from this check
    const checkIfPathIsUsed = (path, keyValues: keyValue, otherContexts: string []): boolean => {
        return Object.keys(keyValues).some((p) => {
            if (typeof keyValues[p] != "undefined" && keyValues[p] !== null) {
                if (p.includes(path) && !otherContexts.includes(p)) {
                    return true;
                }
            }
            return false;
        });
    };
    let active: boolean;
    let parentPath: string;
    $: parentPath = path.replace(`/${tree.id}`, "").replace("context", "");
    $: active = checkIfPathIsUsed(parentPath, $store, Object.keys($otherContextPaths));
    $: {
        console.log($otherContextPaths)
    }
    $: if (active) {
        if (!readOnly) {
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
            const pathsObject = Object.fromEntries(paths.map(p=>([p, true])))
            otherContextPaths.update(s=>{
                return {...s, ...pathsObject}
            })
            paths.forEach((path) => {
                if (!$store[path]) {
                    (store as writableKeyValue).update((s) => ({
                        ...s,
                        [path]: data[path],
                    }));
                }
            });
            triggerDestroy(Object.keys(data), store as writableKeyValue);
        }
    } else {
        let paths = Object.keys(data);
        if (paths.length > 0) {
            if (Object.keys($store).some(p=>paths.includes(p))){
                console.log("Must clean up contexts", {paths});
                destroyAction(paths, store as writableKeyValue);
            }
        }
    }
</script>

{#if customize}
    <div
        class="tag is-dark"
        on:click={customizeFunction({ tree, path, type, aqlPath })}
    >{tree.id.toUpperCase()}</div>
{/if}
{#if !processed}
    <p class="has-text-danger">Context not processed: {path}</p>
    <!-- <pre>
    {JSON.stringify(tree, null, 2)}
    </pre> -->
{/if}

<style>
    .tag {
        cursor: pointer;
    }
</style>
