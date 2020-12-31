<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { keyValue } from "../types/types";

    import { sanitizeDisplayFunction } from "./functions";

    export let store: Writable<keyValue>;
    export let display: boolean;
    export let displayFunction: ((s: keyValue) => any) | undefined = undefined;
    export let path: string;

    let internalDisplay: boolean;

    $: if (displayFunction) {
        internalDisplay = sanitizeDisplayFunction(
            path || "no-path-provided",
            displayFunction,
            $store
        );
    } else {
        internalDisplay = display;
    }
</script>

{#if internalDisplay}
<slot></slot>
{/if}