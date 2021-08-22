
<script>
	import Publication from "./Publication.svelte";
	import NewPub from "./NewPub.svelte";
	
	import { Dapp } from "../js/app"
	import { currentPub } from '../js/stores';



	let current = {};

	const dapp = new Dapp()

	currentPub.subscribe(pub => current = pub);

	
	const calculateWindow = () => {
		document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
		document.documentElement.style.setProperty('--vw', `${window.innerWidth/100}px`);
	}
	calculateWindow();
	window.visualViewport.addEventListener("resize", calculateWindow);


</script>

<main>
	<section>
		<Publication pub={ current }/>
		<NewPub publish={dapp.publishNew.bind(dapp)}/>
	</section>

</main>


<style>
	
	main {
		margin: 0vw auto;
	}

	section {
		height: calc(var(--vh, 1vh) * 100);
        display:flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}

</style>
