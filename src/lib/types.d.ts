export type ChannelPage = {
    nextpage: string;
    relatedStreams: RelatedStream[];
};

export type RelatedStream = {
    url: string;
};

export type Stream = {
    subtitles: Subtitle[];
    title: string;
    uploaderUrl: string;
    uploadDate: string;
};

export type Subtitle = {
    mimeType: string;
    url: string;
    code: string;
};

export type SubMatch = {
    link: string;
    text: string;
    time: string;
    id: string;
    name: string;
    date: string;
};

export type CMParams = {
    id: string;
    search: string | RegExp;
    limit: number;
    caseSensitive: boolean;
    lang: string;
    signal: AbortSignal;
};