
<script>
	import Publication from "./Publication.svelte";
	import NewPub from "./NewPub.svelte";

	import { Dapp } from "./app"
	//import { onMount } from "svelte"

	Dapp.init()


	const pubs = [ {	
			link: "http://example.com",
			type: "link",
		}, {
			link: "https://www.highreshdwallpapers.com/wp-content/uploads/2014/03/Wonderful-HD-Space-Scene.jpg",
			type: "image",
		}, {
			link: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
			type: "video",

		}, {
			link: "https://wikipedia.org",
			type: "iframe",
		}
	]

	Dapp.current = pubs[3];

	document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
	document.documentElement.style.setProperty('--vw', `${window.innerWidth/100}px`);
	

</script>

<main>
	<section>
		<Publication pub={ Dapp.current }/>
		<NewPub/>
	</section>

	<section>Another content here</section>

</main>


<style>
	
	main {
		width: 95%;
		margin: 0.5em auto;
	}

	section {
		height: calc(var(--vh, 1vh) * 100);
	}

</style>
