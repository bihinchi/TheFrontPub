<script>
    import EtherButton from "./EtherButton.svelte";
    import NewPubModalContent from "./NewPubModalContent.svelte"
    import Modal from './Modal.svelte'

    import { getModal } from './Modal.svelte';

    export let publish;

</script>

<article class="center">
    <EtherButton text="NEW PUBLICATION" onClick={()=>{getModal("pub").open()}}/>
</article>

<Modal id="pub">
	<NewPubModalContent {publish}/>
</Modal>


<style>
    
    article {
        flex-grow: 1;
    }

    
</style>