import { TimeSpan, clone as cloneTS } from 'timespan';
import parseArgs = require('minimist');
import Subtitle from './subtitle';

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
}

// Loop reading 1 subtitle at a time shifting its display time and writing it to the
// output file.


// TODO: get timeshift from commandline
let timeshift = new TimeSpan(-450);

for (let subtitleNum = 1, st = getSubtitle(subtitleNum);
     st !== null;
     st = getSubtitle(++subtitleNum))
{
    st.adjustTime(timeshift);
    writeSubtitle(st);
}
