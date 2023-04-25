# YouTube caption search

This is a tool designed to search for specific sentences in a YouTube channel's
caption text, it supports case sensitive and insensitive matching, string
matching or ECMAScript regular expressions, all languages officially supported
by YouTube's creator interface and has a user-selectable limit to the number of
videos crawled.

## Disclaimers

YouTube caption search simply searches publicly available data that any user
could access via the YouTube frontend's view transcript, it will not work on
unlisted and especially not on private videos.

I am not responsible for any end a user chooses to use this tool for as that is
solely up to the user's discretion.

## How to build

This frontend was made using the Svelte framework and the Vite build system, to
do changes to the tool, you'll need node.js and the packages listed in the
package.json. If you intend to submit changes upstream that include modified
package versions, please use pnpm as your package manager instead of npm in
order to keep dependency locking consistent.

## Systems leveraged

This project uses the [piped API](https://github.com/TeamPiped/Piped), a privacy
focused wrapper for the YouTube API to gather channel, video and subtitle info.
