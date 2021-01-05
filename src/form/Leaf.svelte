<script lang="ts">
    import type { keyValue, Tree } from "../types/types";
    import type { Writable } from "svelte/store";
    import { copy } from "./utils";
    import Unknown from "../rm/Unknown.svelte";
import OrdinalWrite from "../rm/OrdinalWrite.svelte";
    export let tree: Tree;
    export let type: string;
    export let path: string;
    export let aqlPath: string;
    export let readOnly: false;
    export let store: Writable<keyValue>
    export let childClass: string = "field";
    export let customize: boolean = false
    export let customizeFunction: Function
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
                console.log(selected)
                return selected
            }
        }
        console.log("returning unknown")
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
        <span class="button is-small is-white" on:click={()=>{copy(path)}}>📋</span>
    {/if}
    <section class:bordered={customize}>
        <svelte:component this={getComponent(tree.rmType, readOnly)} {store} {path} {tree}/>
    </section>
</div>
