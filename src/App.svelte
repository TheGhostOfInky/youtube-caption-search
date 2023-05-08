<script lang="ts">
    import type { SubMatch, CMParams } from "./lib/types";
    import { getCaptionMatches } from "./lib/piped-wrapper";
    import { Jellyfish } from "svelte-loading-spinners";
    import { scale } from "svelte/transition";
    import { onMount } from "svelte";

    import GithubCorner from "./lib/GithubCorner.svelte";
    import Matches from "./lib/Matches.svelte";
    import SearchBox from "./lib/SearchBox.svelte";
    import ThemeToggle from "./lib/ThemeToggle.svelte";

    let dark: boolean;
    let matches = [] as SubMatch[];
    let loading: boolean = false;

    async function findMatches(
        captionMatches: AsyncGenerator<SubMatch[], void, void>
    ) {
        for await (const match of captionMatches) {
            matches = [...matches, ...match];
        }
    }

    async function findCaptions(ev: CustomEvent<CMParams>) {
        matches = [];
        const captionMatches = getCaptionMatches(ev.detail);
        loading = true;
        await findMatches(captionMatches).catch(
            (err) => (
                console.error(err),
                alert(err.toString() + "\nDid you enter a valid channel ID?")
            )
        );
        loading = false;
    }

    onMount(() => {
        const metaTags = document.getElementsByTagName("meta");
        const themeColor = [...metaTags].filter(
            (x) => x.name === "theme-color" && x.className === ""
        );
        if (themeColor.length === 0) return;
        themeColor[0].remove();
    });
</script>

<svelte:head>
    <meta
        name="theme-color"
        content="#{dark ? '000' : 'FFF'}"
        data-react-helmet="true"
    />
</svelte:head>

<main>
    <GithubCorner />
    <h1>YouTube Caption Search</h1>
    <ThemeToggle bind:dark />
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
