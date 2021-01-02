<script lang="ts">
    import Quantity from "../rm/Quantity.svelte";
    import CodedText from "../rm/CodedText.svelte";
    import Text from "../rm/Text.svelte";
    import Snomed from "../rm/CodedText/Snomed.svelte";
    import type { Tree } from "../types/types";
    import Unknown from "../rm/Unknown.svelte";
    import Count from "../rm/Count.svelte";
    import DateTime from "../rm/DateTime.svelte";
    import Boolean from "../rm/Boolean.svelte";
    import Uri from "../rm/URI.svelte";
    import EhrUri from "../rm/EhrUri.svelte";
    import Duration from "../rm/Duration.svelte";
    import Date from "../rm/Date.svelte";
    import Proportion from "../rm/Proportion.svelte";
    import Ordinal from "../rm/Ordinal.svelte";
    export let tree: Tree;
    export let type: string;
    export let path: string;
    export let aqlPath: string;
    export let childClass: string = "field";
    export let customize: boolean = false
    export let customizeFunction: Function
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
    .tag {
        background-color: blanchedalmond;
        cursor: pointer;
    }
</style>
<div class={childClass} >
    {#if customize}
        <span class="tag" on:click={() => customizeFunction({path, aqlPath, tree, type})}>{tree.rmType}</span>
    {/if}
    <section class:bordered={customize===true}>
    {#if tree.rmType === 'DV_QUANTITY'}
        <Quantity {path} {tree} />
    {:else if tree.rmType === 'DV_CODED_TEXT'}
        <CodedText {path} {tree} />
    {:else if tree.rmType === 'DV_ORDINAL'}
        <Ordinal {path} {tree} />
    {:else if tree.rmType === 'DV_TEXT'}
        <Text {path} {tree} />
    {:else if tree.rmType === 'DV_COUNT'}
        <Count {path} {tree} />
    {:else if tree.rmType === 'DV_DATE_TIME'}
        <DateTime {path} {tree} />
    {:else if tree.rmType === 'DV_DATE'}
        <Date {path} {tree} />
    {:else if tree.rmType === 'DV_BOOLEAN'}
        <Boolean {path} {tree} />
    {:else if tree.rmType === 'DV_URI'}
        <Uri {path} {tree} />
    {:else if tree.rmType === 'DV_EHR_URI'}
        <EhrUri {path} {tree} />
    {:else if tree.rmType === 'DV_DURATION'}
        <Duration {path} {tree} />
    {:else if tree.rmType === 'DV_PROPORTION'}
        <Proportion {path} {tree} />
    {:else}
        <Unknown {path} {tree} />
    {/if}
    </section>
</div>
