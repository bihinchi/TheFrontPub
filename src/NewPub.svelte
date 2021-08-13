<script>
    import NewPubButton from "./NewPubButton.svelte";
    import NewPubModalContent from "./NewPubModalContent.svelte"
    import Modal from './Modal.svelte'
</script>

<article>
    <NewPubButton />
</article>

<Modal>
	<NewPubModalContent/>
</Modal>

<style>
    article {
        height: 17%;
        display:flex;
        justify-content:center;
        align-items: center;
    }
</style>