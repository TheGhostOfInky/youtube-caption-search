<script lang="ts">
    import insensitiveSvg from "../assets/insensitive.svg";
    import sensitiveSvg from "../assets/sensitive.svg";
    import regexSvg from "../assets/regex.svg";
    import stringSvg from "../assets/string.svg";

    import Toggle from "./generic-components/Toggle.svelte";
    import ClickableTooltip from "./generic-components/ClickableTooltip.svelte";
    import BasicTooltip from "./generic-components/BasicTooltip.svelte";
    import Modal from "./generic-components/Modal.svelte";

    import { createEventDispatcher } from "svelte";
    import languages from "./languages";
    import modalList from "./modal-list";
    import type { CMParams } from "./types";

    export let loading: boolean;

    let id: string = "",
        rawSearch: string = "",
        rawLimit: number = 10,
        caseSensitive: boolean = false,
        regex: boolean = false,
        lang: string = "English";

    const languageList = Object.keys(languages);

    const dispatch = createEventDispatcher<{ search: CMParams }>();

    let abortController: AbortController;

    function dispatchSearch() {
        const flags = caseSensitive ? "gmu" : "gmiu";
        const search = regex ? new RegExp(rawSearch, flags) : rawSearch;

        const roundedLimit = Math.round(rawLimit);
        const limit = roundedLimit > 0 ? roundedLimit : Infinity;

        abortController = new AbortController();
        const { signal } = abortController;

        const params = {
            id,
            search,
            limit,
            caseSensitive,
            lang,
            signal,
        } as CMParams;

        dispatch("search", params);
    }

    function abortSearch() {
        abortController?.abort("User pressed abort button");
    }

    function keyPressed(ev: KeyboardEvent) {
        if (ev.key === "Enter") {
            dispatchSearch();
        }
    }

    let modalElm: string | null = null;
    let modalOpen = false;
    function openModal(ev: CustomEvent<string>) {
        modalElm = ev.detail;
        modalOpen = true;
    }
</script>

{#if modalElm}
    <Modal bind:open={modalOpen}>
        <svelte:component
            this={modalList[modalElm].modal}
            bind:channelId={id}
        />
    </Modal>
{/if}

<div id="search-box" on:keydown={keyPressed}>
    <label>
        <ClickableTooltip
            title={modalList["findid"].title}
            clickedTitle={modalList["findid"].clickedTitle}
            clickElm={"findid"}
            on:openpopup={openModal}
        >
            YouTube channel ID
        </ClickableTooltip>
        <input type="text" bind:value={id} />
    </label>
    <label>
        <ClickableTooltip
            title={modalList["queries"].title}
            clickedTitle={modalList["queries"].clickedTitle}
            clickElm={"queries"}
            on:openpopup={openModal}
        >
            Search query
        </ClickableTooltip>
        <input type="text" bind:value={rawSearch} />
    </label>

    <div class="toggles">
        <div class="toggle-block">
            <div class="toggle-label">
                <BasicTooltip
                    title={"Alternates between basic string matching and ECMAScript Regular Expressions"}
                >
                    {regex ? "Regular expressions" : "String match"}
                </BasicTooltip>
            </div>

            <Toggle bind:checked={regex} onimg={regexSvg} offimg={stringSvg} />
        </div>

        <div class="toggle-block">
            <div class="toggle-label">
                <BasicTooltip
                    title={"Alternates between case senstive and insensitive matching"}
                >
                    Case {caseSensitive ? "" : "in"}sensitive
                </BasicTooltip>
            </div>

            <Toggle
                bind:checked={caseSensitive}
                onimg={sensitiveSvg}
                offimg={insensitiveSvg}
            />
        </div>
    </div>

    <label>
        <BasicTooltip
            title={"Sets the limit to the number of videos to search captions of (starts at latest video)" +
                ", 0 disables the limit and searches YouTuber's entire public catalogue"}
        >
            Limit
        </BasicTooltip>
        <input type="number" bind:value={rawLimit} min="0" />
    </label>
    <div class="toggle-block">
        <div class="toggle-label">
            <BasicTooltip title={"Selects language to search captions of"}>Language</BasicTooltip>
        </div>

        <select bind:value={lang}>
            {#each languageList as lang}
                <option value={lang}>{lang}</option>
            {/each}
        </select>
    </div>
</div>

{#if loading}
    <button on:click={abortSearch}>Abort</button>
{:else}
    <button on:click={dispatchSearch}>Search</button>
{/if}

<style lang="scss">
    $input-height: 24pt;
    $input-padding: 2pt 4pt;
    $line-margin: 8pt auto;
    $corners: 2pt;

    * {
        font-size: 12pt;
        transition: 0.4 ease-in-out;
    }

    #search-box {
        width: 80%;
        max-width: 800px;
        background-color: var(--elmbg);
        margin: 18px auto;
        padding: 2em;
        border-radius: $corners * 4;
    }

    label {
        display: inline-block;
        width: 48%;
        margin: $line-margin;
        input {
            height: $input-height;
            line-height: $input-height;
            padding: $input-padding;
            border-radius: $corners;
            width: 90%;
            display: block;
            margin: 4px auto;
        }
    }

    select {
        height: $input-height * 1.3;
        line-height: $input-height;
        padding: $input-padding;
        border-radius: $corners;
        margin-top: 4px;
        display: inline-block;
        width: 93%;
        cursor: pointer;
    }

    .toggles {
        width: 100%;
        display: block;
        margin: auto;
    }

    .toggle-block {
        display: inline-block;
        width: 48%;
        margin: $line-margin;
        .toggle-label {
            display: block;
            margin-bottom: 0.2em;
        }
    }

    button {
        margin-top: 2em;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type="number"] {
        appearance: textfield;
        -moz-appearance: textfield;
    }
</style>
