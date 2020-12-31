<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { keyValue } from "../../types/types";
    import { onDestroy, onMount } from "svelte";
    import { sanitizeComputeFunction } from "../functions";
    import Display from "../Display.svelte";

    export let path: string;
    export let store: Writable<keyValue>;
    export let name: string;
    export let displayLabel: boolean = true;
    export let display: boolean = true;
    export let displayFunction: ((s: keyValue) => any) | undefined = undefined;
    export let computeFunction: ((s: keyValue) => any) | undefined = undefined;
    export let defaultValue: string | undefined = undefined;
    export let labelClass: string = "label";
    export let textAreaClass: string = "textarea";
    export let inputClass: string = "input";
    export let fieldClass: string = "field";
    export let widget: "textarea" | "input" = "textarea";

    // Evaluate compute function
    $: if (computeFunction) {
        let result = sanitizeComputeFunction(path, computeFunction, $store);
        if (result && result !== $store[path]) {
            store.update((s) => ({ ...s, [path]: result }));
        }
    }
    onMount(() => {
        store.update((s) => ({ ...s, [path]: defaultValue }));
    });
    onDestroy(() => {
        store.update((s) => {
            let { [path]: _, newObject } = s;
            return newObject;
        });
    });
</script>

<Display {display} {displayFunction} {store} {path}>
    <div class={fieldClass}>
        {#if displayLabel && name}
            <label for={path} class={labelClass}>{name}</label>
        {/if}
        {#if widget == 'textarea'}
            <textarea
                type="text"
                id={path}
                class={textAreaClass}
                bind:value={$store[path]} />
        {:else}
            <input
                type="text"
                id={path}
                class={inputClass}
                bind:value={$store[path]} />
        {/if}
    </div>
</Display>
