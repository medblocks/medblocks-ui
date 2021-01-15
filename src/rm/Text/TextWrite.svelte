<script lang="ts">
import type { Tree, writableKeyValue } from "../../types/types";


    export let path: string
    export let tree: Tree
    export let store: writableKeyValue
    export let wrapperClass: string = "field"
    export let labelClass: string = "label"
    export let textAreaClass: string = "textarea"
</script>

<div class={wrapperClass}>
    <label for={path} class={labelClass}>{tree.name}</label>
    <textarea type="text" id={path} class={textAreaClass} bind:value={$store[path]}/>
</div>