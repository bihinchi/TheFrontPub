
<script>
	import Publication from "./Publication.svelte";
	import NewPub from "./NewPub.svelte";
	
	import { Dapp } from "../js/app"
	import { currentPub } from '../js/stores';

	import Modal from './Modal.svelte'
    import { getModal } from './Modal.svelte';

	import History from "./History.svelte"
	import Leaderboard from "./Leaderboard.svelte"
	import Info from "./Info.svelte"

	import { onMount } from "svelte";


	
	const calculateWindow = () => {
		document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
		document.documentElement.style.setProperty('--vw', `${window.innerWidth/100}px`);
	}


	const dapp = new Dapp();
	
	onMount(() => {
		dapp.init()
		.catch(e => console.log(e));
	})

	calculateWindow();

	window.visualViewport.addEventListener("resize", calculateWindow);

</script>

<main>
	<section>
		<Publication pub={$currentPub}/>
		<NewPub publish={dapp.publishNew.bind(dapp)}/>
	</section>
</main>


<nav>
	<span on:click={()=>getModal("history").open()}>History</span>
	<span on:click={()=>getModal("leaderboard").open()}>Leaderboard</span>
	<span on:click={()=>getModal("info").open()}>Info</span>
</nav>


<Modal id="history">
	<History/>
</Modal>

<Modal id="leaderboard">
	<Leaderboard/>
</Modal>

<Modal id="info">
	<Info/>
</Modal>


<style>

	:global(body) {
		margin: 0;
	}

	:global(.center) {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	nav {
		position: absolute;
		left: 2vw;
		bottom: 2vh;
		color: #5b5b63;
		min-width: 19vw;
		max-width: 25vw;
		z-index: 2;
	}

	span {
		padding: 0.2vw;
	}

	span:hover {
		cursor: pointer;
		border-bottom: 0.3vh solid darkblue;
	}

	span:not(span:last-child) {
		margin-right: 0.2vw;
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
