<script lang="ts">
import type { Tree } from "../types/types";
import jsdocs from "../../jsdocs.json"
import type { Writable } from "svelte/store";
import TypeInterface from "./TypeInterface.svelte";

    export let aqlPath
    export let path
    export let readOnly: boolean
    export let type: string
    export let tree: Tree
    export let configurationStore: Writable<any>
        
    let autogen: any [] = []
    $: {
        const autotree = jsdocs[type]
        if (autotree) {
            autogen = autotree[readOnly? 'read': 'write']
        } else {
            autogen = []
        }
    }
</script>
{#each autogen as c}
<div class="field">
    <label for="" class="label">{c.name}</label>
    {#if c.description}
        <p>{c.description}</p>
        {#key readOnly + aqlPath}
        <TypeInterface {...c.type} {readOnly} {configurationStore} {aqlPath} value={c.name}></TypeInterface>
        {/key}
    {/if}
</div>
{/each}