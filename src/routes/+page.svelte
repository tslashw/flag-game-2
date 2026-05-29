<script>
    import MainMenu from '$lib/components/MainMenu.svelte';
    import Game from '$lib/components/Game.svelte';

    let view = $state("menu"); // menu | game
    let gameOptions = $state(null); // { region, length }

    function startGame(options) {
        gameOptions = options;
        view = "game";
    }
</script>

<div class="game">
    {#if view === "menu"}
        <MainMenu onplay={startGame} />
    {:else}
        <Game region={gameOptions.region} length={gameOptions.length} onmenu={() => view = "menu"} />
    {/if}
</div>
