<script>
    import EthereumLogo from '../assets/ethereum.svg';

    export let text;
    export let onClick;
    export let showLogo = true;
    export let buttonStyle = ""

</script>

<button class="glow-on-hover" type="button" style="{buttonStyle}" on:click={onClick}>
    <span>{text}</span>
    { #if showLogo }
        <EthereumLogo  fill="white" />
    { /if }
</button>

<style>

    :global(svg) {
        max-width: 4.8vw;
        max-height: 4.8vh;
        margin-left: 1.0vw
    }


    button {

        display: flex;
        align-items: center;

        justify-content: space-between;

        color: #fff;
        cursor: pointer;
        padding: 1.5vh 1.9vw;
        border-radius: 1.8vw;

        background-image: linear-gradient(to bottom right, rgb(53 104 149), black);
        /* background: rgb(23, 70, 112); */
        
        border: 0.2vw solid rgb(4, 0, 58);
        box-shadow: 0.1vw 0.1vh 1.5vw black;
        text-shadow: 0 0 1.2vw black;

        z-index: 0;
        position: relative;
        font-family: 'Nunito', sans-serif;
        font-size: 2.3vw;
        font-weight: bold;
    }


    .glow-on-hover:before {
        content: '';
        background: linear-gradient(45deg, #040118, #44388a, #8887b3, #e6e6f5, #9a9beb, #67a5d8, #314ef3, #270f77, #0a0331);
        background-size: 400%;
        position: absolute;
        top: -0.18vh;
        left:-0.2vw;
        height: calc(100% + 0.36vh);
        width: calc(100% + 0.4vw);
        z-index: -1;
        filter: blur(5px);
        animation: glowing 20s linear infinite;
        transition: opacity .3s ease-in-out;
        border-radius: 2.3vw;
        opacity: 0;
    }

    .glow-on-hover:active {
        /* color: rgb(23, 70, 112) */
        color: white;
        box-shadow: 0.0vw 0.0vh 4.2vw  rgb(8, 3, 87);
    }

    .glow-on-hover:active:after {
        background: transparent;
    }

    .glow-on-hover:hover:before {
        opacity: 1;
    }



    @keyframes glowing {
        0% { background-position: 0 0; }
        50% { background-position: 400% 0; }
        100% { background-position: 0 0; }
    }
</style>