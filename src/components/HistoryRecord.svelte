<script>
    import MiniPub from "./MiniPib.svelte"
    export let record;

    const formatScore = (score) => {
        if (score >= 0.1) return score.toFixed(3) + " Eth";
        else if (score > 1e-4) return (score * 1e3).toFixed(2) + " mEth"
        else if (score > 1e-7) return (score * 1e6).toFixed(2) + " µEth"
        else if (score <= 0) return "0"
        else return (score * 1e9).toFixed(2) + " gwei"
    }
    const random = () => Math.floor((Math.random() * 3))
</script>

<section class="{ random() === 0 ? 'flex-start' : ( random() == 2 ? 'flex-end'  : '' ) }">
    <MiniPub pub={record.pub}/>
    <div class="between">
        <span>{formatScore(record.scoreStart)}</span>
        <span>-></span>
        <span>{formatScore(record.scoreEnd)}</span>
    </div>
    <span>{record.length.toFixed(0)}</span>
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
      min-width: 28vw;
      min-height: 30vh;
      margin: 0 2vw;
    }

    .between {
        display: flex;
        justify-content: space-between;
        max-width: 32vw;
        min-width: 23vw;
    }

    .flex-start { align-self: flex-start; }
    .flex-end { align-self: flex-end; }
    
</style>