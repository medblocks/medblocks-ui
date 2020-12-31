<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { keyValue } from "../types/types";
    import Display from "./Display.svelte";
    import TextRead from "./Text/TextRead.svelte";
    import TextWrite from "./Text/TextWrite.svelte";
    import Unknown from "./Unknown/Unknown.svelte";

    export let name: string | undefined = undefined;
    export let type: string;
    export let path: string | undefined = undefined;
    export let options: any = undefined;
    export let store: Writable<keyValue>;
    export let children: any[] = [];
    export let parentClass: string = "columns";
    export let childClass: string = "column";
    export let display: boolean = true;
    export let displayFunction: ((s: keyValue) => any) | undefined = undefined;
    export let displayLabel: boolean = true;
    export let labelClass: string = "subtitle";


    const getComponent = (type: string) => {
        const components = {
            "text.read": TextRead,
            "text.write": TextWrite,

        };
        const component = components[type];
        if (!component) {
            return Unknown;
        } else {
            return component;
        }
    };
    let internalType: string;
    $: internalType = getComponent(type);
</script>

<Display {display} {displayFunction} {path} {store}>
    {#if type == 'group'}
        {#if displayLabel}
            <p class={labelClass}>{name}</p>
        {/if}
        <div class={parentClass}>
            {#each children as child}
                <svelte:self {...child} {store}/>
            {/each}
        </div>
    {:else}
        <div class={childClass}>
            <svelte:component this={internalType} {...options} {store}/>
        </div>
    {/if}
</Display>
