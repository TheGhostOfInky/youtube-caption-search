<script lang="ts">
    import Toggle from "./generic-components/Toggle.svelte";
    import moonSvg from "../assets/moon.svg";
    import sunSvg from "../assets/sun.svg";
    import { onMount } from "svelte";
    type Theme = "dark" | "light";
    let dark: boolean;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    function currentTheme(): Theme {
        //Checks if there's a theme override applies to the document
        const color = document.documentElement.getAttribute("theme-override");
        if (color) {
            return color as Theme;
        }
        //Checks if the media rule for prefering dark color is on
        return prefersDark.matches ? "dark" : "light";
    }

    //Sync toggle on media rule changes
    prefersDark.addEventListener("change", () => {
        dark = currentTheme() === "dark";
    });

    function toggleTheme() {
        //Check if current theme is light and apply opposite
        const newDark = currentTheme() === "light";
        dark = newDark;
        const newTheme: Theme = newDark ? "dark" : "light";
        //Set the theme-override on the document and save to localStorage
        document.documentElement.setAttribute("theme-override", newTheme);
        localStorage.setItem("theme-override", newTheme);
    }

    onMount(() => {
        //Check if localStorage has a theme-override and apply to document
        //and toggle position, apply media rule otherwise
        const pref = localStorage.getItem("theme-override") as Theme | null;
        if (pref) {
            document.documentElement.setAttribute("theme-override", pref);
            dark = pref === "dark";
        } else {
            dark = currentTheme() === "dark";
        }
    });
</script>

<Toggle
    on:click={toggleTheme}
    bind:checked={dark}
    onimg={moonSvg}
    offimg={sunSvg}
/>
