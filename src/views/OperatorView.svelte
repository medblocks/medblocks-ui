<script lang="ts">
	import Form from "../form/Form.svelte";
	import {templateList, templates} from "./templates"
	import {writable} from "svelte/store"
	import type { keyValue, Recording, Template } from "../types/types";
	import {BehaviorSubject, Observable} from "rxjs"
	import {debounceTime, startWith, distinctUntilChanged, map, pairwise} from "rxjs/operators"
	import {collectionData} from "rxfire/firestore"
	import {db} from "../firebase"
	import type {firebaseUser} from "../firebase"
	import AudioPlayer from "./AudioPlayer.svelte";
	export let user: firebaseUser
	let initialized = false
	let store = writable<keyValue>({})
	let storeStream = new BehaviorSubject<keyValue>({})
	let selected: string | null
	let selectedTemplate: string | null
	let sessions = db.collection('intern')
	let throttled = storeStream.pipe(
		debounceTime(700),
		startWith({}),
	)
	let cleanOfUndefined: keyValue
	$: {
		cleanOfUndefined = JSON.parse(JSON.stringify($store))
		storeStream.next(cleanOfUndefined)
	}
	$: if (selected){
		if (selectedTemplate) {
			sessions.doc(selected).update({
			response: $throttled,
			templateId: selectedTemplate,
			})
		} else {
			sessions.doc(selected).update({
				assigned: user.uid
			})
		}
	}
	
	let unassignedRecords = collectionData(
		db.collection("intern")
		.where("status", "==", "pending")
		, "id")
		.pipe(
			map(results=> results.sort((a: any, b: any) => a.time - b.time)),
			startWith([])
		) as Observable<Recording[]>
	
	let countObservable = unassignedRecords.pipe(
		map(unassigned=>unassigned.length),
		distinctUntilChanged(),
		pairwise()
	)
	let tingAudio = new Audio("./start.webm")
	$: {
		if ($countObservable && $countObservable[1] - $countObservable[0] >= 1){
			tingAudio.play()
		}
	}
	async function mark(status) {
		if (selected) {
			await sessions.doc(selected).update({status})
		}
		selected = null
		selectedTemplate = null
	}
	async function submit(){
		if (selected) {
			await sessions.doc(selected).update({status: 'entered', response: cleanOfUndefined})
		}
		selected = null
		selectedTemplate = null
	}
	const selectButton = (templateId: string)=>{
		selectedTemplate = templateId
		store = writable({})
	}
</script>

<section class="section">
	<div class="container">
		<div class="columns">
			<div class="column is-half">
				{#if !initialized}
					<button class="button is-primary" on:click={()=>{initialized=true}}>Check in</button>
				{:else}
				<h1 class="subtitle">{$unassignedRecords.length} pending</h1>
					{#each $unassignedRecords as r}
					<AudioPlayer on:click={()=>selected=r.id} src={r.audioUrl} selected={selected===r.id}></AudioPlayer>
					{/each}
				{/if}
			</div>
			
			<div class="column is-half">
				{#if selected}
					<div class="buttons">
						{#each templateList as template}
						<button class="button is-info" on:click={()=>selectButton(template.templateId)}>
							{template.tree.name}
						</button>
						{/each}
						<button class="button is-warning is-light" on:click={()=>mark("unsupported")}>Unsupported</button>
						<button class="button is-danger is-light" on:click={()=>mark("unclear")}>Unclear</button>
					</div>
				 {/if}
				{#if selected && selectedTemplate}
				{#key `${selectedTemplate} ${selected}`}
				<Form template={templates[selectedTemplate]} {store} on:done={submit}/>
				{/key}
				{/if}
			</div>
		</div>
	</div>
</section>

