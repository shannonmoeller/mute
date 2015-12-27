'use strict';

/**
 * Politely tells one or more streams to shut the heck up for a moment by
 * temporarily reassigning their write methods. Useful when testing noisey
 * modules which lack verbosity options. Mutes `stdout` and `stderr` by default.
 *
 * @example
 *     var unmute = mute();
 *
 *     console.log('foo');   // doesn't print 'foo'
 *     console.error('bar'); // doesn't print 'bar'
 *
 *     unmute();
 *
 *     console.log('foo');   // prints 'foo'
 *     console.error('bar'); // prints 'bar'
 *
 * @type Function
 * @param {Stream,Array.<Stream>} ...streams Streams to mute. Defaults to `stdout` and `stderr`.
 * @return {Function} An unmute function.
 */

var concat = Array.prototype.concat;

function mute(stream) {
    var write = stream && stream.write;
    var orig = write && write.write;

    if (orig) {
        return;
    }

    function noop() {}
    noop.write = write;
    stream.write = noop;
}

function unmute(stream) {
    var write = stream && stream.write;
    var orig = write && write.write;

    if (!orig) {
        return;
    }

    stream.write = orig;
}

module.exports = function muteStreams() {
    var streams = concat.apply([], arguments);

    if (!streams.length) {
        streams = [process.stdout, process.stderr];
    }

    streams.forEach(mute);

    return function unmuteStreams() {
        streams.forEach(unmute);
    };
};
