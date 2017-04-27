/* ******************************************************************************
 * timespan.d.ts                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview Typescript declaration file for the timespan node package
 *
 * The [timespan package]{@link https://www.npmjs.com/package/timespan} provides
 * a class to represent and operate on time spans.
 *
 * Created on       April 25, 2017
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2017 Michael Jay Lippert,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

declare class TimeSpan
{
    constructor(milliseconds?: number, seconds?: number, minutes?: number, hours?: number, days?: number);

    add(timeSpan: TimeSpan): void;
    addMilliseconds(milliseconds: number): void;
    addSeconds(seconds: number): void;
    addMinutes(minutes: number): void;
    addHours(hours: number): void;
    addDays(days: number): void;

    subtract(timeSpan: TimeSpan): void;
    subtractMilliseconds(milliseconds: number): void;
    subtractSeconds(seconds: number): void;
    subtractMinutes(minutes: number): void;
    subtractHours(hours: number): void;
    subtractDays(days: number): void;

    totalMilliseconds(roundDown: boolean ): number;
    totalSeconds(roundDown: boolean ): number;
    totalMinutes(roundDown: boolean ): number;
    totalHours(roundDown: boolean ): number;
    totalDays(roundDown: boolean ): number;

    readonly milliseconds: number;
    readonly seconds: number;
    readonly minutes: number;
    readonly hours: number;
    readonly days: number;

    equals(timeSpan: TimeSpan): boolean;
    toString(): string;
}

declare function fromMilliseconds(milliseconds: number): TimeSpan;
declare function fromSeconds(seconds: number): TimeSpan;
declare function fromMinutes(minutes: number): TimeSpan;
declare function fromHours(hours: number): TimeSpan;
declare function fromDays(days: number): TimeSpan;
declare function parse(str: string): TimeSpan;
declare function parseDate(str: string): TimeSpan;
declare function fromDates(start: Date, end: Date, abs: boolean): TimeSpan | null;
declare function test(str: string): boolean;
declare function instanceOf(timeSpan: TimeSpan): boolean;
declare function clone(timeSpan: TimeSpan): TimeSpan;

export
{
    TimeSpan,
    fromMilliseconds,
    fromSeconds,
    fromMinutes,
    fromHours,
    fromDays,
    parse,
    parseDate,
    fromDates,
    test,
    instanceOf,
    clone
};
