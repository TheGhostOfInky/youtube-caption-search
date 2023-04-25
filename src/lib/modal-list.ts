import FindId from "./modals/FindId.svelte";
import Queries from "./modals/Queries.svelte";

export default {
    "findid": {
        modal: FindId,
        title: "The Channel ID for the channel you want to search through",
        clickedTitle: "The channel ID can be obtained in several different ways, simplest one is by using a video URL from that channel, click the purple question mark to learn more:"
    },
    "queries": {
        modal: Queries,
        title: "A query of the text you wish to find in the subtitles",
        clickedTitle: "The query can be under the format of a string or an ECMAScript regular expression, click the purple question mark to learn more"
    }
} as Record<string, { modal: any, title: string, clickedTitle: string }>;