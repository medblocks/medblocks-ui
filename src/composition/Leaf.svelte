<script lang="ts">
    import type {
        readableKeyValue,
        Tree,
        writableKeyValue,
    } from "../types/types";
    import Unknown from "../rm/Unknown.svelte";
    import OrdinalWrite from "../rm/Ordinal/OrdinalWrite.svelte";
    import { sanitizeDisplayFunction } from "../rm/utils";
    import QuantityWrite from "../rm/Quantity/QuantityWrite.svelte";
    import OrdinalRead from "../rm/Ordinal/OrdinalRead.svelte";
    import QuantityRead from "../rm/Quantity/QuantityRead.svelte";
    import CodedTextWrite from "../rm/CodedText/CodedTextWrite.svelte";
    import CodedTextRead from "../rm/CodedText/CodedTextRead.svelte";
    import TextWrite from "../rm/Text/TextWrite.svelte";
    import CountWrite from "../rm/Count/CountWrite.svelte";
    import CountRead from "../rm/Count/CountRead.svelte";
    import TextRead from "../rm/Text/TextRead.svelte";
    export let tree: Tree;
    export let type: string;
    export let path: string = "no-path";
    export let aqlPath: string = "no-aql-path";
    export let readOnly: boolean;
    export let childClass: string = "field";
    export let customize: boolean = false;
    export let customizeFunction: Function = (params) => console.log(params);
    /**
     * @param {true|false} render - To render the component or not.
     * @param {function} renderFunction - The function to render the component or not. Takes precedence over render if provided. If the value is not true, then it is considered false.
     * @param {true|false} display - To display the component or not. Still renders it and adds the value to the output.
     * @param {function} displayFunction - The function to display the component or not. Takes precedence over display if provided. If the value is not true, then it is considered false.
     */
    export let render: boolean | undefined = undefined;
    export let renderFunction: Function | undefined = undefined;
    export let display: boolean | undefined = true;
    export let displayFunction: Function | undefined = undefined;
    export let store: writableKeyValue | readableKeyValue;
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
    const getComponent = (rmType: string, readOnly: boolean) => {
        const components = {
            DV_ORDINAL: {
                write: OrdinalWrite,
                read: OrdinalRead,
            },
            DV_QUANTITY: {
                write: QuantityWrite,
                read: QuantityRead,
            },
            DV_CODED_TEXT: {
                write: CodedTextWrite,
                read: CodedTextRead,
            },
            DV_TEXT: {
                write: TextWrite,
                read: TextRead,
            },
            DV_COUNT: {
                write: CountWrite,
                read: CountRead,
            },
        };
        let selected = components[rmType];
        if (selected) {
            selected = selected[readOnly ? "read" : "write"];
            if (selected) {
                return selected;
            }
        }
        return Unknown;
    };
    if (type !== "Leaf") {
        throw new Error("Leaf component got tree not of type leaf");
    }
</script>

<div class={childClass}>
    {#if customize}
        <span
            class="tag is-almond"
            on:click={() =>
                customizeFunction({ path, aqlPath, tree, type: tree.rmType })}
            >{tree.rmType}</span
        >
    {/if}
    <section class:bordered={customize} class:is-hidden={!internalDisplay}>
        {#if internalRender}
            <svelte:component
                this={getComponent(tree.rmType, readOnly)}
                {...$$restProps}
                {tree}
                {path}
                {store}
            />
        {/if}
    </section>
</div>

<style>
    .bordered {
        border-style: solid;
        border-width: 4px;
        border-color: blanchedalmond;
        border-radius: 5px;
    }
    .is-almond {
        background-color: blanchedalmond;
    }
    .tag {
        cursor: pointer;
    }
</style>
