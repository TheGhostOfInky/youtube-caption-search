import type { ChannelPage, Stream, Subtitle, SubMatch, CMParams } from "./types";
import languages from "./languages";

const parser = new DOMParser();

//Generic JSON fetcher with error handling
async function getJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    const contentType = response.headers.get("Content-Type") ?? "null";
    if (response.status > 299 || !contentType.startsWith("application/json")) {
        throw new Error(
            `Invalid response:\nStatus: ${response.status}\nContent-Type: ${contentType}`
        );
    }
    return response.json() as T;
}

//Direct API wrappers
async function* getChannelPage(id: string): AsyncGenerator<ChannelPage, void, void> {
    let data = await getJson<ChannelPage>(`https://pipedapi.kavin.rocks/channel/${id}`);
    yield data;
    while (data.nextpage) {
        const next = new URLSearchParams([["nextpage", data.nextpage]]);
        const url = `https://pipedapi.kavin.rocks/nextpage/channel/${id}?${next}`;
        yield data = await getJson<ChannelPage>(url);
    }
}

export async function getVideo(id: string): Promise<Stream> {
    return getJson<Stream>(`https://pipedapi.kavin.rocks/streams/${id}`);
}

async function getSubtitles(sub: Subtitle): Promise<XMLDocument> {
    const response = await fetch(sub.url);

    const contentType = response.headers.get("Content-Type") ?? "null";
    if (response.status > 299 || contentType.search("xml") === -1) {
        throw new Error(
            `Invalid response:\nStatus: ${response.status}\nContent-Type: ${contentType}`
        );
    }

    const text = await response.text();
    return parser.parseFromString(text, "text/xml");
}

//2nd order wrapper, returns all subtitle elements + important info from a video
async function getVideoSubtitles(
    id: string, language: string
): Promise<[elms: HTMLParagraphElement[], title: string, video: string]> {

    const lang = languages[language] ?? "en";
    const video = await getVideo(id);
    const subsXML = await Promise.all(
        video.subtitles.filter(
            ({ code }) => code.startsWith(lang)
        ).map(getSubtitles)
    );

    const subs = subsXML.map(
        x => [...x.getElementsByTagName("p")]
    ).flat();

    return [subs, video.title, video.uploadDate];
}

//Simple h:m:s string to tuple converter
function parseTime(time: string): [h: number, m: number, s: number] {
    const matches = time.match(/^(\d*):(\d*):(\d*).\d*$/);
    if (!matches) return [0, 0, 0];
    return matches.slice(1, 4).map(x => parseInt(x)) as [number, number, number];
}

//Runs each paragraph element through the pattern and returns final object
function parseMatch(
    elm: HTMLParagraphElement,
    search: string | RegExp,
    info: { id: string, name: string, date: string },
    caseSensitive: boolean = true,
    locale: string = "en"): null | SubMatch {

    if (elm.childNodes.length === 0) return null;
    const textContent = [...elm.childNodes]
        .filter(x => x.nodeName === "#text")
        .map(x => x.textContent)
        .join(" ");

    const text = caseSensitive ? textContent : textContent.toLocaleLowerCase(locale);
    const postiion = text.search(search);

    if (postiion < 0) return null;
    const time = parseTime(elm.getAttribute("begin") ?? "");
    const seconds = time[0] * 3600 + time[1] * 60 + time[2];

    return {
        link: `https://youtu.be/${info.id}?t=${seconds}`,
        text: textContent,
        time: time.map(x => x.toFixed(0).padStart(2, "0")).join(":"),
        id: info.id,
        name: info.name,
        date: info.date
    };

}

//Asynchronous generator that consolidates all the core logic of the application
export async function* getCaptionMatches(
    { id, search, signal, limit = Infinity, caseSensitive = true, lang = "English" }: CMParams
): AsyncGenerator<SubMatch[], void, void> {

    const locale = languages[lang] ?? "en";
    const parsedSearch = caseSensitive || (search instanceof RegExp)
        ? search : search.toLocaleLowerCase(locale);

    const page = getChannelPage(id);
    let done = 0;

    mainLoop: for await (const result of page) {

        const videos = result.relatedStreams.map(
            x => x.url.replace("/watch?v=", "")
        );

        for (const video of videos) {
            if (++done > limit || signal.aborted) {
                break mainLoop;
            }

            const subs = await getVideoSubtitles(video, lang);

            const info = { id: video, name: subs[1], date: subs[2] };

            const matches = subs[0].map(
                x => parseMatch(x, parsedSearch, info, caseSensitive, locale)
            ).filter(x => x) as SubMatch[];

            if (matches.length > 0) {
                yield matches;
            }
        }
    }
}