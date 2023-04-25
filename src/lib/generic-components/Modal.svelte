<script lang="ts">
    export let open: boolean = true;
    let dialog: HTMLDialogElement;
    $: if (dialog && open) dialog.showModal();

    function keyPress(ev: KeyboardEvent) {
        if (ev.key === "Escape") {
            dialog.close();
        }
    }
</script>

<dialog
    bind:this={dialog}
    on:close={() => (open = false)}
    on:click|self={() => dialog.close()}
    on:keypress={keyPress}
>
    <div class="bg" />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="grid">
        <div on:click|stopPropagation class="content">
            <slot />
            <button on:click={() => dialog.close()}>Close</button>
        </div>
    </div>
</dialog>

<style lang="scss">
    dialog {
        box-sizing: border-box;
        width: 100vw;
        height: 100vh;
        border-style: none;
        top: 0;
        left: 0;
        border: 0;
        margin: 0 auto;
        padding: 0;
        background: none;
    }

    .grid {
        display: grid;
        align-items: center;
        text-align: center;
        height: 100%;
        width: 100%;
    }

    .bg {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100vw;
        height: 100vh;
        animation: gradual-blur 0.3s ease-in-out;
        background-color: rgba($color: #000, $alpha: 0.3);
        backdrop-filter: blur(26px);
    }

    .content {
        margin: auto;
        position: relative;
        z-index: 2;
        width: fit-content;
        height: fit-content;
        place-self: center;
    }

    @keyframes gradual-blur {
        from {
            background-color: rgba($color: #000000, $alpha: 0);
            backdrop-filter: blur(2px);
        }
        to {
            background-color: rgba($color: #000, $alpha: 0.3);
            backdrop-filter: blur(26px);
        }
    }
</style>
