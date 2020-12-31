<script lang="ts">
    import { writable } from "svelte/store";
    import Node from "./rm/Node.svelte";
    let store = writable({});

    const schema = {
        name: "The main template",
        path: "",
        type: "group",
        store,
        parentClass: "box",
        childClass: "field",
        children: [
            {
                type: "text.write",
                options: {
                    name: "Write Display",
                    path: "another1",
                },
            },
            {
                type: "text.write",
                options: {
                    name: "Test Display",
                    path: "another2",
                    displayFunction: (store) => {
                        if (store["another1"]) {
                            return true;
                        }
                        return false;
                    },
                },
                store,
            },
        ],
    };
</script>

<section class="section">
    <div class="container">
        <Node {...schema} />
        <!-- <TextWrite {...options}></TextWrite>
        <hr>
        <TextRead {...options}></TextRead>
        <hr> -->
        <pre>
            {JSON.stringify($store, null, 2)}
        </pre>
    </div>
</section>
