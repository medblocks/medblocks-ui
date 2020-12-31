<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { keyValue } from "../../types/types";
    import Display from "../Display.svelte";

    export let path: string;
    export let store: Writable<keyValue>;
    export let name: string;
    export let displayLabel: boolean = true;
    export let display: boolean = true;
    export let displayFunction: ((s: keyValue) => any) | undefined = undefined;
    export let labelClass: string = "label";
    export let valueClass: string = "";
    export let fieldClass: string = "field";
</script>

<style>
    p {
        white-space: pre-line;
    }
</style>

<Display {display} {displayFunction} {store} {path}>
    <div class={fieldClass}>
        {#if displayLabel}
            <label for={path} class={labelClass}>{name}</label>
        {/if}
        <p class={valueClass}>{$store[path]}</p>
    </div>
</Display>
