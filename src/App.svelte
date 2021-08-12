
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
			link: "http://example.com/",
			type: "iframe",
		}
	]

	Dapp.current = pubs[0];

	document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
	

</script>

<main>
	<section>
		<Publication pub={ Dapp.current }/>
		<NewPub/>
	</section>

	<div>Another content here</div>

</main>


<style>
	
	main {
		width: 95%;
		margin: 0 auto;
	}

	section {
		height: calc(var(--vh, 1vh) * 100);

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

</style>
