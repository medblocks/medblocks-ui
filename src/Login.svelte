<script lang="ts">
    import {auth, googleProvider} from "./firebase"
    import {fade, slide, fly} from "svelte/transition"

</script>
<section transition:fly={{duration: 400, y: -600, opacity: 0}} class="hero is-fullheight is-primary">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half">
                <div class="buttons is-centered">
                    <button class="button" on:click={()=>auth.signInWithPopup(googleProvider)}>Sign in with Google</button>
                </div>
                <div class="buttons is-centered">
                  <button class="button" on:click={()=>auth.signInAnonymously()}>Sign in as a Guest</button>
              </div>
          </div>
        </div>
      </div>
    </div>
</section>