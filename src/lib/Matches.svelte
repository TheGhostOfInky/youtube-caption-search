<script lang="ts">
    import { slide } from "svelte/transition";
    import { expoInOut } from "svelte/easing";
    import type { SubMatch } from "./types";
    export let matches: SubMatch[];
</script>

{#each matches as match}
    <a
        href={match.link}
        class="match-holder"
        target="_blank"
        transition:slide|local={{
            delay: 150,
            duration: 600,
            easing: expoInOut,
            axis: "y",
        }}
    >
        <div>
            <div class="match-label">
                On video: "{match.name}"
            </div>
            <div class="match-date">
                Uploaded on: {match.date}
            </div>
            <div class="match-text">
                {match.time}:
                <span class="match-caption">
                    "{match.text}"
                </span>
            </div>
        </div>
    </a>
{/each}

<style lang="scss">
    a {
        text-decoration: none;
    }
    .match-holder {
        color: var(--txtfaded);
        background-color: var(--elmbg);

        display: block;
        width: 95%;
        max-width: 800px;
        padding: 8px;
        border-radius: 2px;
        margin: 6px auto;

        &:hover {
            color: var(--txtcontrast);
            background-color: var(--elmfg);
        }
        * {
            color: inherit;
        }
    }

    .match-label,
    .match-date {
        text-align: start;
    }
    .match-text {
        text-align: end;
    }
    .match-caption {
        font-style: italic;
    }
</style>
