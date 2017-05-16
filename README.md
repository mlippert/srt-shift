# srt-shift

A simple project to shift all subtitles in an [SRT][] subtitle file by some timespan.

The impetus for this project is that I use [ccextractor][] to convert the closed captions from TV
shows that I've transferred from my [TiVo][] using [kmttg][]. However on some channels the
subtitles end up showing later than they should, off by about a second or so. This is really
annoying and easily correctable because the SRT subtitle file is quite simple.

The implementation in this repository is needlessly complex because I'm taking the opportunity to
figure out how to write a nodejs utility to do it. I'm initially starting with a commandline utility
but I came across [electron][] so I may also explore using it to provide a GUI.

The best tool for the job is probably a simple [awk][] script which I may eventually also create.

[SRT]: <https://matroska.org/technical/specs/subtitles/srt.html>
[ccextractor]: <https://www.ccextractor.org/>
[TiVo]: <https://www.tivo.com/>
[kmttg]: <https://sourceforge.net/p/kmttg/wiki/Home/>
[electron]: <https://electron.atom.io/>
[awk]: <https://www.gnu.org/software/gawk/manual/gawk.html>

## Development

### Node version

See the `package.json` for minimum required node version (currently v6) as well as other
dependency versions.

The source code is [typescript][] which is compiled into the `dist` subdirectory.

The entry point is `src/main.ts` => `dist/main.js`.

Use npm or yarn to install the package dependencies then build the sources into the `dist`
subdirectory.

- `npm install` or `yarn install`
- `npm run build` or `yarn run build`

Run the compiled code:

- `node dist/main.js`

[typescript]: <https://www.typescriptlang.org/>

### awk version

To be implemented.