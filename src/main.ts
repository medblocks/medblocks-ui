import App from './App.svelte';
import json from '../templates/better/anotherName.json'
import '../src/css/main.scss'
const app = new App({
	target: document.body,
	props: {
	}
});

// if ('serviceWorker' in navigator) {
// 	navigator.serviceWorker.register('./service-worker.js')
// }

export default app;