<script lang="ts">
import { element, onMount } from "svelte/internal"
import type { Writable } from "svelte/store";

    export let type: string
    export let name: string | undefined
    export let elements: {type: string, value: any} [] | undefined
    export let configurationStore
    export let aqlPath: string
    export let readOnly: boolean
    export let value: string
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
    let config = {}
    onMount(()=>{
        config = $configurationStore?.[aqlPath]?.[readOnly? 'read': 'write'] ?? {}
    })
    $: {
        configurationStore.update(c=>({
            ...c,
            [aqlPath]: {
                ...c?.[aqlPath],
                [readOnly? 'read': 'write']: {
                    ...c?.[aqlPath]?.[readOnly? 'read': 'write'],
                    ...config
                }
            }
        }))
    }

</script>

{#if type === 'NameExpression'}
<div class="field">
    {#if name === 'string'}
    <input type="text" class="input" placeholder="Default" bind:value={config[value]}>
    {:else if name === 'number'}
    <input type="number" class="input" placeholder="Default" bind:value={config[value]}>
    {:else if name === 'function'}
    <textarea name="" id="" cols="30" rows="10"></textarea>
    {/if}
</div>

{:else if type === 'UnionType'}
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