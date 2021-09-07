
<script>
	import Publication from "./Publication.svelte";
	import NewPub from "./NewPub.svelte";
	
	import { Dapp } from "../js/app"
	import { currentPub } from '../js/stores';

	import Modal from './Modal.svelte'
    import { getModal } from './Modal.svelte';

	import History from "./History.svelte"
	//import Leaderboard from "./Leaderboard.svelte"

	//import { onMount } from "svelte";

	let current = {};
	
	const calculateWindow = () => {
		document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
		document.documentElement.style.setProperty('--vw', `${window.innerWidth/100}px`);
	}


	const dapp = new Dapp();
	
	/* onMount(() => {
		dapp.init();
	})  */

	calculateWindow();

	currentPub.subscribe(pub => current = pub);
	

	$: console.log("cur", $currentPub);

	window.visualViewport.addEventListener("resize", calculateWindow);


</script>

<main>
	<section>
		<Publication pub={$currentPub}/>
		<NewPub publish={dapp.publishNew.bind(dapp)}/>
	</section>
</main>


<a id="history_opener" on:click={()=>getModal("history").open()}>History</a>
<!-- <a id="leaderboard_opener" on:click={()=>getModal("leaderboard").open()}>Leaderboard</a>
 -->

<Modal id="history">
	<History/>
</Modal>

<!-- <Modal id="leaderboard">
	<Leaderboard/>
</Modal> -->

<style>
	:global(body) {
		margin: 0;
	}

	a {
		position: absolute;
		left: 5vw;
	}

	a:hover {
		cursor: pointer;
	}
	
	#history_opener {
		top: 5vh;
	}

	#leaderboard_opener {
		top: 8vh;
	}


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
