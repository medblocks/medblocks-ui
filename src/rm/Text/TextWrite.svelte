<script lang="ts">
import type { Tree, writableKeyValue } from "../../types/types";
import { triggerDestroy } from "../utils";

    const sFn = (s) => {
        const p = ""
        if (s[p] === "something") {
            return "Attempts:\nGrade:\hSupraglottic airway:"
        }
    }
    export let path: string
    export let tree: Tree
    export let store: writableKeyValue
    export let wrapperClass: string = "field"
    export let labelClass: string = "label"
    export let textAreaClass: string = "textarea"
    export let suggestFunction: Function = sFn
    export let rows: number = 1
    $: triggerDestroy([path], store)
</script>

<div class={wrapperClass}>
    <label for={path} class={labelClass}>{tree.name}</label>
    <textarea rows={rows} type="text" id={path} class={textAreaClass} bind:value={$store[path]}/>
</div>