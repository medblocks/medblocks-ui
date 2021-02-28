<script lang="ts">
    import Leaf from "./Leaf.svelte";
    import Context from "../rm/Context.svelte";
    import type { Extracted, readableKeyValue } from "../types/types";
    import { sanitizeDisplayFunction } from "../rm/utils";
    import MultiSelectCodedArrayWrite from "./special/MultiSelectCodedArrayWrite.svelte";
    import MultiSelectCodedArrayRead from "./special/MultiSelectCodedArrayRead.svelte";
    import { partition } from "./utils";
    export let type: string;
    export let path: string;
    export let label: string;
    export let repeatable: boolean;
    export let children: Extracted[];
    export let store: readableKeyValue;
    export let readOnly: boolean;
    export let aqlPath: string;
    export let rmType: string;
    export let customize: boolean = false;
    export let customizeFunction: Function;
    /**
     * @param {'normal'|'tabbed'|'horizontal'} component - Type of component to render - Tabbed only works properly if used on a non-repeatable parent group.
     * @param {true|false} displayTitle - To display the title or not.
     * @param {'is-size-5 has-text-grey mb-2'|'title is-3'
     * |'mb-2 is-size-5 has-text-grey mt-4'|'mb-2 is-size-5 has-text-grey mt-4 is-underlined'
     * |'label'
     * |'title is-6 is-uppercase'
     * } titleClass - Class of title
     * @param {true|false} titleHr - A horizontal rules after the title
     * @param {string} customTitle - A custom label for the group
     * @param {true|false} display - To display the component or not. Still renders it and adds the value to the output.
     * @param {function} displayFunction - The function to display the component or not. Takes precedence over display if provided. If the value is not true, then it is considered false.
     * @param {true|false} render - To render the component or not.
     * @param {function} renderFunction - The function to render the component or not. Takes precedence over render if provided. If the value is not true, then it is considered false.
     * @param {true|false} canAddRepeatable - For repeatable elements, allow adding new elements?
     * @param {true|false} multiSelectCodedArray - Render buttons? Only for repeatable codedtext.
     * @param {true|false} divider - Between repeatable elements
     * @param {true|false} skipChildLabel - To skip the child label for special elements?
     */
    export let titleClass: string = "mb-2 is-size-5 has-text-grey mt-4";
    export let customTitle: string | undefined = undefined;
    export let multiSelectCodedArray: boolean = false;
    export let render: boolean | undefined = undefined;
    export let renderFunction: Function | undefined = undefined;
    // Currently only simple templates
    export let titleHr: boolean | undefined = false;
    export let display: boolean | undefined = true;
    export let displayFunction: Function | undefined = undefined;
    export let displayTitle = true;
    export let canAddRepeatable = true;
    export let passCustomize: boolean = false;
    export let component: "normal" | "tabbed" | "horizontal" = "normal";
    export let skipChildLabel: boolean = false;
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
    let parentClass: string;
    let childClass: string;
    $: if (component === "horizontal") {
        parentClass = "columns";
        childClass = "column";
    } else {
        parentClass = "field";
        childClass = "field";
    }
    let activeTab = 0;

    if (component === "tabbed" && repeatable) {
        console.error(
            "Tabbed interface on a repeatable element not yet implemented. You may experience unexpected results."
        );
    }
</script>

{#if internalRender}
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

        {#if displayTitle && (customTitle || label)}
            <h4 class={titleClass}>
                {customTitle || label}
                {#if titleHr}
                    <hr />
                {/if}
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
            {#if multiSelectCodedArray && children[0]}
                {#if readOnly}
                    <MultiSelectCodedArrayRead
                        tree={children[0].tree}
                        {path}
                        {store}
                        {skipChildLabel}
                    />
                {:else}
                    <MultiSelectCodedArrayWrite
                        tree={children[0].tree}
                        {path}
                        {store}
                        {skipChildLabel}
                    />
                {/if}
            {:else}
                {#each [...Array(count).keys()] as index}
                    <!-- transition:slide="{{duration: 300 }}" -->
                    <div
                        class:box={canAddRepeatable}
                        class:field={!canAddRepeatable}
                        style="box-sizing: border-box;"
                    >
                        {#if index > 0}
                            <!-- transition:scale -->
                            <button
                                on:click={reduceCount}
                                class="delete is-pulled-right"
                            />
                        {/if}
                        <svelte:self
                            {...$$props}
                            path={`${path}:${index}`}
                            repeatable={false}
                            displayTitle={false}
                            passCustomize={customize}
                        />
                        <!-- <div class="level">
                            <button class="button is-success is-light">Add another</button>
                        </div> -->
                    </div>
                {/each}
                {#if canAddRepeatable}
                    <div class="buttons is-right">
                        <button on:click={increaseCount} class="button"
                            >Add another
                            {#if customTitle || label}
                                {(customTitle || label)?.toLowerCase()}
                            {/if}
                        </button>
                    </div>
                {/if}
            {/if}
        {:else}
            <div class={parentClass}>
                {#each groupLeafItems as child, i}
                    <div
                        class={childClass}
                        class:is-hidden={component === "tabbed" &&
                            activeTab !== i}
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
            </div>
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
