<script>
    import CheckIcon from '../assets/check.svg';
    import ErrorIcon from '../assets/error.svg';
    export let status, reason;
</script>


<div class="flex-column">
    { #if status == "sucess"}
        <span>SUCESS</span>
        <CheckIcon class="icon" fill="green"/>
    { :else if status == "error" }
        <div class="flex-row">
            <span>Error</span>
            <ErrorIcon class="icon" fill="red"/>
        </div>
        <p>{ reason || 'Something went wrong'  }</p>
    { :else }
        <span>Loading...</span>
    { /if }
</div>

<style>

    .flex-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 3vh 1.2vw;
    }

    .flex-row {
        display: flex;
        align-items: center;
    }

    .flex-column > span {
        margin-bottom: 2vh;
    }

    span {
        font-family: 'Nunito', sans-serif;
        font-size: 2.2vw;
    }

    p {
        font-size: 1.7vw;
    }

    :global(.icon) {
        margin-left: 0;
        min-width: 4.8vw;
        min-height: 4.8vh;
    }

</style>