
<script lang="ts">
    import {storage, db, FieldValue} from "../firebase"
    import {collectionData} from "rxfire/firestore"
    import {map, startWith, switchMap} from "rxjs/operators"
    import type {firebaseUser} from "../firebase"
    import type { Observable } from "rxjs";
    import type { Recording } from "../types/types";
    import {templateList, templates} from "./templates"
    import Form from "../form/Form.svelte";
    import RecordingButton from "./RecordingButton.svelte";
    import Loading from "./Loading.svelte";
    import { onMount, onDestroy } from "svelte";
    import Initialized from "./Initialized.svelte";
    import Display from "../form/Display.svelte";
    import Unclear from "./Unclear.svelte";
    import Unsupported from "./Unsupported.svelte";
    import mixpanel from "mixpanel-browser"
    
    export let user: firebaseUser
    let recorder: MediaRecorder | undefined
    let sessions = db.collection('intern')
    let stream: MediaStream
    onMount(async ()=>{
        await db.collection('sessions').doc(user.uid).set({lastUpdated: new Date(), name: user.displayName, email: user.email})
        stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
    })
    let pendingRecords = collectionData(
        sessions.where("status", "!=", "cancelled")    
    , 'id')
    .pipe(
        map(results=> results.sort((a: any, b: any) => a.time - b.time)),
        startWith([])
    ) as Observable<Recording[]>

    onDestroy(async ()=>{
        await stop()
    })
    async function record() {
        const {id} = sessions.doc()
        mixpanel.time_event("Recorded")
        const mimeType = "audio/webm;codecs=opus"
        const recordedChunks: Blob[] = []
        recorder = new MediaRecorder(stream, {mimeType})
        console.log("created recorder")
        recorder.addEventListener("dataavailable", e=>{
            if(e.data.size>0){
                recordedChunks.push(e.data)
            }
        })
        recorder.addEventListener("stop", async ()=>{
            mixpanel.track("Recorded", {id})
            mixpanel.time_event("Done")
            const newAudio = new Blob(recordedChunks, {type: mimeType})
            const storageRef = storage.ref('inturn').child(user.uid).child(`${id}.wav`)
            mixpanel.time_event("Uploaded")
            await storageRef.put(newAudio)
            const audioUrl = await storageRef.getDownloadURL()
            await sessions.doc(id).update({
                audioUrl,
                status: 'pending'
            })
            mixpanel.track("Uploaded", {id})
        })
        recorder.start()
        await sessions.doc(id).set({
            time: new Date(),
            status: 'initialized',
            user: user.uid,
            created: FieldValue.serverTimestamp()
        })
    }
    async function stop(){
        if (recorder){
            recorder.stop()
        }
        recorder = undefined
    }

    async function markDone(id: string){
        await sessions.doc(id).update({status: "done"})
        mixpanel.track("Done", {id})
    }
    async function markCancelled(id: string){
        await sessions.doc(id).update({status: "cancelled"})
        mixpanel.track("Cancelled", {id})
    }
</script>

<RecordingButton recording={!!recorder} on:start={record} on:stop={stop}></RecordingButton>
<section class="section">
    <div class="container">
        <div class="columns is-centered">
            <div class="column is-half">
                {#if !$pendingRecords.length}
                    <div class="has-text-centered">
                        <p class="title is-4">
                            Hold the purple button and start talking!
                        </p>
                        <figure class="image is-128x128 is-inline-block">
                            <img src="./down-arrow.svg" alt="down arrow">
                        </figure>
                    </div>
                {:else}
                    {#each $pendingRecords as r}
                        {#if r.status == 'pending'}
                            {#if r.response}    
                                <Form 
                                template={templates[r.templateId]} 
                                data={r.response} readOnly={true} 
                                on:done={()=>markDone(r.id)} 
                                on:close={()=>markCancelled(r.id)} 
                                status="pending"/>
                            {:else}
                                <Loading on:close={()=>markCancelled(r.id)}></Loading>
                            {/if}
                        {:else if r.status == 'entered' || r.status == 'done'}
                            <Form 
                            template={templates[r.templateId]} 
                            data={r.response} readOnly={true} 
                            on:done={()=>markDone(r.id)} 
                            on:close={()=>markCancelled(r.id)} 
                            status={r.status}/>
                        {:else if r.status == 'initialized'}
                            <Initialized on:close={()=>markCancelled(r.id)}></Initialized>
                        {:else if r.status == 'unclear'}
                            <Unclear on:close={()=>markCancelled(r.id)}></Unclear>
                        {:else if r.status == 'unsupported'}
                            <Unsupported on:close={()=>markCancelled(r.id)}></Unsupported>
                        {:else}
                            <Display on:close={()=>markCancelled(r.id)} readOnly={true} status='done'>
                            <span slot="title">{r.status}</span>
                                <span>The status "{r.status}" is not yet handled</span>
                            </Display>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</section>