'use strict';

/**
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
