
<script>
	import Publication from "./Publication.svelte";
	import NewPub from "./NewPub.svelte";

	import { Dapp, DappLogic } from "../js/app"

	const logic = new DappLogic();
	
	let top;

	logic.init()
	.then(() => {
		console.log("then", logic)
		top = logic.current; 
	})
	
	$: top = logic.publications[0]; 
	$: console.log(`cur ${JSON.stringify(logic.current)}`);
	$: console.log(`top ${JSON.stringify(logic.topPub)}`);
	$: console.log(`pub ${JSON.stringify(logic.publications[0])}`);



	

	/* const res = Dapp.init()

	res.then(r => {

		setTimeout(() => {top = Object.values(r.publications)[0]}, 3500)

	}); */


	$: Dapp.current = top; // pubs[1];
	
	const calculateWindow = () => {
		document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
		document.documentElement.style.setProperty('--vw', `${window.innerWidth/100}px`);
	}

	calculateWindow();
	window.visualViewport.addEventListener("resize", calculateWindow);


</script>

<main>
	<section>
		<Publication pub={ Dapp.current }/>
		<NewPub/>
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
