<script>
    import { leaderboard } from "../js/stores"
    leaderboard.scores = []
</script>


<div>
    <h3>TOP records:</h3>

    <ol>
        { #each leaderboard.scores as topScore }
            <li>
                { topScore }
            </li>
        { /each }
    </ol>

</div>