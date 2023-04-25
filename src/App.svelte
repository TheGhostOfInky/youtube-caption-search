<script lang="ts">
    import type { SubMatch, CMParams } from "./lib/types";
    import { getCaptionMatches } from "./lib/piped-wrapper";
    import { Jellyfish } from "svelte-loading-spinners";
    import { scale } from "svelte/transition";

    import GithubCorner from "./lib/GithubCorner.svelte";
    import Matches from "./lib/Matches.svelte";
    import SearchBox from "./lib/SearchBox.svelte";
    import ThemeToggle from "./lib/ThemeToggle.svelte";

    let matches = [] as SubMatch[];
    let loading: boolean = false;

    async function findCaptions(ev: CustomEvent<CMParams>) {
        matches = [];
        const captionMatches = getCaptionMatches(ev.detail);

        loading = true;
        for await (const match of captionMatches) {
            matches = [...matches, ...match];
        }
        loading = false;
    }
</script>

<main>
    <GithubCorner />
    <h1>YouTube Caption Search</h1>
    <ThemeToggle />
    <SearchBox on:search={findCaptions} bind:loading />
    {#if loading}
        <div in:scale out:scale class="animation-holder">
            <Jellyfish size="100" color="var(--txt)" />
        </div>
    {/if}
    <Matches bind:matches />
</main>

<style lang="scss">
    main {
        margin-top: 3em;
    }
    .animation-holder {
        margin: auto;
        width: fit-content;
    }
</style>
