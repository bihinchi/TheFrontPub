<script>
    import MiniPub from "./MiniPib.svelte"
	import { history } from '../js/stores';
</script>

<article>
    {#each $history as record }
        <MiniPub pub={record.pub}/>
    { /each }
    
</article>

<style>

    article {
        display: flex;
        overflow: auto;
        white-space: nowrap;
        justify-content: space-between;
    }

    
</style>