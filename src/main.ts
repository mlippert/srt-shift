import { TimeSpan } from 'timespan';
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
