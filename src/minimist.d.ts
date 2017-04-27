/* ******************************************************************************
 * minimist.d.ts                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview Typescript declaration file for the minimist node package
 *
 * The [minimist package]{@link https://www.npmjs.com/package/minimist} provides
 * commandline argument parsing.
 *
 * Created on       April 25, 2017
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2017 Michael Jay Lippert,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

interface ParseOptions
{
    string?: string | string[];
    boolean?: boolean | string | string[];
    alias?: { [argname: string]: string | string[] };
    default?: { [argname: string]: any };
    stopEarly?: boolean;
    '--'?: boolean;
    unknown?: (arg: string) => boolean;
}

interface ParsedArgs
{
    '_': string[];
    '--'?: string[];
}

declare function parseArgs(args: string[], opts?: ParseOptions): ParsedArgs;

export = parseArgs;
