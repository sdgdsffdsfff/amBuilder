## What is am-transport?

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

### How to use am-transport programmatically?

```js
var AMTransport = require('am-transport');
var source = 'alert("hellworld");module.exports=helloworld';
var transportjs = new AMTransport().transport(source);
```

AMTransport constructor accepts a hash as a parameter, i.e.,
`new AMTransport(options).transport(source)` with the following options available:

* `loader` - module loader (default : windows) options:amd,cmd,code etc
* `uglify` - whether to use uglifyjs minify js(default : false)
* `family` - am project namespace