<script>
    import { getFlagCount } from "$lib/game.js";

    const regions     = ["World", "Europe", "Asia", "North America", "South America", "Oceania", "Africa"];
    const gameLengths = ["Full", "Half", "Quick"];

    let { onplay } = $props();

    let selectedRegion = $state("World");
    let selectedLength = $state("Full");
</script>


<div class="main-menu">
    <h1 class="title fjalla-font">FLAG GAME 2</h1>

    <div class="options">
        <section>
            <h2 class="fjalla-font">Region</h2>
            <div class="regions">
                {#each regions as region}
                    <button
                        class:selected-button={selectedRegion === region}
                        onclick={() => selectedRegion = region}
                    >{region}</button>
                {/each}
            </div>
        </section>

        <section>
            <h2 class="fjalla-font">Game Length</h2>
            <div class="game-length">
                {#each gameLengths as length}
                    <button
                        class:selected-button={selectedLength === length}
                        onclick={() => selectedLength = length}
                    >{length}</button>
                {/each}
            </div>
        </section>
    </div>

    <section>
        <div class="play">
            <button onclick={() => onplay({ region: selectedRegion, length: selectedLength })}>
                Play — {getFlagCount(selectedRegion, selectedLength)} flags
            </button>
        </div>
    </section>
</div>

<style>

.main-menu {

    height: 100%;
    width: 100%;

    display: grid;
    grid-template-rows: auto 1fr auto;

    justify-items: center;

}

.title {
    font-size: clamp(40px, 15vw, 120px);
    padding: 0;
    margin: 0;

    width: 100%;
    align-self: center;

    color: white;
    text-shadow:
        -3px -3px 0 black,
        3px -3px 0 black,
        -3px  3px 0 black,
        3px  3px 0 black;

    background-image: url("/flag-background.jpg");
    border-bottom: solid black 3px;
}

section {
    margin: 1vw;
    display: flex;
    flex-direction: column;
}

section button {
    background: none;
    border-radius: 0.75rem;
    border: solid black 2px;
    padding: 1vw;

    min-width: 15vw;

    font-family: "Fjalla One", sans-serif;
    font-weight: 100;

    cursor: pointer;
    transition: transform 0.1s ease, background-color 0.1s ease;
}

section button:hover {
    background-color: black;
    color: white;
    cursor: pointer;
    border: solid white 2px;
}

section button:active {
    transform: scale(0.96);
    background-color: #333;
    color: white;
    border: solid white 2px;
}

.selected-button {
    background-color: black;
    color: white;
    border: solid white 2px;
}

h2 {
    padding: 0;
    margin: 0;
    margin-bottom: 1vw;
}

/* ============================================== */
/* Options wrapper (sits in the 1fr grid row) */

.options {
    display: flex;
    flex-direction: column;
    width: 100%;
}

/* ============================================== */
/* Region section */

.regions {
    display: flex;
    flex-wrap: wrap;
    gap: 2vw;
}

/* ============================================== */
/* Game length section */

.game-length {
    display: flex;
    flex-wrap: wrap;
    gap: 2vw;
}

/* ============================================== */
/* Play section  */

.play button {
    background: none;
    border-radius: 0.75rem;
    border: solid black 2px;
    padding: 1vw;

    width: 95vw;
    height: 5vh;

    margin-bottom: 2vh;

    cursor: pointer;
    transition: transform 0.1s ease, background-color 0.1s ease;
}

.play button:active {
    transform: scale(0.96);
    background-color: #333;
    color: white;
    border: solid white 2px;
}

/* ============================================== */

</style>