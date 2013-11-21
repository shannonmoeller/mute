/*jshint node:true */
'use strict';

/**
 * Politely tells stdout and stderr to shut the heck up for a moment by
 * temporarily reassigning the stream's write methods. Useful when testing
 * overly noisey things like Yeoman generators.
 *
 * @example
 *     mute(function(unmute) {
 *         app.options.defaults = true;
 *
 *         app.run(function() {
 *             unmute();
 *
 *             helpers.assertFiles([
 *                 ['package.json', /"name": "temp-directory"/],
 *                 ['README.md',    /# TEMP.Directory/]
 *             ]);
 *
 *             done();
 *         });
 *     });
 *
 * @type Function
 * @param {Function} callback A function containing noisey code.
 * @return {Any} The return value of the callback, if any.
 */
module.exports = function mute(callback) {
    if (typeof callback !== 'function') {
        return;
    }

    var retval = null;
    var stdout = process.stdout.write;
    var stderr = process.stderr.write;
    var unmute = function() {
        process.stdout.write = stdout;
        process.stderr.write = stderr;
    };

    process.stdout.write = function() {};
    process.stderr.write = function() {};

    try {
        retval = callback(unmute);

        if (callback.length === 0) {
            unmute();
        }

        return retval;
    } catch (e) {
        unmute();
        throw e;
    }
};
