# CSYN

## Preprocessor to add coffeescript syntax features to standard javascript

CSYN is a preprocessor that allows standard javascript to be created using many syntax features stolen from coffeescript.  When combined with ES6 you get a "language" that is similar to coffeescript but is real javascript with simple syntax substitutions.

CSYN is so simple that it could almost be written with all regex replacements.  For example the keyword `->` is replaced with `function`.  A more complex example is the whitespace-significant indentation being replaced by braces.

CSYN features are optional which means plain JS is valid CSYN, but converting from JS to CSYN will use all available features.

### Motivation

I have used coffeescript exclusively for four or five years and loved it.  When I originally looked at changing from coffeescript to ES6 I thought I could never use it because it still uses the horrible C syntax with all the noise.  Then it occured to me that something like CSYN could fix that.  You write the code mentally as real javascript but without the noise.

### Features

This is a wish-list.  Some may not be included and I assume more will be added.

- Works with babel to support most browser versions
- Significant whitespace, no more ugly pyramid of braces
- Parens usually not needed in `for`, `if`, or function call
- Skinny and fat arrows with almost the same semantics as coffeescript
- No need for empty parens before function arrows
- `@var` replaced with `this.var`
- `<-`   replaced with `return`
- `#var` replaced with `let var`
- `x@y`  replaced with `x.get(y)` (map access)

### What CSYN doesn't do

CSYN makes no changes to ES6 just to be more compatible with coffeescript. CSYN is only to improve ES6 noisiness. For example these are **not** supported.

```
str = `CSYN doesn't change #{this} to ${that}`
# this non-comment doesn't become // this comment
```

### Atom integration out of the gate 

CSYN will be supported by Atom the same way coffeescript is.  This is because Atom now supports Babel as a first-class language.

Not only will a standard CSYN grammar support highlighting, but converting the buffer between CSYN and js will be supported with one command.

Also, there will be a mode where the file is always stored as javascript but edited as CSYN.  This eliminates the need to run the pre-processor at build time.  This will also allow editing other's javascript files in CSYN without them even knowing about CSYN.

### Status

Just a specification at this point.  There is nothing more than this readme.  However, this looks like a simple project to implement.  I doubt that an AST will be needed.  Most will be done with regexes.

CSYN will be written in JS ES6 so it will be effectively written in CSYN.

When stored as a CSYN file the file suffix will be `.csyn`.

### Why switch from Coffeescript

Many coffeescript users like me are converting to ES6.  For a quick writeup comparing the two see [this](https://gist.github.com/danielgtaylor/0b60c2ed1f069f118562)

Here is my personal list of reasons for changing to ES6.

- **Improved debugging:** Even with source maps coffeescript is harder to debug.  
  - You can't hover over a variable like `@var` to see the value
  - You can't evaluate coffeescript in the console  
  - Stepping can be confusing because of line mismatch.  I sometimes have to step many times to get past one line of coffeescript.
- **Larger community:**  Coffeescript has divided the community.  I can finally publish code without people bitching they can't read it.
- **Advanced features:**  While some coffeescript features are lost, like all code being expressions, there are many, if not more, features gained from ES6, like iterators.

### Examples

These examples are mostly taken from [here](https://medium.com/sons-of-javascript/javascript-an-introduction-to-es6-1819d0d89a0f).

```javascript
//--- JS ---
let square = x => x * x;
let add = (a, b) => a + b;
let pi = () => 3.1415;

//--- CSYN ---
#square = x => x * x   // # changed to let
#add = (a, b) => a + b // no semicolons
#pi = => 3.1415        // no empty parens
```

```javascript
//--- JS ---
var square = function(x) { return x * x; };
var pi = function() { return 3.1415; };

//--- CSYN ---
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

//--- CSYN ---
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

//--- CSYN ---
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

//--- CSYN ---
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

//--- CSYN ---
->* range (start, end, step)  // ->* means generator function
  while start < end
    yield start
    start += step
```

```javascript
//--- JS ---
map.set(key, value)
map.get(key)

//--- CSYN ---
map@key = value  //  @  replaces get and set for maps
map@key
```

### License
  CSYN is copyright Mark Hahn via the MIT license.
