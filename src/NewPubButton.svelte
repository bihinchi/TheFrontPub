<script>
    import { getModal } from './Modal.svelte';
    import EthereumLogo from './ethereum.svg';
</script>

<button class="glow-on-hover" type="button" on:click={()=>getModal().open()}>
        <span>NEW PUBLICATION</span>
        <EthereumLogo width=10 height=10 fill="white" />
</button>

<style>

    :global(svg) {
        width: 4.8vw;
        height: 4.8vh;
        margin-left: 0.5vw
    }


    button {

        display: flex;
        justify-content: center;
        align-items: center;

        border: none;
        outline: none;
        color: #fff;
        cursor: pointer;
        padding: 1.9vmin 3.7vmax;
        border-radius: 2.3vw;
        background: rgb(23, 70, 112);
        border: 0.3vw solid rgb(4, 0, 58);
        box-shadow: 0.1vw 0.1vh 1.5vw black;
        z-index: 0;
        position: relative;
        font-family: 'Nunito', Helvetica, sans-serif;
        font-size: 2.8vw;
        font-weight: bold;
    }



    .glow-on-hover:before {
        content: '';
        background: linear-gradient(45deg, #040118, #44388a, #8887b3, #e6e6f5, #9a9beb, #67a5d8, #314ef3, #270f77, #0a0331);
        position: absolute;
        top: -0.18vh;
        left:-0.22vw;
        background-size: 400%;
        z-index: -1;
        filter: blur(5px);
        width: calc(100% + 0.44vw);
        height: calc(100% + 0.36vh);
        animation: glowing 20s linear infinite;
        opacity: 0;
        transition: opacity .3s ease-in-out;
        border-radius: 2.3vw;
    }

    .glow-on-hover:active {
        /* color: rgb(23, 70, 112) */
        color: white;
        box-shadow: 0.1vw 0.1vh 5.2vw rgb(8, 3, 87);
    }

    .glow-on-hover:active:after {
        background: transparent;
    }

    .glow-on-hover:hover:before {
        opacity: 1;
    }

    .glow-on-hover:after {
        z-index: -1;
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgb(23, 70, 112);
        left: 0;
        top: 0;
        border-radius: 2.3vw;
    }

    @keyframes glowing {
        0% { background-position: 0 0; }
        50% { background-position: 400% 0; }
        100% { background-position: 0 0; }
    }
</style>