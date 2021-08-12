
<script>
	import Publication from "./Publication.svelte";
	import NewPub from "./NewPub.svelte";

	import { Dapp } from "./app"

	Dapp.init()


	const pubs = [ {	
			link: "http://example.com",
			type: "link",
		}, {
			link: "https://searx.bar/morty/?mortyurl=https%3A%2F%2Flive.staticflickr.com%2F3868%2F18656441554_57b28dd486_b.jpg&mortyhash=5fa694c9eb29b40b646762e87c0d071609c6a993ae94ea5e8833c187f0cb5f6c",
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

</script>

<main>
	<Publication pub={ Dapp.current }/>
	<NewPub/>
</main>


<style>
	
	main {
		
		/* display: flex;
		flex-direction: column;
		align-items: center; */

		padding: 0.6em;
	}

</style>
