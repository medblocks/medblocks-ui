<script lang="ts">
    import { element, onMount } from "svelte/internal";
    import type { writableKeyValue } from "../types/types";
    export let configurationStore;
    export let aqlPath: string;
    export let readOnly: boolean;
    export let type;
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
    onMount(() => {
        config =
            $configurationStore?.[aqlPath]?.[readOnly ? "read" : "write"] ?? {};
    });
    const update = (cfg) => {
        configurationStore.update((c) => ({
            ...c,
            [aqlPath]: {
                ...c?.[aqlPath],
                [readOnly ? "read" : "write"]: {
                    ...c?.[aqlPath]?.[readOnly ? "read" : "write"],
                    ...cfg,
                },
            },
        }));
    };
    const clusterRepeatable = () => {
        config = {
            ...config,
            titleClass: "label",
            skipChildLabel: true,
            multiSelectCodedArray: true,
        };
        update(config);
    };
</script>

<div class="buttons">
    {#if type === "Group"}
        <div class="button" on:click={clusterRepeatable}>
            Make cluster Repeatable
        </div>
    {/if}
</div>
