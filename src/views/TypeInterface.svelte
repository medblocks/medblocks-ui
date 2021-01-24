<script lang="ts">
    import { element, onMount } from "svelte/internal";
    import { get } from "svelte/store";
    import type { writableKeyValue } from "../types/types";

    export let type: string;
    export let name: string | undefined = undefined;
    export let elements: { type: string; value: any }[] | undefined = undefined;
    export let configurationStore;
    export let aqlPath: string;
    export let readOnly: boolean;
    export let value: string;
    export let store: writableKeyValue;
    //     $: {
    //     configurationStore.update(c=>({
    //       ...c,
    //       [aqlPath]: config
    //     }))
    // }
    // let config: $configurationStore[aqlPath] || {}
    // $:{
    //     internalValue =  ?? undefined
    // }
    let config = {};
    let fnString = "";
    let invalidFn = false;
    let currentResult = undefined;
    $: if (fnString) {
        try {
            const fn = Function("return " + fnString)();
            currentResult = fn($store);
            console.log("Setting fn", fn);
            if (config[value] && config[value].toString() == fn.toString()){
            } else {
                config = { ...config, [value]: fn };
            }
            invalidFn = false;
        } catch (e) {
            console.error(e)
            invalidFn = true;
        }
    } else {
        invalidFn = false
    }
    onMount(() => {
        config =
            $configurationStore?.[aqlPath]?.[readOnly ? "read" : "write"] ?? {};
    });
    $: {
        configurationStore.update((c) => ({
            ...c,
            [aqlPath]: {
                ...c?.[aqlPath],
                [readOnly ? "read" : "write"]: {
                    ...c?.[aqlPath]?.[readOnly ? "read" : "write"],
                    ...config,
                },
            },
        }));
    }
</script>

{#if type === "NameExpression"}
    <div class="field">
        {#if name === "string"}
            <input
                type="text"
                class="input"
                placeholder="Default"
                bind:value={config[value]}
            />
        {:else if name === "number"}
            <input
                type="number"
                class="input"
                placeholder="Default"
                bind:value={config[value]}
            />
        {:else if name === "function"}
            <textarea
                class="textarea"
                class:is-danger={invalidFn}
                name=""
                id=""
                rows="1"
                bind:value={fnString}
            />
            {#if fnString && !invalidFn}
                <p>
                    Current result:
                </p>
                <pre>{JSON.stringify(currentResult, null, 2)}</pre>
            {/if}
        {/if}
    </div>
{:else if type === "UnionType"}
    {#if elements}
        <div class="select">
            <select name="" id="" bind:value={config[value]}>
                <option value={undefined}>Default</option>
                {#each elements as element}
                    <option value={element.value}>{element.value}</option>
                {/each}
            </select>
        </div>
    {/if}
{/if}

<style>
    .textarea {
        font-family: monospace;
    }
</style>
