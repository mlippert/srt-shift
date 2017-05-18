import { createReadStream, createWriteStream } from 'fs';
import { Readable } from 'stream';

import { TimeSpan, clone as cloneTS } from 'timespan';
import parseArgs = require('minimist');
import Subtitle from './subtitle';
import { LineTransform } from './textfilelines';

let argv = parseArgs(process.argv.slice(2));
console.dir(argv);


let s1 = new Subtitle({ endTime: new TimeSpan(100, 1) });
console.dir(s1);

s1.adjustTime(new TimeSpan(0, 2));
console.dir(s1);

s1.adjustTime(new TimeSpan(-10, -1));
console.dir(s1);


// Open the given srt file

// Create a read stream

function getSubtitle(verifySubtitleNum: number): Subtitle | null
{
    if (verifySubtitleNum > 4)
        return null;

    let startTime = new TimeSpan(verifySubtitleNum * 1000);
    let endTime = cloneTS(startTime);
    endTime.addMilliseconds(1000);
    return new Subtitle({ startTime, endTime, text: [`${verifySubtitleNum}`] });
}

// Create a write stream

function writeSubtitle(st: Subtitle): void
{
    console.dir(st);
    console.log(st.toSrt().join("\n"));
}

// Loop reading 1 subtitle at a time shifting its display time and writing it to the
// output file.


// TODO: get timeshift from commandline
let timeshift = new TimeSpan(27, 11, 24);

/*
for (let subtitleNum = 1, st = getSubtitle(subtitleNum);
     st !== null;
     st = getSubtitle(++subtitleNum))
{
    st.adjustTime(timeshift);
    writeSubtitle(st);
}
*/

let inSrtFile: { subtitleNum: number, st: Subtitle | null, [Symbol.iterator](): IterableIterator<any> } =
{
    subtitleNum: 0,
    st: null,
    * [Symbol.iterator]()
    {
        while (true)
        {
            this.st = getSubtitle(++this.subtitleNum);
            if (this.st !== null)
                yield this.st;
            else
                break;
        }

        /*
        for (let subtitleNum = 1, st = getSubtitle(subtitleNum);
             st !== null;
             st = getSubtitle(++subtitleNum))
        {
            yield st;
        }
        */
    }
};

function getNextSrt(lineStrm: Readable): Promise<Subtitle>
{
    let executor = (resolve: (value: Subtitle | PromiseLike<Subtitle>) => void, reject: (reason?: any) => void) =>
    {
        return resolve(new Subtitle());
    };

    return new Promise(executor);
}

function processSubtitle(st: Subtitle): Subtitle
{
    st.adjustTime(timeshift);

    return st;
}

let outputSubtitleCount = 0;
function outputSubtitle(st: Subtitle): void
{
    let lines: (string | number)[] =
        [
            ++outputSubtitleCount,
            ...st.toSrt(),
            "\n"
        ];

    process.stdout.write(lines.join("\n"));

}

function processSrtFile(srtFileName: string): Promise<void>
{
    let inStrm = createReadStream(srtFileName, { encoding: "utf8" });
    let lineTStrm = new LineTransform({ encoding: "utf8", decodeStrings: false });
    let lineStrm = inStrm.pipe(lineTStrm);


    let executor = (resolve: (value?: PromiseLike<void>) => void, reject: (reason?: any) => void) =>
    {
        let done = (reason: any) =>
        {
            reason;
            resolve();
        };

        getNextSrt(lineStrm)
            .then(processSubtitle)
            .then(outputSubtitle)
            .then(() => { return new Promise(executor); })
            .catch(done);
    };

    return new Promise(executor);
}

// test parseSrtDisplayTimes
let p1 = Subtitle.parseSrtDisplayTimes("00:41:27,519 --> 00:41:30,153");
console.dir(p1);
console.log(`p1.st = ${Subtitle.toSrtTimeString(p1.startTime)} p1.et = ${Subtitle.toSrtTimeString(p1.endTime)}`);
let p2 = Subtitle.parseSrtDisplayTimes("    00:01:27,519 --> 00:01:30,003");
console.dir(p2);
console.log(`p2.st = ${Subtitle.toSrtTimeString(p2.startTime)} p2.et = ${Subtitle.toSrtTimeString(p2.endTime)}`);
let p3 = Subtitle.parseSrtDisplayTimes("    00:54:07,519 --> 00:54:09,010 foobar");
console.dir(p3);
console.log(`p3.st = ${Subtitle.toSrtTimeString(p3.startTime)} p3.et = ${Subtitle.toSrtTimeString(p3.endTime)}`);


for (let st of inSrtFile)
{
    st.adjustTime(timeshift);
    writeSubtitle(st);
}

/*
let inStrm = createReadStream("testdata/See Jane Date (2003) cf (Aug_31_2014, HALLHD).srt",
                              { encoding: "utf8" });

//let lineStrm = new LineTransform({ encoding: "utf8", decodeStrings: false, highWaterMark: 1000 });
let lineStrm = new LineTransform({ encoding: "utf8", decodeStrings: false });

//inStrm.pipe(lineStrm).pipe(createWriteStream("/dev/null"));
inStrm.pipe(lineStrm).pipe(process.stdout);

*/
