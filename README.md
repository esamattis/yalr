# YALR - Yet Another Live Reload

...because the other node.js based [LiveReload][] compatible servers just didn't
work.

Watches file modifications and reloads web pages automatically for you.


## Installation

    [sudo] npm install -g yalr

## Usage

    yarl [options]

The `yalr` command will start a [LiveReload Protocol v7][protocol] compatible
Web Socket server on a port 35729 and will start recursively watching all the
files for modifications in the current working directory and its
subdirectories. File/directory deletions and additions are considered as
modifications too.

It will will print out the script tag required by the browser to connect to the
YALR server or you can use the [LiveReload Chrome extension][extension]. Then
the browser page will be automatically reloaded every time when a change is
detected in the watch path.

The watch path and various other options can be passed to the `yalr` command via
command line switches (use `--help` to list them).

## YALRFile

Another method to configure YALR is via an `YALRFile` which is read from the current
working directory or from a path specified with `--configFile`.

The YALRFile is a node.js module exposing a single object:

```javascript
module.exports = {

  // Watch files only in the public directory
  path: "public",

  // Reload page only when css or js file changes
  match: [
    "*.css",
    "*.js"
  ]

};
```

You can use both methods simultaneously. Command line switches will override
the options defined in the YALRFile.

## node.js API

YALR can be really easily be embedded in node.js applications.

Simplest use case:

```javascript
require("yalr")();
```

This is effectly same as executing the `yalr` command without options.

It can have options too:

```javascript
require("yalr")({
  path: "public"
});
```

It will also read the YALRFile. Options in the YALRFile will take precedence
over the options given using the API. Which makes it perfect for developer
specific config. Just put it to .gitignore.

The yarl module function returns an object with the current options and a `tag`
attribute which contains a string of the script tag. This can be used to make
more tight integrations to various node.js web frameworks. The example
directory contains an [example][express-example] using the Express framework.

## Options

Possible options for the YARLFile, node.js API and the command line.

### port

Port listen to.

Default: 35729

### path

Path to watch.

From the command line this can be defined multiple times and and from the YARLFile
it can be also an array.

Default: The current working directory

### match

Match only certain files.

Glob string or JavaScript RegExp object. Glob will be matched only against the
the basename, but the regexp will be matched agaisnt the absolute file path.
Regexp format is not avaible from the command line.

From the command line this can be defined multiple times and and from the YARLFile
it can be also an array.

Default: (anything)

### ignore

Which files to ignore.

Like match, but for ignoring files.

Default: (nothing)

### debounce

Debounce time in milliseconds before actually sending the reload.

In some cases, such as static site generators, you might have multiple
change events coming in for long periods of time. This option makes YALR to
wait until the events stop arriving before sending the reload request.

Default: 0

### sleepAfter

Sleep milliseconds after a reload.

In some cases a reload can cause other files to be generated which can lead in
the worst case to an infinite reload loop. Setting this to `1000` will prevent
that effectively.

Default: 0

### verbose

Print more debugging stuff.

### quiet

Be totally silent.

### configFile

Custom path for the YARLFile.

Not avaible in the YALRfile :)

Default: (the current working directory)/YALRFile

### disable

Start YALR as disabled.

Useful for temporally disabling the embedded YALR server from the YALRFile.

### disableLiveCSS

Disable smart live CSS reloads.

## License

The MIT License

[protocol]: http://feedback.livereload.com/knowledgebase/articles/86174-livereload-protocol
[extension]: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
[LiveReload]: http://livereload.com/
[express-example]: https://github.com/epeli/yalr/tree/master/example/express-integration
