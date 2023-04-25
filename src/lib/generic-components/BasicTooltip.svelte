<script lang="ts">
    export let title: string;
    let isHovered: boolean = false;
    let x: number, y: number;

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
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
    on:mouseover={mouseOver}
    on:mousemove={mouseMove}
    on:mouseleave={mouseLeave}
>
    <slot />
</div>

{#if isHovered}
    <div style="top: {y}px; left: {x}px" class="tooltip">{title}</div>
{/if}

<style lang="scss">
    .tooltip {
        border: 1px solid var(--elmfg);
        box-shadow: 1px 1px 1px var(--elmfg);
        background: var(--elmbg);
        border-radius: 4px;
        padding: 4px 8px;
        position: absolute;
        max-width: 50vh;
        z-index: 5;
        transition: none;
    }
</style>
