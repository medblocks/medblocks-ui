<script lang="ts">
    import Leaf from "./Leaf.svelte";
    import Context from "../rm/Context.svelte";
    import { slide, scale } from "svelte/transition";
    import type {
        Extracted,
        readableKeyValue,
        writableKeyValue,
    } from "../types/types";
    import type { Writable } from "svelte/store";
    import { sanitizeDisplayFunction } from "../rm/utils";
    export let type: string;
    export let path: string;
    export let label: string;
    export let repeatable: boolean;
    export let children: Extracted[];
    export let childClass = "field";
    export let store: readableKeyValue;
    export let readOnly: boolean;
    export let aqlPath: string;
    export let rmType: string;
    export let customize: boolean = false;
    export let customizeFunction: Function;
    /**
     * @param {true|false} render - To render the component or not.
     * @param {function} renderFunction - The function to render the component or not. Takes precedence over render if provided. If the value is not true, then it is considered false.
     * @param {true|false} displayTitle - To display the title or not.
     * @param {true|false} canAddRepeatable - For repeatable elements, allow adding new elements?
     */
    export let render: boolean | undefined = undefined;
    export let renderFunction: Function | undefined = undefined;
    // Currently only simple templates
    export let displayTitle = true;
    export let canAddRepeatable = true;
    export let passCustomize: boolean = false;

    let internalDisplay: boolean;
    $: if (renderFunction) {
        internalDisplay = sanitizeDisplayFunction(
            path,
            renderFunction,
            $store
        );
    } else {
        internalDisplay = render ?? true;
    }
    const getCountFromStore = () => {
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
        return externalCount;
    };
    let count = getCountFromStore() || 1;
    function reduceCount() {
        if (count > 1) {
            count -= 1;
        }
    }
    function increaseCount() {
        count += 1;
    }

    let paths: string[];
    $: paths = Object.keys($store).filter((p) => p.startsWith(path));
    $: if (readOnly && repeatable) {
        let regExp = new RegExp(`${path}:(\\d+).*`);
        let externalCount = paths.reduce(
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
        count = externalCount || count;
    }
    if (type !== "Group") {
        throw new Error("Group component got tree not of type group");
    }
</script>
{#if internalDisplay}
<div class={childClass} class:bordered={customize && !passCustomize}>
    {#if customize && !passCustomize}
        <span
            class="tag is-cyan"
            on:click={() =>
                customizeFunction({ path, aqlPath, type, repeatable })}>
            {rmType}
            {#if repeatable}- REPEATABLE{/if}
        </span>
    {/if}
    
        {#if displayTitle && label}
            <h4 class="has-text-weight-bold is-size-6 mb-3 has-text-grey">
                {label}
            </h4>
        {/if}
        {#if repeatable}
            {#each [...Array(count).keys()] as index}
                <!-- transition:slide="{{duration: 300 }}" -->

                <div class="field" style="box-sizing: border-box;">
                    <svelte:self
                        path={`${path}:${index}`}
                        repeatable={false}
                        {readOnly}
                        {store}
                        {type}
                        {label}
                        {children}
                        displayTitle={false}
                        {customize}
                        passCustomize={customize}
                        {customizeFunction}
                        {rmType}
                        {aqlPath}
                    />
                    <hr />
                </div>
            {/each}
            {#if canAddRepeatable}
                <div class="buttons is-right">
                    {#if count > 1}
                        <button
                            class:is-hidden={readOnly}
                            transition:scale
                            class="button is-small is-danger is-light"
                            on:click={reduceCount}
                            type="button"
                            ><i class="icon icon-arrow-up" /></button
                        >
                    {/if}
                    <button
                        class:is-hidden={readOnly}
                        class="button is-sma ll is-success is-light"
                        on:click={increaseCount}
                        type="button"><i class="icon icon-arrow-down" /></button
                    >
                </div>
            {/if}
        {:else}
            {#each children as child}
                {#if child.type === "Group"}
                    <svelte:self
                        {...child}
                        path={`${path}/${child.path}`}
                        {customize}
                        {customizeFunction}
                        {store}
                        {readOnly}
                    />
                {:else if child.type === "Leaf"}
                    <Leaf
                        {...child}
                        path={`${path}/${child.path}`}
                        {customize}
                        {customizeFunction}
                        {store}
                        {readOnly}
                    />
                {:else if child.type === "Context"}
                    <Context
                        {...child}
                        path={`${path}/${child.path}`}
                        {customize}
                        {customizeFunction}
                        {store}
                        {readOnly}
                    />
                {:else}
                    <p>Not Group or Leaf type: {child.type}</p>
                    <pre>{JSON.stringify(child, null, 2)}</pre>
                {/if}
            {/each}
        {/if}
    </div>
{:else if customize}
<div class={childClass} class:bordered={customize && !passCustomize}>
    {#if customize && !passCustomize}
        <span
            class="tag is-cyan"
            on:click={() =>
                customizeFunction({ path, aqlPath, type, repeatable })}>
            {rmType}
            {#if repeatable}- REPEATABLE{/if}
        </span>
    {/if}
</div>
{/if}

<style>
    .is-cyan {
        background-color: lightcyan;
    }
    .tag {
        cursor: pointer;
    }
    .bordered {
        border-style: solid;
        border-width: 4px;
        border-color: lightcyan;
        border-radius: 5px;
    }
</style>
