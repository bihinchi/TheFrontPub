<script>
    import MiniPub from "./MiniPib.svelte"
    export let record;
</script>

<section>
    <MiniPub pub={record.pub}/>
    <div class="between">
        <span>{record.scoreStart.toFixed(2)} Eth</span>
        <span>-></span>
        <span>{record.scoreEnd.toFixed(2)} Eth</span>
    </div>

</section> 
    
<style>

    span {
        font-size: 1.7vw;
        font-style: italic;
        color: #7b7b7b;
    }

    section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-width: 44vw;
      min-height: 30vh;
      margin: 0 9vw;
    }

    .between {
        display: flex;
        justify-content: space-between;
        max-width: 32vw;
        min-width: 23vw;
    }

    
</style>