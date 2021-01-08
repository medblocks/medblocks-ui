<script lang="ts">
    import type { Tree, writableKeyValue } from "../types/types";
    import Unknown from "../rm/Unknown.svelte";
    import OrdinalWrite from "../rm/Ordinal/OrdinalWrite.svelte"
    import { sanitizeDisplayFunction } from "../rm/utils";
    export let tree: Tree;
    export let type: string;
    export let path: string = 'no-path';
    export let aqlPath: string = 'no-aql-path';
    export let readOnly: boolean;
    export let childClass: string = "field";
    export let customize: boolean = false
    export let customizeFunction: Function = (params) => console.log(params)
    export let display: boolean = true
    export let displayFunction: Function | undefined = undefined
    export let store: writableKeyValue
    let internalDisplay: boolean
    $: if (displayFunction) {
        internalDisplay = sanitizeDisplayFunction(
            path,
            displayFunction,
            $store
        );
    } else {
        internalDisplay = display;
    }
    const getComponent = (rmType: string, readOnly: boolean)=>{
        const components = {
            'DV_ORDINAL': {
                write: OrdinalWrite
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
