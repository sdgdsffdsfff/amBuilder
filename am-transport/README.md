## What is clean-css?

am-transport is a fast and efficient [Node.js](http://nodejs.org/) library for transport am project codes to all kinds of module files.


## Usage

### What are the requirements?

```
Node.js 0.8.0+ (tested on CentOS, Ubuntu, OS X 10.6+, and Windows 7+)
```

### How to install am-transport?

```
npm install am-transport
```

### How to use clean-css CLI?

am-transport accepts the following command line arguments (please make sure
you use `<source-file>` as the very last argument to avoid potential issues):

```

  Usage: amtrans [options] source-file

  Options:

    -h, --help                  output usage information
    -v, --version               output the version number
    -d, --debug                 open debug mode
    -f, --family [family-name]  family name AJ AW AB, AMUI,which one? AJ default
    -o, --output [output-file]  Use [output-file] as output instead of STDOUT
    -u, --uglify                use uglifyjs minify js
    -w, --loader                module loader windows default

```

#### Examples:

To transport a **mod.js** file into **aj-mod.js** do:

```
amtrans -o aj-mod.js  mod.js
```

To trn the same **public.css** into the standard output skip the `-o` parameter:

```
cleancss public.css
```

More likely you would like to concatenate a couple of files.
If you are on a Unix-like system:

```bash
cat one.css two.css three.css | cleancss -o merged-and-minified.css
```

On Windows:

```bat
type one.css two.css three.css | cleancss -o merged-and-minified.css
```

Or even gzip the result at once:

```bash
cat one.css two.css three.css | cleancss | gzip -9 -c > merged-minified-and-gzipped.css.gz
```

### How to use clean-css programmatically?

```js
var CleanCSS = require('clean-css');
var source = 'a{font-weight:bold;}';
var minimized = new CleanCSS().minify(source);
```

CleanCSS constructor accepts a hash as a parameter, i.e.,
`new CleanCSS(options).minify(source)` with the following options available:

* `keepSpecialComments` - `*` for keeping all (default), `1` for keeping first one only, `0` for removing all
* `keepBreaks` - whether to keep line breaks (default is false)
* `benchmark` - turns on benchmarking mode measuring time spent on cleaning up
  (run `npm run bench` to see example)
* `root` - path to resolve absolute `@import` rules and rebase relative URLs
* `relativeTo` - path with which to resolve relative `@import` rules and URLs
* `processImport` - whether to process `@import` rules
* `noRebase` - whether to skip URLs rebasing
* `noAdvanced` - set to true to disable advanced optimizations - selector & property merging, reduction, etc.
* `compatibility` - Force compatibility mode to `ie7` or `ie8`. Defaults to not set.
* `debug` - set to true to get minification statistics under `stats` property (see `test/custom-test.js` for examples)

### How to use clean-css with build tools?

* [Broccoli](https://github.com/broccolijs/broccoli#broccoli) : [broccoli-clean-css](https://github.com/shinnn/broccoli-clean-css)
* [Brunch](http://brunch.io/) : [clean-css-brunch](https://github.com/brunch/clean-css-brunch)
* [Grunt](http://gruntjs.com) : [grunt-contrib-cssmin](https://github.com/gruntjs/grunt-contrib-cssmin)
* [Gulp](http://gulpjs.com/) : [gulp-minify-css](https://github.com/jonathanepollack/gulp-minify-css)

### What are the clean-css' dev commands?

First clone the source, then run:

* `npm run bench` for clean-css benchmarks (see [test/bench.js](https://github.com/GoalSmashers/clean-css/blob/master/test/bench.js) for details)
* `npm run check` to check JS sources with [JSHint](https://github.com/jshint/jshint/)
* `npm test` for the test suite

## How to contribute to clean-css?

1. Fork it.
2. Add test(s) veryfying the problem.
3. Fix the problem.
4. Make sure all tests still pass (`npm test`).
5. Make sure your code doesn't break style rules (`npm run check`) and follow all [other ones](https://github.com/GoalSmashers/clean-css/wiki/Style-Guide) too.
6. Send a PR.

If you wonder where to add tests, go for:

* `test/unit-test.js` if it's a simple scenario
* `test/data/...` if it's a complex scenario (just add two files, input and expected output)
* `test/binary-test.js` if it's related to `bin/cleancss` binary
* `test/module-test.js` if it's related to importing `clean-css` as a module
* `test/protocol-imports-test.js` if it fixes anything related to protocol `@import`s

## Tips & Tricks

### How to preserve a comment block?

Use the `/*!` notation instead of the standard one `/*`:

```css
/*!
  Important comments included in minified output.
*/
```

### How to rebase relative image URLs

Clean-css will handle it automatically for you (since version 1.1) in the following cases:

* When using the CLI:
  1. Use an output path via `-o`/`--output` to rebase URLs as relative to the output file.
  2. Use a root path via `-r`/`--root` to rebase URLs as absolute from the given root path.
  3. If you specify both then `-r`/`--root` takes precendence.
* When using clean-css as a library:
  1. Use a combination of `relativeTo` and `target` options for relative rebase (same as 1 in CLI).
  2. Use a combination of `relativeTo` and `root` options for absolute rebase (same as 2 in CLI).
  3. `root` takes precendence over `target` as in CLI.

## Acknowledgments (sorted alphabetically)

* Anthony Barre ([@abarre](https://github.com/abarre)) for improvements to
  `@import` processing, namely introducing the `--skip-import` /
  `processImport` options.
* Simon Altschuler ([@altschuler](https://github.com/altschuler)) for fixing
  `@import` processing inside comments.
* Isaac ([@facelessuser](https://github.com/facelessuser)) for pointing out
  a flaw in clean-css' stateless mode.
* Jan Michael Alonzo ([@jmalonzo](https://github.com/jmalonzo)) for a patch
  removing node.js' old `sys` package.
* Timur Kristóf ([@Venemo](https://github.com/Venemo)) for an outstanding
  contribution of advanced property optimizer for 2.2 release.
* Vincent Voyer ([@vvo](https://github.com/vvo)) for a patch with better
  empty element regex and for inspiring us to do many performance improvements
  in 0.4 release.
* [@XhmikosR](https://github.com/XhmikosR) for suggesting new features
  (option to remove special comments and strip out URLs quotation) and
  pointing out numerous improvements (JSHint, media queries).

## License

Clean-css is released under the [MIT License](https://github.com/GoalSmashers/clean-css/blob/master/LICENSE).