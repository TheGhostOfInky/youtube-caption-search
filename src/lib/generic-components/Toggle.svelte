<script lang="ts">
    export let checked: boolean;
    export let onimg: string = "";
    export let offimg: string = "";

    let content: string;
    $: content = checked ? onimg : offimg;
</script>

<label>
    <input type="checkbox" on:click bind:checked />
    <div class="slider" style="--content: url({content})" />
</label>

<style lang="scss">
    label {
        position: relative;
        display: inline-block;
        margin: auto;
        width: 60px;
        height: 34px;

        input[type="checkbox"] {
            opacity: 0;
            width: 0;
            height: 0;
        }
    }

    .slider {
        inset: 0 0 0 0;
        position: absolute;
        background-color: var(--elmfg);
        transition: 0.6s;
        border-radius: 34px;
        cursor: pointer;

        &::before {
            position: absolute;
            content: var(--content);
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: var(--appbg);
            border-radius: 50%;
            transition: 0.5s ease-out;

            input:checked + & {
                transform: translateX(26px);
            }
        }
    }
</style>
