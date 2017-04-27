import { TimeSpan } from 'timespan';
import parseArgs = require('minimist');

let argv = parseArgs(process.argv.slice(2));
console.dir(argv);

class Student
{
    fullName: string;
    constructor(public firstName: string,
                public middleInitial: string,
                public lastName: string)
    {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person
{
    firstName: string;
    lastName: string;
}

function greeter(person: Person)
{
    return `Hello, ${person.firstName} ${person.lastName}`;
}

var user = new Student("Jane", "M.", "User");

//document.body.innerHTML = greeter(user) + "\n" + JSON.stringify(argv);


let elapsed = new TimeSpan(1, 0, 0,0, 0);
