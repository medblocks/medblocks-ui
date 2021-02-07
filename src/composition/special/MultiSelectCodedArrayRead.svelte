<script lang="ts">
    import type {
        readableKeyValue,
        Tree,
    } from "../../types/types";

    export let path: string;
    export let tree: Tree;
    export let store: readableKeyValue;

    let terminology: string;

    $: terminology = tree?.inputs?.[0].terminology ?? "local";

    let selected: { index: number; code: string, value: string }[];
    $: selected = getSelected($store);

    const getSelected = (store): { code: string; index: number, value: string }[] => {
        const paths = Object.keys(store)
            .filter((p) => p.includes(path))
            .filter((p) => p.includes("|code"));
        const result = paths.map((p) => {
            const indexString = p.split(":").pop()?.split("|")[0];
            if (!indexString) {
                throw new Error(`[${p}]cannot parse index`);
            }
            const index = parseInt(indexString);
            const code = store[p];
            return {
                index: index,
                code,
                value: store[p.replace("code", "value")]
            };
        });
        return result;
    };
    // const deselect = (code: string): void => {
    //     const allSelected = [...selected]
    //     clearAll()
    //     allSelected
    //     .filter(s=>s.code==code)
    //     .forEach(a=>select({label: a.value, value: a.code}))
    // }

</script>

<div class="field">
    <label for={path} class="label">{tree.name}</label>
    <p class="">
        {selected.map(s=>s.value).join(", ")}
    </p>
</div>
