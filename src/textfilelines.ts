/* ******************************************************************************
 * textfilelines.ts                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview [summary of file contents]
 *
 * [More detail about the file's contents]
 *
 * Created on       April 28, 2017
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2017 Michael Jay Lippert,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { Transform } from 'stream';


/* ******************************************************************************
 * TextFileLines                                                           */ /**
 *
 * [Description of the TextFileLines class]
 *
 ********************************************************************************/
class TextFileLines implements Iterable<string>
{
    /* **************************************************************************
     * constructor                                                         */ /**
     *
     * TextFileLines class constructor.
     *
     * @param {!TextFileLines.Config=} config
     *      The settings to configure this TextFileLines
     *
     */
    constructor(config = {})
    {
        config;
        // instance properties

    }

    * [Symbol.iterator]()
    {
        yield "";
    }

    /*
    [Symbol.iterator](): LineIterator
    {
        return new LineIterator();
    }
    */
}

/* ******************************************************************************
 * TextFileLines.Config                                                    */ /**
 *
 * The TextFileLines.Config defines the object passed to the constructor that
 * contains options/values used to initialize an instance of a TextFileLines.
 *
 * @typedef {!Object} TextFileLines.Config
 *
 * @property {string | undefined} property1_name
 *      [description of property1_name]
 */

/* ******************************************************************************
 * LineIterator                                                            */ /**
 *
 * [Description of the LineIterator class]
 *
 ********************************************************************************/
class LineIterator implements Iterator<string>
{
    /* **************************************************************************
     * constructor                                                         */ /**
     *
     * LineIterator class constructor.
     *
     * @param {!LineIterator.Config=} config
     *      The settings to configure this LineIterator
     *
     */
    constructor(config = {})
    {
        config;
        // instance properties

    }

    next(): IteratorResult<string>
    {
        return { value: "", done: true };
    }
}

/* ******************************************************************************
 * LineIterator.Config                                                     */ /**
 *
 * The LineIterator.Config defines the object passed to the constructor that
 * contains options/values used to initialize an instance of a LineIterator.
 *
 * @typedef {!Object} LineIterator.Config
 *
 * @property {string | undefined} property1_name
 *      [description of property1_name]
 */


export class LineTransform extends Transform
{
    private _lastLine: string;
    private _continueTransform: () => void | null;
    private _transforming: boolean;
    private _debugTransformCallCount: number;

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(options?: any)
    {
        super(options);

        this._lastLine = "";
        this._continueTransform = null;
        this._transforming = false;
        this._debugTransformCallCount = 0;
    }

    /* **************************************************************************
     * _transform                                                          */ /**
     *
     * [Description of _transform]
     */
    _transform(chunk: Buffer | string,
               encoding: string,
               callback: (err?: Error | null, data?: any) => void): void
    {
        if (encoding === "buffer")
        {
            return callback(new Error("Buffer chunks not supported"));
        }

        if (this._continueTransform !== null)
        {
            // this should never happen
            return callback(new Error("_transform called before previous transform has completed."));
        }

        console.error(`${++this._debugTransformCallCount} _transform called:`);

        this._transforming = true;

        // prepend the last (partial) line from the previous chunk transform and
        // break the new chunk into lines.
        let lines = (this._lastLine + chunk).split(/\r\n|\n/);
        this._lastLine = lines.pop();
        let nextLine = 0;
        this._continueTransform = () =>
            {
                while (nextLine < lines.length)
                {
                    if (!this.push(lines[nextLine++] + "\n"))
                    {
                        if (nextLine < lines.length)
                        {
                            return;
                        }

                        break;
                    }
                }

                console.error(`_continueTransform ${this._debugTransformCallCount} finished\n`);
                this._continueTransform = null;
                return callback();
            };

        this._continueTransform();
        this._transforming = false;
        return;
    }

    /* **************************************************************************
     * _flush                                                              */ /**
     *
     * [Description of _flush]
     */
    _flush(callback: (err?: Error | null, data?: any) => void)
    {
        if (this._lastLine.length > 0)
        {
            this.push(this._lastLine);
            this._lastLine = "";
        }

        return callback();
    }

    /* **************************************************************************
     * _read                                                               */ /**
     *
     * [Description of _read]
     */
    _read(size: number)
    {
        if (this._transforming)
            console.error(`_read called during _transform ${this._debugTransformCallCount}`);

        // If the previous _transform didn't finish continue it, otherwise
        // call the base Transform _read to initiate a new _transform if desired.
        if (!this._transforming && this._continueTransform !== null)
            this._continueTransform();
        else
            super._read(size);
    }
}
