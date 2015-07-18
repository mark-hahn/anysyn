# AnySyn

## Atom editor: edit javascript source files with custom syntax

AnySyn is an Atom editor plugin that allows you to edit javascript source files with an alternate syntax.  For example the word `function` could appear as `->` when editing but when saved the valid javascript `function` keyword would be used.  

The syntax conversion is lossless and one can switch to the new syntax and back to javascript with only changed code differing in format.  This solves the problem of format changes messing up the git diffs.

The first alternate syntax supported is very similar to coffeescript. When combined with ES6 you get a "language" that is similar to coffeescript but is real javascript with simple syntax substitutions. This allows one to work on someone else's javascript file using the "coffeescript" syntax and the file owner would only see javascript.

AnySyn is so simple that it could almost be written with all regex replacements. However, significant-whitespace support such as used in Python and Javascript is more complex and requires using the AST.

In the beginning the syntax will be specified by writing code. It will convert JS to the AST, generate the source with the new syntax, and then when saving it will do the opposite.  Note that a new grammar will need to be written for Atom to match the new syntax.

### Motivation

I have used coffeescript exclusively for four or five years and loved it.  When I originally looked at changing from coffeescript to ES6 I thought I could never use it because it still uses the C syntax with all the noise.  Then it occured to me that something like AnySyn could fix that.  You write the code mentally as real javascript but with easier writing and reading.

### Coffeescript-like syntax Features

This is a wish-list for the first supported syntax. Some features may not be included and I assume more will be added.  Note that each feature is optional via settings. E.g, if you don't like using `<-` for `return` then you can turn off that feature.

- Significant whitespace, no more ugly pyramid of braces
- Parens usually not needed in `for`, `if`, or function call
- Skinny and fat arrows with almost the same semantics as coffeescript
- No need for empty parens before function arrows
- `@var` replaced with `this.var`
- `<-`   replaced with `return`
- `#var` replaced with `let var`
- `x@y`  replaced with `x.get(y)` (map access)

### What AnySyn doesn't do

AnySyn makes no changes to ES6 just to be more compatible with coffeescript. AnySyn is only to reduce ES6 noisiness. For example these are **not** supported.

```
str = `AnySyn doesn't change #{this} to ${that}`
# this non-comment doesn't become // this comment
```

### Atom integration out of the gate 

AnySyn will be supported by Atom the same as a first-class language.  When a javascript file is loaded it is automatically parsed to an AST and then the editor buffer receives the source with the new syntax. It will have highlighting customized for the new syntax. Flipping the buffer between AnySyn and JS will be supported with one quick command.

### Status

Just a specification at this point.  There is nothing more than this readme.

### Why switch from Coffeescript

Many coffeescript users like me are converting to ES6.  For a quick writeup comparing the two see [this](https://gist.github.com/danielgtaylor/0b60c2ed1f069f118562)

Here is my personal list of reasons for changing to ES6.

- **Improved debugging:** Even with source maps coffeescript is harder to debug.  
  - You can't hover over a variable like `@var` to see the value
  - You can't evaluate coffeescript in the console  
  - Stepping can be confusing because of line mismatch.  I sometimes have to step many times to get past one line of coffeescript.
- **Larger community:**  Coffeescript has divided the community.  I can finally publish code without people bitching they can't read it.
- **Advanced features:**  While some coffeescript features are lost, like all code being expressions, there are many, if not more, features gained from ES6, like iterators.

### Examples of the "CoffeeScript" syntax

These examples are mostly taken from [here](https://medium.com/sons-of-javascript/javascript-an-introduction-to-es6-1819d0d89a0f).

```javascript
//--- JS ---
let square = x => x * x;
let add = (a, b) => a + b;
let pi = () => 3.1415;

//--- AnySyn ---
#square = x => x * x   // `#` changed to let
#add = (a, b) => a + b // no semicolons
#pi = => 3.1415        // no empty parens
```

```javascript
//--- JS ---
var square = function(x) { return x * x; };
var pi = function() { return 3.1415; };

//--- AnySyn ---
var square = (x) -> <- x * x  // anonymous function() becomes () ->
var pi = -> <- 3.1415         // return becomes <-
```


```javascript
//--- JS ---
if (x == 0) {
  for (let i = 0; i < 10; i++) {
    y += 10;
  }
}

//--- AnySyn ---
if x == 0                      // parens optional
  for #i = 0; i < 10; i++  // whitespace significant
    y += 10
```

```javascript
//--- JS ---
function helloWorld (a = 'hello', b = 'world') {
try {
 console.log(a);
} catch(e) {
 console.log(
   b
 );
}

//--- AnySyn ---
-> helloWorld (a = 'hello', b = 'world')  // -> changed to function
  try
   console.log a  // call doesn't need parens
  catch(e)
   console.log(   // left paren needed for multi-line params
     b
```

```javascript
//--- JS ---
class Parrot extends Bird {
  constructor(name) {
    super(name);
    this.name = 'Polly';
  }
  get name() { 
    return this.name;
  }
}

//--- AnySyn ---
class Parrot extends Bird
  constructor name      // no parens needed
    super name
    @name = 'Polly'     // @ changed to this.
  get name
    <- @name
```

```javascript
//--- JS ---
function* range(start, end, step) {
  while (start < end) {
    yield start;
    start += step;
  }
}

//--- AnySyn ---
->* range (start, end, step)  // ->* means generator function
  while start < end
    yield start
    start += step
```

```javascript
//--- JS ---
map.set(key, value)
map.get(key)

//--- AnySyn ---
map@key = value  //  @  replaces get and set for maps
map@key
```

### Ideas for the future

I know it is a bit premature but here are ideas that have been tossed around ...

- Adding support for icons.  The lamda symbol could be used instead of `=>`.
- Some wild kind of editing directly on the AST instead of text.
- Adding a syntax specification language that programmatically creates new syntaxes and grammars.
- Supporting other languages than javascript

### License
  AnySyn is copyright Mark Hahn via the MIT license.
