<script lang="ts">
    import { onMount } from "svelte";

    import type { Writable } from "svelte/store";

    import type { keyValue } from "../../types/types";

    import Display from "../Display.svelte";

    export let path: string;
    export let store: Writable<keyValue>;
    export let name: string;
    export let displayLabel: boolean = true;
    export let display: boolean = true;
    export let displayFunction: ((s: keyValue) => any) | undefined = undefined;
    export let computeFunction: ((s: keyValue) => any) | undefined = undefined;
    export let labelClass: string = "label";
    export let fieldClass: string = "field";
    export let inputClass: string = "input";
    export let parentClass: string = "columns";
    export let childClass: string = "column";
    export let selectClass: string = "select";
    export let displayUnit: boolean = true;
    export let units:
        | { value: string; label?: string }[]
        | undefined = undefined;
    export let disableSingleUnit: boolean = true;
    export let defaultMagnitude: number | undefined = undefined;
    export let defaultUnit: string | undefined = undefined;
    onMount(() => {
        if (defaultMagnitude) {
            store.update((s) => ({
                ...s,
                [path + "|magnitude"]: defaultMagnitude,
            }));
        }
        if (defaultUnit) {
            store.update((s) => ({ ...s, [path + "|unit"]: defaultUnit }));
        }
    });
</script>

<Display {display} {displayFunction} {store} {path}>
    <div class={fieldClass}>
        {#if displayLabel}
            <label for={path} class={labelClass}>{name}</label>
        {/if}
        <div class={parentClass}>
            <div class={childClass}>
                <input
                    id={path}
                    type="number"
                    name="magnitude"
                    class={inputClass}
                    bind:value={$store[path + '|magnitude']} />
            </div>
            {#if units && displayUnit}
                <div class={childClass}>
                    <div class={selectClass}>
                        <select
                            bind:value={$store[path + '|unit']}
                            disabled={disableSingleUnit && units.length === 1}>
                            {#each units as unit}
                                <option value={unit.value} label={unit.label} />
                            {/each}
                        </select>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</Display>
