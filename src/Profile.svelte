<script lang="ts">
    import type {firebaseUser} from "./firebase"
    export let user: firebaseUser
</script>

<p>
    Logged in as {user.displayName}
</p>