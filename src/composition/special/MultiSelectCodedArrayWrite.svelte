<script lang="ts">
import { onDestroy } from "svelte";
import { destroyAction } from "../../rm/utils";
    import type {
        readableKeyValue,
        writableKeyValue,
        Tree,
    } from "../../types/types";

    export let path: string;
    export let tree: Tree;
    export let store: readableKeyValue;

    let terminology: string;

    $: terminology = tree?.inputs?.[0].terminology ?? "local";

    let selected: { index: number; code: string, value: string }[];
    $: selected = getSelected($store);

    const getSelected = (store): { code: string; index: number, value: string }[] => {
        const paths = Object.keys(store)
            .filter((p) => p.includes(path))
            .filter((p) => p.includes("|code"));
        const result = paths.map((p) => {
            const indexString = p.split(":").pop()?.split("|")[0];
            if (!indexString) {
                throw new Error(`[${p}]cannot parse index`);
            }
            const index = parseInt(indexString);
            const code = store[p];
            return {
                index: index,
                code,
                value: store[p.replace("code", "value")]
            };
        });
        return result;
    };
    const clearAll = ()=>{
        const paths = Object.keys($store)
            .filter((p) => p.includes(path))
        console.log("clearing", {paths})
        destroyAction(paths, store as writableKeyValue)
    }
    
    // const deselect = (code: string): void => {
    //     const allSelected = [...selected]
    //     clearAll()
    //     allSelected
    //     .filter(s=>s.code==code)
    //     .forEach(a=>select({label: a.value, value: a.code}))
    // }

    const select = (option: { label?: string; value: string }): void => {
        if (selected.some((s) => s.code == option.value)){
            // TODO: Implement deselect
        } else {
            const i = selected.length;
            (store as writableKeyValue).update((s) => ({
                ...s,
                [`${path}:${i}|code`]: option.value,
                [`${path}:${i}|value`]: option.label,
                [`${path}:${i}|terminology`]: terminology,
            }));
        }
    };

    
    
    
    onDestroy(()=>{
        const paths = Object.keys($store)
            .filter((p) => p.includes(path))
        destroyAction(paths, store as writableKeyValue) 
    })

</script>

<div class="field">
    <label for={path} class="label">{tree.name}</label>
    {#if tree.inputs && tree.inputs[0].list}
        <div class="buttons">
            {#each tree.inputs[0].list as option}
                <button
                    on:click={() => select(option)}
                    class="button"
                    type="button"
                    class:is-info={selected.some((s) => s.code == option.value)}
                    >{option.label}</button
                >
            {/each}
            <button
                class=" button is-light is-danger"
                type="button"
                on:click={clearAll}>Clear all</button
            >
        </div>
    {:else}
        <p>Tree does not have inputs/inputs does not have list</p>
    {/if}
</div>
