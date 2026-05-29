<script>
    import { getFlagUrl } from "$lib/flags.js";
    import { buildGame, getOptions, getRegionFlags } from "$lib/game.js";

    let { region, length, onmenu } = $props();

    // Build question list:
    const allFlags = getRegionFlags(region);
    const gameFlags = buildGame(region, length);
    const total = gameFlags.length;
    const gameQuestions = gameFlags.map(flag => ({
        flag, options: getOptions(flag, allFlags),
    }));

    let questionIndex = $state(0);
    let score = $state(0);
    let selectedAnswer = $state(null);
    let gameOver = $state(false);

    const currentQuestion = $derived(gameQuestions[questionIndex]);
    const currentFlagUrl = $derived(getFlagUrl(currentQuestion.flag.code));
    const progress = $derived(
        gameOver ? 100 : Math.round((questionIndex / total) * 100)
    );

    function selectAnswer(code) {
        if (selectedAnswer !== null) return;

        selectedAnswer = code;
        if (code === currentQuestion.flag.code) score++;

        setTimeout(() => {
            if (questionIndex + 1 >= total) {
                gameOver = true;
            } 
            else {
                questionIndex++;
                selectedAnswer = null;
            }
        }, 1000);
    }

    function answerClass(code) {
        if (selectedAnswer === null) return '';
        if (code === currentQuestion.flag.code) return "correct";
        if (code === selectedAnswer) return "wrong";
        return "dimmed";
    }
</script>

<div class="wrapper" style:background-image={`url("${currentFlagUrl}")`}>
    <div class="game">

        <div class="top-section">
            <div class="progress-track">
                <div class="progress-fill" style:width={`${progress}%`}></div>
            </div>
            <div class="top-bar">
                <button class="menu-btn" onclick={onmenu}>← Menu</button>
                <div class="score"><h1>SCORE: {score}</h1></div>
            </div>
        </div>

        {#if gameOver}
            <div class="result">
                <p class="result-label">Final Score</p>
                <p class="result-score">{score}<span>/{total}</span></p>
            </div>
            <div class="options">
                <button onclick={onmenu}>← Back to Menu</button>
            </div>
        {:else}
            <img src={currentFlagUrl} alt={currentQuestion.flag.name} />

            <div class="options">
                {#each currentQuestion.options as option (option.code)}
                    <button
                        class={answerClass(option.code)}
                        onclick={() => selectAnswer(option.code)}
                    >{option.name}</button>
                {/each}
            </div>
        {/if}

    </div>
</div>


<style>
    .wrapper {
        width: 100dvw;
        height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;

        background-size: contain;
        background-repeat: repeat;
        background-position: center;
    }

    .game {
        height: 99vh;
        width: 99vw;

        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 2px solid black;
        border-radius: 5vw;
        box-sizing: border-box;
        padding: 3vh 2vw;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }

    /* ── Top section ─────────────────────────────── */

    .top-section {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1.5vh;
    }

    .progress-track {
        width: 100%;
        height: 1.5vh;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 5vw;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background-color: black;
        border-radius: 5vw;
        transition: width 0.4s ease;
    }

    .top-bar {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .score {
        background-color: black;
        color: white;
        padding: 1vw 4vw;
        border-radius: 5vw;
    }

    .score h1 {
        font-family: "Fjalla One", sans-serif;
        font-size: clamp(12px, 5vw, 20px);
        margin: 0;
        padding: 0;
    }

    .menu-btn {
        background-color: black;
        color: white;
        font-family: "Fjalla One", sans-serif;
        font-size: clamp(12px, 5vw, 20px);
        padding: 1vw 4vw;
        border: none;
        border-radius: 5vw;
        cursor: pointer;
        transition: transform 0.1s ease, background-color 0.1s ease;
    }

    .menu-btn:active {
        transform: scale(0.96);
        background-color: #333;
    }

    /* ── Flag image ───────────────────────────────── */

    .game img {
        height: 25vh;
        border-radius: 0.5rem;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.9);
    }

    @media (min-width: 768px) {
        .game img {
            height: 45vh;
        }
    }

    /* ── Answer options ───────────────────────────── */

    .options {
        display: flex;
        flex-direction: column;
        gap: clamp(8px, 3vh, 20px);
        width: min(75%, 560px);
    }

    .options button {
        background-color: black;
        font-family: "Fjalla One", sans-serif;
        font-size: clamp(16px, 7.5vw, 28px);
        color: white;
        border: none;
        border-radius: 5vw;
        padding: clamp(8px, 2vw, 14px);
        cursor: pointer;
        transition: transform 0.1s ease, background-color 0.15s ease;
    }

    .options button:active {
        transform: scale(0.96);
        background-color: #333;
    }

    .options button.correct {
        background-color: #22c55e;
    }

    .options button.wrong {
        background-color: #ef4444;
    }

    .options button.dimmed {
        background-color: #555;
    }

    /* ── Game over ────────────────────────────────── */

    .result {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1vh;
    }

    .result-label {
        font-family: "Fjalla One", sans-serif;
        font-size: clamp(18px, 6vw, 40px);
        color: white;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
        margin: 0;
    }

    .result-score {
        font-family: "Fjalla One", sans-serif;
        font-size: clamp(60px, 20vw, 140px);
        color: white;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        margin: 0;
        line-height: 1;
    }

    .result-score span {
        font-size: 0.5em;
        opacity: 0.7;
    }
</style>
