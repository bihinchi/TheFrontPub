<script>
    import CheckIcon from '../assets/check.svg';
    import ErrorIcon from '../assets/error.svg';
    export let status;
</script>


<div class="flex-column">
    { #if status && status.status == "sucess"}
        <span>SUCESS</span>
        <CheckIcon class="icon" fill="green"/>
    { :else if status && status.status == "error" }
        <div class="flex-row">
            <span>Error</span>
            <ErrorIcon class="icon" fill="red"/>
        </div>
        <p>{ status.reason }</p>
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