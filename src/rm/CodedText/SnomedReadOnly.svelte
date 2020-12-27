<script lang="ts">
    import type { Tree } from "../../types/types";
    import type { SearchResult } from "./search";
    import { createQueryBody, parseSearchResult } from "./search";
    import { initialize, destroyAction } from "../utils";
    import { fade } from "svelte/transition";
    import axios from "axios";
    import Error from "../helpers/Error.svelte";
    import { writable } from "svelte/store";
    import DisplayLabel from "./../helpers/DisplayLabel.svelte";
    import Loading from "../helpers/Loading.svelte";
    import { BehaviorSubject } from "rxjs"
    import { debounceTime, switchMap, startWith} from "rxjs/operators"
    import DisplayContent from "../helpers/DisplayContent.svelte";
    export let path: string;
    export let tree: Tree;
    let paths: string[] = [
        path + "|code",
        path + "|value",
        path + "|terminology",
    ];
    let { store, readOnly } = initialize(paths, tree);

    let selected: SearchResult | undefined
    
    $: {
        if (readOnly){
            if ($store[paths[0]]) {
                selected = {
                    code: $store[paths[0]],
                    display: $store[paths[1]], //Get display based on user preference?
                    value: $store[paths[1]]
                }
            } else {
                selected = undefined
            }
        }
    }
    // TODO: Communicate with other snomed widgets and offer suggestions
</script>
{#if readOnly}
<div class="field">
    <DisplayLabel>{tree.name}</DisplayLabel>
    {#if selected}
    <DisplayContent>{selected.display}</DisplayContent>
    {:else}
    <Loading></Loading>
    {/if}
</div>
{:else}
    <div class="field">
    </div>
{/if}