<script>
    import EtherButton from "./EtherButton.svelte";
    import NewPubModalContent from "./NewPubModalContent.svelte"
    import Modal from './Modal.svelte'

    import { getModal } from './Modal.svelte';

    export let publish;

</script>

<article>
    <EtherButton text="NEW PUBLICATION" onClick={()=>getModal("pub").open()}/>
</article>

<Modal id="pub">
	<NewPubModalContent {publish}/>
</Modal>


<style>
    article {
        height: 13%;
        display:flex;
        justify-content:center;
        align-items: center;
        width: auto;
    }

    
</style>