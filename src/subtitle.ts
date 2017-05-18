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
 * A subtitle is text transcribing what is being said in a video at a particular
 * time which is displayed on top of that video for a limited duration.
 * As such it contains the text to be displayed (multiline, possibly w/ embedded
 * formatting) the time offset from the start of the video when the text should
 * be displayed, and the time offset when that text should no longer be displayed.
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
     */
    constructor({ startTime = new TimeSpan(),
                  endTime = new TimeSpan(),
                  text = [] }: Subtitle_Config = {})
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
     * @param offset
     *      Amount of time to adjust when the subtitle is displayed.
     */
    adjustTime(offset: TimeSpan): void
    {
        this.startTime.add(offset);
        this.endTime.add(offset);
    }

    /* **************************************************************************
     * toSrt                                                               */ /**
     *
     * Get the subtitle as an array of lines in the SRT format. The lines
     * will not include an initial line w/ the subtitle index number as it is
     * not known, nor will it include the trailing empty line signifying the
     * end of the subtitle text.
     */
    toSrt(): string[]
    {
        let srtLines: string[] =
            [
                // 00:00:05,806 --> 00:00:06,905
                `${Subtitle.toSrtTimeString(this.startTime)} --> ${Subtitle.toSrtTimeString(this.endTime)}`,
                ...this.text
            ];

        return srtLines;
    }

    /* **************************************************************************
     * toSrtTimeString - static                                            */ /**
     *
     * Get the SRT format representation of a given TimeSpan.
     *
     * @param t
     *      The TimeSpan whose SRT representation is desired
     *
     * @returns SRT formatted offset time:
     *      * hh:mm:ss,fff where each value is zero left padded.
     *          * hh - hours; mm - minutes; ss - seconds; fff - milliseconds
     */
    static toSrtTimeString(t: TimeSpan): string
    {
        let h = (t.hours < 10 ? "0" : "") + t.hours.toFixed();
        let m = (t.minutes < 10 ? "0" : "") + t.minutes.toFixed();
        let s = (t.seconds < 10 ? "0" : "") + t.seconds.toFixed();
        let ms = (t.milliseconds < 100 ? "0" : "") + (t.milliseconds < 10 ? "0" : "") + t.milliseconds.toFixed();

        return `${h}:${m}:${s},${ms}`;
    }

    /* **************************************************************************
     * parseSrtDisplayTimes - static                                       */ /**
     *
     * Parse an SRT subtitle display time line (of the format
     * hh:mm:ss,fff --> hh:mm:ss,fff) into startTime and endTime TimeSpans.
     *
     * @param srtDisplayTime
     *      SRT subtitle display time line
     *
     * @returns Object w/ startTime and endTime properties matching the values
     *      in the given string.
     *
     * @throws {Error} If the given srtDisplayTime doesn't contain appropriately
     *      formatted start and end times.
     */
    static parseSrtDisplayTimes(srtDisplayTime: string): { startTime: TimeSpan, endTime: TimeSpan }
    {
        let srtTimesRe = /(\d\d):(\d\d):(\d\d),(\d\d\d) --> (\d\d):(\d\d):(\d\d),(\d\d\d)/;

        let reResult = srtTimesRe.exec(srtDisplayTime);

        if (reResult === null)
            throw new Error(`Invalid SRT Display Time: "${srtDisplayTime}"`);

        let [ , sHr, sMin, sSec, sMs, eHr, eMin, eSec, eMs ]: string[] = reResult;

        let startTime = new TimeSpan(parseInt(sMs, 10), parseInt(sSec, 10), parseInt(sMin, 10), parseInt(sHr, 10));
        let endTime = new TimeSpan(parseInt(eMs, 10), parseInt(eSec, 10), parseInt(eMin, 10), parseInt(eHr, 10));

        return { startTime, endTime };
    }
}

/* ******************************************************************************
 * Subtitle_Config                                                         */ /**
 *
 * The Subtitle_Config defines the object passed to the constructor that
 * contains options/values used to initialize an instance of a Subtitle.
 *
 * @property startTime
 *      The time offset into the video when the subtitle should start being
 *      overlayed onto the video. Defaults to 00:00:00,000
 *
 * @property endTime
 *      The time offset into the video when the overlayed subtitle should be
 *      removed from the video, must be greater than or equal to the startTime.
 *      Defaults to 00:00:00,000
 *
 * @property text
 *      The array of text lines that are overlayed on the video. Defaults to
 *      an empty array (no text).
 */
interface Subtitle_Config
{
    startTime?: TimeSpan;
    endTime?: TimeSpan;
    text?: string[];
}


