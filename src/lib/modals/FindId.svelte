<script lang="ts">
    import { getVideo } from "../piped-wrapper";
    export let channelId: string;
    let videoUrl: string;

    function extractID(url: string): string | null {
        const pattern =
            /youtu\.be\/([\d\w_\-]+)|watch\?[\d\w_\-\&=]*v=([\d\w_\-]+)/gim;
        const regMatch = pattern.exec(url);
        const matches = regMatch?.slice(1).filter((x) => x);

        if (!matches || matches.length === 0) {
            return null;
        }
        return matches[0];
    }

    let channelPromise: Promise<string>;

    async function getChannelID(): Promise<string> {
        const videoId = extractID(videoUrl);
        if (!videoId) {
            throw new Error("No valid YouTube video ID found in string");
        }

        const video = await getVideo(videoId);
        const id = video.uploaderUrl.replace("/channel/", "");
        return (channelId = id);
    }

    function copyId() {
        navigator.clipboard.writeText(channelId);
    }
</script>

<div class="container">
    <h3>Obtaining the channel ID</h3>
    <label>
        <div>
            Insert a link to a YouTube video of the channel you want to search through,
            <br />
            can be in the form of youtu.be shortlinks or a full length url.
        </div>
        <input type="text" bind:value={videoUrl} />
    </label>
    <button on:click={() => (channelPromise = getChannelID())}>
        Get channel ID
    </button>

    {#if channelPromise}
        {#await channelPromise}
            <p>Loading video...</p>
        {:then id}
            <p>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <code on:click={copyId} class="clickable">{id}</code>
            </p>
        {:catch err}
            <p>
                Failed to fetch channel id:
                <br />
                <code>{err}</code>
            </p>
        {/await}
    {/if}
</div>

<style lang="scss">
    .container {
        max-width: 50vw;
        label {
            display: block;
            input {
                margin-top: 1em;
                margin-bottom: 1em;
                height: 24pt;
                line-height: 24pt;
                width: 32em;
                max-width: 80%;
            }
        }
    }

    button {
        margin: 0.4em;
    }

    .clickable {
        cursor: pointer;
    }

    @media screen and (max-width: 800px) {
        .container {
            max-width: 75vw;
        }
    }
</style>
