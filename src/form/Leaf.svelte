<script lang="ts">
    import Quantity from '../rm/legacy/Quantity.svelte'
    import CodedText from '../rm/legacy/CodedText.svelte'
    import Text from '../rm/Text/Text.svelte'
    import Snomed from '../rm/CodedText/Snomed.svelte'
    import type { Tree } from '../types/types';
    import Unknown from '../rm/Unknown/Unknown.svelte';
    import Count from '../rm/legacy/Count.svelte';
    import DateTime from '../rm/legacy/DateTime.svelte';
    import Boolean from '../rm/legacy/Boolean.svelte';
    import Uri from '../rm/legacy/URI.svelte';
    import EhrUri from '../rm/legacy/EhrUri.svelte';
    import Duration from '../rm/legacy/Duration.svelte';
    import Date from '../rm/legacy/Date.svelte';
    import Proportion from '../rm/legacy/Proportion.svelte';
    import Ordinal from '../rm/legacy/Ordinal.svelte';
    export let tree: Tree;
    export let type: string;
    export let path: string;
    if (type !== "Leaf") {
        throw new Error("Leaf component got tree not of type leaf");
    }

</script>


{#if tree.rmType === 'DV_QUANTITY'}
    <Quantity {path} {tree}></Quantity>
{:else if tree.rmType === 'DV_CODED_TEXT'}
    <CodedText {path} {tree}></CodedText>
{:else if tree.rmType === 'DV_ORDINAL'}
    <Ordinal {path} {tree}></Ordinal>
{:else if tree.rmType === 'DV_TEXT'}
    <Text {path} {tree}></Text>
{:else if tree.rmType === 'DV_COUNT'}
    <Count {path} {tree}></Count>
{:else if tree.rmType === 'DV_DATE_TIME'}
    <DateTime {path} {tree}></DateTime>
{:else if tree.rmType === 'DV_DATE'}
    <Date {path} {tree}></Date>
{:else if tree.rmType === 'DV_BOOLEAN'}
    <Boolean {path} {tree}></Boolean>
{:else if tree.rmType === 'DV_URI'}
    <Uri {path} {tree}></Uri>
{:else if tree.rmType === 'DV_EHR_URI'}
    <EhrUri {path} {tree}></EhrUri>
{:else if tree.rmType === 'DV_DURATION'}
    <Duration {path} {tree}></Duration>
{:else if tree.rmType === 'DV_PROPORTION'}
    <Proportion {path} {tree}></Proportion>
{:else}
    <Unknown {path} {tree} ></Unknown>
{/if}
