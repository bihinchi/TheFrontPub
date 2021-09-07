<script>

    const TIMES = [
        {
            name: "day",
            duration: 3600*24,
        }, {
            name: "hour",
            duration: 3600,
        }, {
            name: "minute",
            duration: 60,
        }, {
            name: "second",
            duration: 1,
        },

    ]

    import MiniPub from "./MiniPib.svelte"
    export let record;

    const formatScore = (score) => {
        if (score >= 0.1) return score.toFixed(3) + " Eth";
        else if (score > 1e-4) return (score * 1e3).toFixed(2) + " mEth"
        else if (score > 1e-7) return (score * 1e6).toFixed(2) + " µEth"
        else if (score <= 0) return "0"
        else return (score * 1e9).toFixed(2) + " gwei"
    }

    const formatDuration = (duration) => {
        let str = "";

        TIMES.forEach((time) => {
            if (duration > time.duration) {
                if (str.length > 0) str += ', ';
                const count = Math.floor(duration / time.duration);
                str += count + " " + (count === 1 ? time.name : (time.name + 's'));
                duration %= time.duration
            }
        })

        return str;
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
    <span>{formatDuration(record.length)}</span>
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