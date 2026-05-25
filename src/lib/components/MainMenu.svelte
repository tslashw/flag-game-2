<script>
    const regions = ['World', 'Europe', 'Asia', 'North America', 'South America', 'Oceania', 'Africa'];
    let selectedRegion = $state('World');
</script>


<div class="main-menu">
    <h1 class="title fjalla-font">FLAG GAME 2</h1>

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
        <div class="play">
            <button>Play</button>
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
    font-size: 15vw;
    padding: 0;
    margin: 0;
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
}

section button:hover {
    background-color: black;
    color: white;
    cursor: pointer;
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
}

/* ============================================== */

</style>