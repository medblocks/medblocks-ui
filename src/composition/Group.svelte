<script lang="ts">
    import Leaf from "./Leaf.svelte";
    import Context from "../rm/Context.svelte";
    import type {
        Extracted,
        readableKeyValue,
        writableKeyValue,
    } from "../types/types";
    import { sanitizeDisplayFunction } from "../rm/utils";
    import MultiSelectCodedArrayWrite from "./special/MultiSelectCodedArrayWrite.svelte";
    import MultiSelectCodedArrayRead from "./special/MultiSelectCodedArrayRead.svelte";
    import { partition } from "./utils";
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
     * @param {'normal'|'tabbed'} component - Type of component to render - Tabbed only works properly if used on a non-repeatable parent group.
     * @param {true|false} displayTitle - To display the title or not.
     * @param {string} customTitle - A custom label for the group
     * @param {true|false} display - To display the component or not. Still renders it and adds the value to the output.
     * @param {function} displayFunction - The function to display the component or not. Takes precedence over display if provided. If the value is not true, then it is considered false.
     * @param {true|false} render - To render the component or not.
     * @param {function} renderFunction - The function to render the component or not. Takes precedence over render if provided. If the value is not true, then it is considered false.
     * @param {true|false} canAddRepeatable - For repeatable elements, allow adding new elements?
     * @param {true|false} multiSelectCodedArray - Render buttons? Only for repeatable codedtext. 
     * @param {true|false} divider - Between repeatable elements
     */
    export let customTitle: string | undefined = undefined;
    export let multiSelectCodedArray: boolean = false;
    export let divider: boolean = true;
    export let render: boolean | undefined = undefined;
    export let renderFunction: Function | undefined = undefined;
    // Currently only simple templates
    export let display: boolean | undefined = true;
    export let displayFunction: Function | undefined = undefined;
    export let displayTitle = true;
    export let canAddRepeatable = true;
    export let passCustomize: boolean = false;
    export let component: "normal" | "tabbed" = "normal";
    let internalRender: boolean;

    $: if (renderFunction) {
        internalRender = sanitizeDisplayFunction(path, renderFunction, $store);
    } else {
        internalRender = render ?? true;
    }

    let internalDisplay: boolean;
    $: if (displayFunction) {
        internalDisplay = sanitizeDisplayFunction(
            path,
            displayFunction,
            $store
        );
    } else {
        internalDisplay = display ?? true;
    }

    let contextItems: Extracted[];
    let groupLeafItems: Extracted[];
    $: {
        [contextItems, groupLeafItems] = partition(
            children,
            (s) => s.type === "Context"
        );
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
    const appendPath = (parentPath, childPath) => {
        if (parentPath && childPath) {
            return `${parentPath}/${childPath}`;
        }

        if (childPath) {
            return childPath;
        }

        return parentPath;
    };
    let parentClass = "field";
    let activeTab = 0;

    if (component === "tabbed" && repeatable) {
        console.error(
            "Tabbed interface on a repeatable element not yet implemented. You may experience unexpected results."
        );
    }
</script>

{#if internalRender}
    <div class={parentClass} class:bordered={customize && !passCustomize}>
        {#if customize && !passCustomize}
            <span
                class="tag is-cyan"
                on:click={() =>
                    customizeFunction({ path, aqlPath, type, repeatable })}
            >
                {rmType}
                {#if repeatable}- REPEATABLE{/if}
            </span>
        {/if}

        {#if displayTitle && (customTitle || label)}
            <h4 class="has-text-weight-bold is-size-6 mb-3 has-text-grey">
                {customTitle || label}
            </h4>
        {/if}
        {#if component === "tabbed"}
            <div class="tabs">
                <ul>
                    {#each groupLeafItems as child, index}
                        <li class:is-active={activeTab === index}>
                            <a
                                on:click={() => {
                                    activeTab = index;
                                }}>{child.label || child?.tree?.name}</a
                            >
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
        {#if repeatable}
            {#if rmType == "DV_CODED_TEXT" && multiSelectCodedArray && children[0]}
                {#if readOnly}
                    <MultiSelectCodedArrayRead
                        tree={children[0].tree}
                        {path}
                        {store}
                    />
                {:else}
                    <MultiSelectCodedArrayWrite
                        tree={children[0].tree}
                        {path}
                        {store}
                    />
                {/if}
            {:else}
                {#each [...Array(count).keys()] as index}
                    <!-- transition:slide="{{duration: 300 }}" -->
                    <div class="field" style="box-sizing: border-box;">
                        <svelte:self
                            {...$$props}
                            path={`${path}:${index}`}
                            repeatable={false}
                            displayTitle={false}
                            passCustomize={customize}
                        />
                        {#if divider && count > 1 && index !== count - 1}
                            <hr />
                        {/if}
                    </div>
                {/each}
                {#if canAddRepeatable}
                    <div class="buttons is-right">
                        {#if count > 1}
                            <!-- transition:scale -->
                            <button
                                class:is-hidden={readOnly}
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
                            type="button"
                            ><i class="icon icon-arrow-down" /></button
                        >
                    </div>
                {/if}
            {/if}
        {:else}
            {#each groupLeafItems as child, i}
                <div
                    class="field"
                    class:is-hidden={component === "tabbed" && activeTab !== i}
                >
                    {#if child.type === "Group"}
                        <svelte:self
                            {...child}
                            path={appendPath(path, child.path)}
                            {customize}
                            {customizeFunction}
                            {store}
                            {readOnly}
                        />
                    {:else if child.type === "Leaf"}
                        <Leaf
                            {...child}
                            path={appendPath(path, child.path)}
                            {customize}
                            {customizeFunction}
                            {store}
                            {readOnly}
                        />
                    {:else}
                        <p>Not Group or Leaf type: {child.type}</p>
                        <pre>{JSON.stringify(child, null, 2)}</pre>
                    {/if}
                </div>
            {/each}
            {#each contextItems as child}
                <Context
                    {...child}
                    path={appendPath(path, child.path)}
                    {customize}
                    {customizeFunction}
                    {store}
                    {readOnly}
                />
            {/each}
        {/if}
    </div>
{:else if customize}
    <div class="field" class:bordered={customize && !passCustomize}>
        {#if customize && !passCustomize}
            <span
                class="tag is-cyan"
                on:click={() =>
                    customizeFunction({ path, aqlPath, type, repeatable })}
            >
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
