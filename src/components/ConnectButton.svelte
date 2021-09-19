<script>
    export let onClick;
</script>

<h6 role="button" on:click={onClick}>Connect to Ethereum</h6>

<style>

    h6 {
        font-size: 1.5rem;
        color: #132f93
    }

    h6:hover {
        cursor: pointer;
        text-decoration: underline;
    }
</style>


