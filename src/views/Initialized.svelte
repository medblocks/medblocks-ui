<script>
import Display from "../form/Display.svelte";
    
</script>
<Display on:close readOnly={true} pending={false}>
    <span slot="title">Recording...</span>
    <span>Say what you want to record...</span>
</Display>