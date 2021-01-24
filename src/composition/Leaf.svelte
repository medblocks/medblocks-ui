<script lang="ts">
    import type { readableKeyValue, Tree, writableKeyValue } from "../types/types";
    import Unknown from "../rm/Unknown.svelte";
    import OrdinalWrite from "../rm/Ordinal/OrdinalWrite.svelte"
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
    export let path: string = 'no-path';
    export let aqlPath: string = 'no-aql-path';
    export let readOnly: boolean;
    export let childClass: string = "field";
    export let customize: boolean = false
    export let customizeFunction: Function = (params) => console.log(params)
    /**
     * @param {true|false} render - To render the component or not.
     * @param {function} renderFunction - The function to render the component or not. Takes precedence over render if provided. If the value is not true, then it is considered false.
     */
    export let render: boolean | undefined = undefined
    export let renderFunction: Function | undefined = undefined
    export let store: writableKeyValue | readableKeyValue
    let internalDisplay: boolean
    $: if (renderFunction) {
        internalDisplay = sanitizeDisplayFunction(
            path,
            renderFunction,
            $store
        );
    } else {
        internalDisplay = render ?? true;
    }
    const getComponent = (rmType: string, readOnly: boolean)=>{
        const components = {
            'DV_ORDINAL': {
                write: OrdinalWrite,
                read: OrdinalRead
            },
            'DV_QUANTITY': {
                write: QuantityWrite,
                read: QuantityRead
            },
            'DV_CODED_TEXT': {
                write: CodedTextWrite,
                read: CodedTextRead            
            },
            'DV_TEXT': {
                write: TextWrite,
                read: TextRead
            },
            'DV_COUNT': {
                write: CountWrite,
                read: CountRead
            }
        }
        let  selected = components[rmType]
        if (selected) {
            selected = selected[readOnly? 'read' : 'write']
            if (selected) {
                return selected
            }
        }
        return Unknown
    }
    if (type !== "Leaf") {
        throw new Error("Leaf component got tree not of type leaf");
    }
</script>
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
<div class={childClass} >
    {#if customize}
        <span class="tag is-almond" on:click={() => customizeFunction({path, aqlPath, tree, type: tree.rmType})}>{tree.rmType}</span>
    {/if}
    <section class:bordered={customize}>
        {#if internalDisplay}
            <svelte:component this={getComponent(tree.rmType, readOnly)} {...$$restProps} {tree} {path} {store}/>
        {/if}
    </section>
</div>
