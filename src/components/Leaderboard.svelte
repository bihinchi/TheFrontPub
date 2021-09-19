<script>
    import { leaderboard } from "../js/stores"
    const CATEGORIES = [
        { key: "scores", title: "Publications with the highest scores" }, 
        { key: "counts", title: "Addresses with the highest number of publications" }, 
        { key: "allScores", title: "Addresses with the highest score for all publications" }, 
    ]
</script>


<article>
    { #each CATEGORIES as category }
    
        <section>
            <h4>{category.title}:</h4>
            <ol>
                { #each $leaderboard[category.key] as topScore }
                    <li>
                        <div>      
                            <span>{topScore.address ?? topScore.link}</span>
                            <span>{topScore.score}</span>    
                        </div>
        
                    </li>
                { /each }
            </ol>
        </section>

    { /each }

</article>

<style>

    article {
        display: flex;
        flex-direction: column;
        font-size: 2.5vmin;

        max-height: 85vh;
        max-width: 90vw;
        padding: 0.3vh 0.2vw;
        overflow: auto;
    }

    section {
        border-radius: 0.5vw;
        box-shadow: 0.01vw 0.01vh 0.2vw 0.01vw darkblue;
        padding: 0.5vh 1.9vw;
        margin-bottom: 2.5vh;

    }

    h4 {
        color: #000061;
        margin-bottom: 0.5vh;
        font-family: "Nunito", sans-serif;
    }

    span:first-child {
        max-width: 95%;
        overflow: auto;
        word-break: break-all;
        color: #737373;
        padding: 0 1vw;
    }

    span {
        font-size: 2.2vmin;
    }

    li > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    li {
        display: flex;
        flex-direction: column;
        padding: 1.3vh 0vw;
    
    }
    
    li:not(li:last-child) {
        border-bottom: 0.3vh solid #9696b9;
    }

    ol {
        list-style: none;
        padding: 0;
        margin: 0;
    }
</style>