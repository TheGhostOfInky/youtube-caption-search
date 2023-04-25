<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import questionSvg from "../../assets/question.svg";

    export let title: string;
    export let clickedTitle: string;
    export let clickElm: string;

    const dispatch = createEventDispatcher<{ openpopup: string }>();

    let isHovered: boolean = false;
    let isClicked: boolean = false;
    let x: number, y: number;
    let ix: number, iy: number;

    function mouseOver(event: MouseEvent) {
        isHovered = true;
        x = event.pageX + 5;
        y = event.pageY + 5;
    }

    function mouseMove(event: MouseEvent) {
        x = event.pageX + 5;
        y = event.pageY + 5;
    }

    function mouseLeave() {
        isHovered = false;
    }

    function mouseDown(event: MouseEvent) {
        const { target } = event;
        if (!target || !(target instanceof HTMLElement)) return;

        isClicked = !isClicked;
        const bounds = target.getBoundingClientRect();
        const wWidth = window.innerWidth;

        iy = event.pageY + 5;

        if (event.pageX < wWidth - 200) {
            ix = event.pageX + 5;
        } else {
            ix = bounds.left;
        }
    }

    function questionClick(event: MouseEvent) {
        if (event.button === 0) {
            isClicked = false;
            dispatch("openpopup", clickElm);
        }
    }

    function infotipClick() {
        isClicked = false;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
    class="clickable-tooltip"
    on:mouseover={mouseOver}
    on:mousemove={mouseMove}
    on:mouseleave={mouseLeave}
    on:click|preventDefault={mouseDown}
>
    <slot />
</div>

{#if isClicked}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        style="top: {iy}px; left: {ix}px"
        class="infotip"
        on:click={infotipClick}
    >
        {clickedTitle}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img
            src={questionSvg}
            alt="question-icon"
            on:click|preventDefault={questionClick}
        />
    </div>
{:else if isHovered}
    <div style="top: {y}px; left: {x}px" class="tooltip">{title}</div>
{/if}

<style lang="scss">
    @mixin tip($padding) {
        border: 1px solid var(--elmfg);
        box-shadow: 1px 1px 1px var(--elmfg);
        background: var(--elmbg);
        border-radius: 4px;
        padding: $padding;
        position: absolute;
        max-width: 50vh;
        z-index: 5;
    }

    .tooltip {
        @include tip(4px 8px);
        transition: none;
    }
    .infotip {
        @include tip(8px 32px);

        img {
            cursor: pointer;
            margin-left: 8px;
            margin-bottom: -6px;
        }
    }
    .clickable-tooltip {
        cursor: pointer;
    }
</style>
