<script lang="ts">
    export let path
    export let tree
</script>

<div class="field">
    Type {tree.rmType} not yet implimented at <code>{path}</code>
    <pre>
        {JSON.stringify(tree, null, 2)}
    </pre>
</div>