<script lang="ts">
    import Leaf from "./Leaf.svelte";
    import Context from "../rm/legacy/Context.svelte";
    import { slide, scale } from "svelte/transition";
    import { getContext } from "svelte";
    import type { Extracted, keyValue } from "../types/types";
    import type { Writable } from "svelte/store";
    export let type: string;
    export let path: string;
    export let label: string;
    export let repeatable: boolean;
    export let children: Extracted[];

    // Currently only simple templates
    export let displayTitle = true;
    export const CAN_ADD = true;

    let store: Writable<keyValue> = getContext("store");
    let readOnly: boolean = getContext("readOnly");
    const  getCountFromStore = () => {
        const paths = Object.keys($store).filter((p) => p.startsWith(path));
        const regExp = new RegExp(`${path}:(\\d+).*`);
        const externalCount = paths.reduce(
            (previousValue, currentPath): number => {
                let matches = currentPath.match(regExp);
                if (matches) {
                    let indexString = matches[1];
                    let index = parseInt(indexString);
                    index = index + 1;
                    if (index > previousValue) {
                        return index;
                    }
                }
                return previousValue;
            },
            1
        );
        return externalCount
    }
    let count = getCountFromStore() || 1;
    function reduceCount() {
        if (count > 1) {
            count -= 1;
        }
    }
    function increaseCount() {
        count += 1;
    }

    let paths : string[]
    $: paths = Object.keys($store).filter(p=>p.startsWith(path))
    $: if (readOnly && repeatable){
        let regExp = new RegExp(`${path}:(\\d+).*`)
        let externalCount = paths.reduce((previousValue, currentPath): number=>{
            let matches = currentPath.match(regExp)
            if (matches){
                let indexString = matches[1]
                let index = parseInt(indexString)
                index = index + 1
                if (index > previousValue){
                    return index
                }
            }
            return previousValue
        }, 1)
        count = externalCount || count
    }
    if (type !== "Group") {
        throw new Error("Group component got tree not of type group");
    }
</script>
{#if displayTitle && label}
<h4 class="has-text-weight-bold is-size-6 mb-3 mt-5 has-text-grey">
    {label}    
</h4>
{/if}
{#if repeatable}
    {#each [...Array(count).keys()] as index}
        <!-- transition:slide="{{duration: 300 }}" -->
        <div class="field" style="box-sizing: border-box;" >
            <svelte:self
                path={`${path}:${index}`}
                repeatable={false}
                {type}
                {label}
                {children}
                displayTitle={false} />
        <hr>
        </div>
    {/each}
    {#if CAN_ADD}
        <div class="buttons is-right">
            {#if count > 1}
                <button
                    class:is-hidden={readOnly}
                    transition:scale
                    class="button is-small is-danger is-light"
                    on:click={reduceCount}
                    type="button"><i class="icon icon-arrow-up" /></button>
            {/if}
            <button
                class:is-hidden={readOnly}
                class="button is-sma ll is-success is-light"
                on:click={increaseCount}
                type="button"><i class="icon icon-arrow-down" /></button>
        </div>
    {/if}
{:else}
    {#each children as child}
        {#if child.type === 'Group'}
            <svelte:self {...child} path={path + child.path} />
        {:else if child.type === 'Leaf'}
            <Leaf {...child} path={path + child.path} />
        {:else if child.type === 'Context'}
            <Context {...child} path={path + child.path} />
        {:else}
            <p>Not Group or Leaf type: {child.type}</p>
            <pre>{JSON.stringify(child, null, 2)}</pre>
        {/if}
    {/each}
{/if}
