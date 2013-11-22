# mute

> Politely tells stdout and stderr to shut the heck up for a moment by
> temporarily reassigning the stream's write methods. Useful when testing
> overly noisey things like Yeoman generators.

```javascript
it('should shut the heck up', function (done) {
    app.options.defaults = true;

    mute(function(unmute) {
        app.run(function() {
            unmute();

            helpers.assertFiles([
                ['package.json', /"name": "temp-directory"/],
                ['README.md',    /# TEMP.Directory/]
            ]);

            done();
        });
    });
});
```

## Installation

This should really only ever be used in test code.

```sh
$ npm install --save-dev mute
```

## License

MIT
