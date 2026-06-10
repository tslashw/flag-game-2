<script>
    import { onMount } from "svelte";

    let { score, total, onmenu } = $props();

    const percentage = Math.round((score / total) * 100);

    const tiers = [
        { min: 95, label: "Guru"  },
        { min: 75, label: "Master"   },
        { min: 60, label: "Expert"  },
        { min: 45, label: "Specialist"    },
        { min: 30, label: "Apprentice"      },
        { min: 15, label: "Novice"     },
        { min: 0,  label: "Ignoramus"       },
    ];

    // Highest tier whose threshold the player met (final result, used for title)
    const earnedTier = tiers.find(t => percentage >= t.min) ?? tiers[tiers.length - 1];

    // Highest tier reached so far during the animation — drives the live label highlight
    const animatedTier = $derived(tiers.find(t => displayedPct >= t.min) ?? tiers[tiers.length - 1]);

    // Start at 0 so the CSS transition plays on mount
    let fillHeight  = $state(0);
    let displayedPct = $state(0);
    let showTitle   = $state(false);

    const DELAY    = 250;   // ms before animation starts
    const DURATION = 3500;  // ms — must match CSS transition

    onMount(() => {
        setTimeout(() => {
            fillHeight = percentage;

            // Tick the counter in sync with the fill transition
            const startTime = performance.now();

            function tick(now) {
                const t = Math.min((now - startTime) / DURATION, 1);
                const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                displayedPct = Math.round(eased * percentage);
                if (t < 1) requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
        }, DELAY);

        // Reveal the title only once the bar finishes
        setTimeout(() => { showTitle = true; }, DELAY + DURATION);
    });
</script>

<div class="score-screen">

    <p class="earned-label" class:visible={showTitle}>{earnedTier.label}</p>

    <div class="striker-area">

        <!-- The column / bar -->
        <div class="column">
            <!-- White tick at every tier threshold (visible through the fill) -->
            {#each tiers as tier}
                <div class="tick" style:bottom="{tier.min}%"></div>
            {/each}

            <!-- The fill that shoots up -->
            <div class="fill" style:height="{fillHeight}%">
                <!-- Puck at the top edge of the fill -->
                <div class="puck"></div>
            </div>
        </div>

        <!-- Percentage counter on the left, rides up with the fill -->
        <div class="pct-label" style:bottom="{fillHeight}%">{displayedPct}%</div>

        <!-- Tier labels to the right, aligned to their thresholds -->
        <div class="labels">
            {#each tiers as tier}
                <div
                    class="tier-row"
                    class:reached={displayedPct >= tier.min}
                    class:earned={tier.min === animatedTier.min}
                    style:bottom="{tier.min}%"
                >
                    <div class="dash"></div>
                    <span class="tier-name">{tier.label}</span>
                    {#if tier.min === animatedTier.min}
                        <span class="star">★</span>
                    {/if}
                </div>
            {/each}
        </div>

    </div>

    <p class="tally">{score} / {total}</p>

    <button class="back-btn" onclick={onmenu}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back to Menu
    </button>

</div>


<style>
    .score-screen {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        padding: 1vh 4vw 0;
        box-sizing: border-box;
        overflow: hidden;
    }

    /* ── Earned tier title ─────────────────────── */

    .earned-label {
        font-family: "Fjalla One", sans-serif;
        font-size: clamp(22px, 7.5vw, 44px);
        color: black;
        margin: 0;
        letter-spacing: 0.04em;
        text-align: center;
        opacity: 0;
    }

    .earned-label.visible {
        animation:
            pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
            pulse  2.5s ease-in-out 0.5s infinite;
    }

    @keyframes pop-in {
        from { opacity: 0; transform: scale(0.6); }
        to   { opacity: 1; transform: scale(1);   }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1);    }
        50%      { transform: scale(1.06); }
    }

    /* ── Striker area ──────────────────────────── */

    /* Both .column and .labels are absolute children of .striker-area so
       they share the same coordinate system — bottom: X% means the same
       thing in both, keeping ticks and labels perfectly in sync. */

    .striker-area {
        position: relative;
        height: 45vh;
        width: 100%;
    }

    /* The bar — centred horizontally */

    .column {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 44px;
        height: 100%;
        border: 3px solid black;
        border-radius: 999px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.06);
        box-shadow:
            0 0 12px 2px rgba(255, 80,  0,   0.35),
            0 0 24px 6px rgba(255, 220, 0,   0.25),
            0 0 36px 10px rgba(0,  100, 255, 0.2),
            0 0 50px 14px rgba(160, 0,  255, 0.15);
    }

    .tick {
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background: rgba(0, 0, 0, 0.25);
        z-index: 2;
        pointer-events: none;
    }

    .fill {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(
            to top,
            #aa00ff 0%,
            #0077ff 20%,
            #00cc44 40%,
            #ffdd00 60%,
            #ff6600 80%,
            #ff0000 100%
        );
        z-index: 1;
        transition: height 3.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Puck sits at the top edge of the fill */
    .puck {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 14px;
        background: white;
        border-radius: 999px;
        box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.9);
    }

    /* Percentage label — left of the centred column, rides with the fill */

    .pct-label {
        position: absolute;
        right: calc(50% + 30px);   /* mirrors the labels offset, but on the left */
        transform: translateY(50%);
        transition: bottom 3.5s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: "Fjalla One", sans-serif;
        font-size: clamp(14px, 4.5vw, 20px);
        color: black;
        white-space: nowrap;
        text-align: right;
        line-height: 1;
    }

    /* Tier labels — right of the centred column */

    .labels {
        position: absolute;
        left: calc(50% + 30px);  /* right edge of column (22px) + 8px gap */
        right: 4vw;
        top: 0;
        bottom: 0;
        overflow: visible;
    }

    .tier-row {
        position: absolute;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0.35;
        transition: opacity 0.3s ease;
        /* Centre the row text at the threshold line rather than sitting above it */
        transform: translateY(50%);
    }

    .tier-row.reached {
        opacity: 0.65;
    }

    .tier-row.earned {
        opacity: 1;
    }

    .dash {
        width: 10px;
        height: 2px;
        background: black;
        flex-shrink: 0;
    }

    .tier-name {
        font-family: "Fjalla One", sans-serif;
        font-size: clamp(10px, 3.2vw, 14px);
        color: black;
        white-space: nowrap;
        line-height: 1;
    }

    .tier-row.earned .tier-name {
        font-size: clamp(13px, 4.2vw, 18px);
    }

    .star {
        font-size: clamp(11px, 3.5vw, 15px);
        color: black;
        line-height: 1;
    }

    /* ── Score tally ───────────────────────────── */

    .tally {
        font-family: "Fjalla One", sans-serif;
        font-size: clamp(16px, 5.5vw, 28px);
        color: black;
        margin: 0;
    }

    /* ── Back button ───────────────────────────── */

    .back-btn {
        background-color: black;
        color: white;
        font-family: "Fjalla One", sans-serif;
        font-size: clamp(13px, 4.5vw, 20px);
        padding: clamp(8px, 1.5vh, 14px) clamp(20px, 8vw, 40px);
        border: none;
        border-radius: 999px;
        cursor: pointer;
        width: min(75%, 320px);
        transition: transform 0.1s ease, background-color 0.1s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .back-btn svg {
        width: 1.2em;
        height: 1.2em;
        flex-shrink: 0;
    }

    .back-btn:active {
        transform: scale(0.96);
        background-color: #333;
    }
</style>
