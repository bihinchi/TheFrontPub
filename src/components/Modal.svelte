<script context="module" lang="ts">
	
	const modals={}  //all modals get registered here for easy future access
	let onTop   //keeping track of which open modal is on top

	// 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
	export function getModal(id=''){
		return modals[id]
	}
</script>

<script lang="ts">
import {onDestroy} from 'svelte'
	
let topDiv
let visible=false
let prevOnTop
let closeCallback

export let id=''

function keyPress(ev){
	//only respond if the current modal is the top one
	if(ev.key=="Escape" && onTop==topDiv) close() //ESC
}

/**  API **/
function open(callback){
	closeCallback=callback
	if(visible) return
	prevOnTop=onTop
	onTop=topDiv
	window.addEventListener("keydown",keyPress)
	
	//this prevents scrolling of the main window on larger screens
	document.body.style.overflow="hidden" 

	visible=true
	//Move the modal in the DOM to be the last child of <BODY> so that it can be on top of everything
	document.body.appendChild(topDiv)
}
	
function close(retVal){
	if(!visible) return
	window.removeEventListener("keydown",keyPress)
	onTop=prevOnTop
	if(onTop==null) document.body.style.overflow=""
	visible=false
	if(closeCallback) closeCallback(retVal)
}
	
//expose the API
modals[id]={open,close}
	
onDestroy(()=>{
	delete modals[id]
	window.removeEventListener("keydown",keyPress)
})
	
</script>

<div id="topModal" class:visible bind:this={topDiv} on:click={()=>close()}>
	<div id='modal' on:click|stopPropagation={()=>{}}>
		<div id='modal-content'>
			<slot></slot>
		</div>
	</div>
</div>

<style>
	#topModal {
		visibility: hidden;
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #4448;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#modal {
		/* height: calc(var(--vh, 1vh) * 95); */
		/* min-width: 80vw; */
		max-height: 90vh;
		max-width: 95vw;
		margin: auto;
		position: relative;
		border-radius: 6px;
		background: white;
		padding: 4.2vh 2.2vw;
		border: 0.01vw solid black;
        box-shadow: 0vw 0vh 0.8vw black;
	}

	.visible {
		visibility: visible !important;
	}


	#modal-content {
		max-width: calc(100vw - 20px);
	}
</style>