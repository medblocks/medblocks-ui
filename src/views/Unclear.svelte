<script>
import Display from "../form/Display.svelte";


    
</script>
<Display on:close readOnly={true} pending={false}>
    <span slot="title">Unclear audio</span>
    <span>Please try again. We're having a hard time hearing you.</span>
</Display>