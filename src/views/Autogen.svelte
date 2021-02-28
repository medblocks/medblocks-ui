<script lang="ts">
import type { Tree, writableKeyValue } from "../types/types";
import jsdocs from "../../jsdocs.json"
import type { Writable } from "svelte/store";
import TypeInterface from "./TypeInterface.svelte";
import Macros from "./Macros.svelte";

    export let aqlPath
    export let path
    export let readOnly: boolean
    export let type: string
    export let tree: Tree
    export let configurationStore: Writable<any>
    export let store: writableKeyValue
        
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

<Macros {aqlPath} {readOnly} {configurationStore} {type}></Macros>

{#each autogen as c}
<div class="field">
    <label for="" class="label">{c.name}</label>
    {#if c.description}
        <p>{c.description}</p>
        {#key readOnly + aqlPath}
        <TypeInterface {...c.type} {readOnly} {configurationStore} {aqlPath} value={c.name} {store}></TypeInterface>
        {/key}
    {/if}
</div>
{/each}