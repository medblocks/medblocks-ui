<script lang="ts">
    import { link } from "svelte-spa-router";
    import axios from "axios";
    export let templateManagerUrl;
    import { formatDistance, addMinutes } from "date-fns";
import { timeDiff } from "./utils";

    let forms: {
        id: number;
        name: string;
        last_updated: string;
        template: any;
        configuration: any;
    }[] = [];
    const loadData = async () => {
        const r = await axios.get(templateManagerUrl + "/form");
        forms = r.data;
    };

    let newFormName: string;

    const addForm = async () => {
        await axios.post(templateManagerUrl + "/form", { name: newFormName });
        await loadData();
        newFormName = "";
    };

    const deleteForm = async (id) => {
        await axios.delete(`${templateManagerUrl}/form/${id}`);
        await loadData();
    };
</script>

<div class="columns">
    <div class="column">
        {#await loadData()}
            loading...
        {:then}
            {#each forms as form}
                <div class="box">
                    <div class="columns is-mobile">
                        <div class="column">
                            <p>
                                <a href="/customize/{form.id}/basic" use:link>
                                    <strong class="is-size-4"
                                        >{form.name}</strong
                                    >
                                </a>
                                <small
                                    >v{form?.template?.id || 0}.{form
                                        ?.configuration?.id || 0}</small
                                >
                            </p>
                            <p class="has-text-grey">
                                Updated {timeDiff(form.last_updated)} ago
                            </p>
                        </div>

                        <div class="column">
                            <div class="buttons is-pulled-right">
                                <button
                                    class="button is-danger is-outlined"
                                    on:click={() => deleteForm(form.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
            <div class="field">
                <form on:submit|preventDefault={addForm}>
                    <label for="name" class="label">Add New Form</label>
                    <div class="columns">
                        <div class="column">
                            <input
                                type="text"
                                class="input"
                                required
                                bind:value={newFormName}
                            />
                        </div>
                        <div class="column">
                            <button
                                class="button is-link is-outlined"
                                type="submit"
                            >
                                Add form
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        {/await}
    </div>
</div>
