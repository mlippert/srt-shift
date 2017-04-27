/* ******************************************************************************
 * subtitle.ts                                                                  *
 * *************************************************************************/ /**
 *
 * @fileoverview Subtitle class
 *
 * An instance of the Subtitle class represents a subtitle displayed on a video.
 * Its properties consist of:
 * - The start offset time when the subtitle should be displayed.
 * - The end offset time when the subtitle should be removed.
 * - The text of the subtitle.
 *
 * Created on       April 27, 2017
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2017 Michael Jay Lippert,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { TimeSpan } from 'timespan';


/* ******************************************************************************
 * Subtitle                                                                */ /**
 *
 * [Description of the Subtitle class]
 *
 ********************************************************************************/
export default class Subtitle
{
    /** The start offset time when the subtitle should be displayed. */
    startTime: TimeSpan;

    /** The end offset time when the subtitle should be removed. */
    endTime: TimeSpan;

    /** The text lines of the subtitle. */
    text: string[];

    /* **************************************************************************
     * constructor                                                         */ /**
     *
     * Subtitle class constructor.
     *
     * @param {!Subtitle.Config=} config
     *      The settings to configure this Subtitle
     *
     */
    constructor({ startTime = new TimeSpan(),
                  endTime = new TimeSpan(),
                  text = [] }: { startTime?: TimeSpan, endTime?: TimeSpan, text?: string[] } = {})
    {
        // instance properties
        this.startTime = startTime;
        this.endTime = endTime;
        this.text = text;
    }

    /* **************************************************************************
     * adjustTime                                                          */ /**
     *
     * Adjust the time that the subtitle is displayed by the given timespan. To
     * display earlier, the given timespan should be negative.
     *
     * @param {TimeSpan} offset
     *      Amount of time to adjust when the subtitle is displayed.
     */
    adjustTime(offset: TimeSpan): void
    {
        this.startTime.add(offset);
        this.endTime.add(offset);
    }
}

/* ******************************************************************************
 * Subtitle.Config                                                         */ /**
 *
 * The Subtitle.Config defines the object passed to the constructor that
 * contains options/values used to initialize an instance of a Subtitle.
 *
 * @typedef {!Object} Subtitle.Config
 *
 * @property {string | undefined} property1_name
 *      [description of property1_name]
 */

