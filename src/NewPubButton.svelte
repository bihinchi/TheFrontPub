<script>
    import { getModal } from './Modal.svelte';
</script>

<button on:click={()=>getModal().open()}>New</button>

<style>
    button {
        max-height: -webkit-fill-available;
    }
</style>