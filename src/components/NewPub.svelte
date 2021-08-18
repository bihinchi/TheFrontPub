<script>
    import EtherButton from "./EtherButton.svelte";
    import NewPubModalContent from "./NewPubModalContent.svelte"
    import Modal from './Modal.svelte'

    import { getModal } from './Modal.svelte';

</script>

<article>
    <EtherButton text="NEW PUBLICATION" onClick={()=>getModal().open()}/>
</article>

<Modal>
	<NewPubModalContent/>
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