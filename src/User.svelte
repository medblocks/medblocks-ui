<script lang="ts">
    import {auth} from "./firebase"
    import {authState} from "rxfire/auth"
    import Profile from "./Profile.svelte"
    import Login from "./Login.svelte"
    import {track} from "./trackUser"
    let user = authState(auth)
    $ : if ($user) {
        track($user)
        
    }
</script>

{#if $user}
    <slot user={$user}></slot>
{:else}
    <Login></Login>
{/if}
