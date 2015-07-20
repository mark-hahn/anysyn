# AnySyn

AnySyn is an Atom editor package that allows you to edit javascript source files with custom syntax.  For example the word `function` could appear as `->` when editing but when saved the valid javascript `function` keyword would be used.  

AnySyn means "Any Syntax" and any javascript-compatible syntax could be developed and used by AnySyn.  The syntax would be implemented as a service provider package (Atom plugin) for AnySyn to call.

The syntax conversion is not lossless but every time the javascript is saved it will be processed by a [beautifier](https://github.com/beautify-web/js-beautify). This means a project will have to agree on beautifier preferences which every contributor follows.  This solves the problem of format changes messing up the git diffs. 
### One included syntax (free)

The first alternate syntax Atom package will be released shortly after AnySyn. This will have features stolen from CoffeeScript. When combined with ES6 you would have a "language" that is similar to CoffeeScript but is real javascript with simple syntax substitutions. This allows one to work on someone else's javascript file using the CoffeeScript syntax and the file owner would only see javascript.

### Motivation

I have used CoffeeScript exclusively for four or five years and loved it.  When I originally looked at changing from CoffeeScript to ES6 I thought I could never use it because it still uses the C syntax with all the noise.  Then it occured to me that something like AnySyn could fix that.  You write the code mentally as real javascript but with easier writing and reading.

### CoffeeScript package syntax features

This is a wish-list for the (almost) CoffeeScript syntax. Some features may not be included and I assume more will be added.  Note that each feature is optional via settings. E.g, if you don't like using `<-` for `return` then you can turn off that feature.

- Significant whitespace, no more ugly pyramid of braces
- Parens are usually not needed in `for`, `if`, or function calls
- Skinny and fat arrows with almost the same semantics as CoffeeScript
- No need for empty parens before function arrows
- `@var` replaced with `this.var`
- `<-`   replaced with `return`
- `#var` replaced with `let var`
- `x@y`  replaced with `x.get(y)` (map access)

### What AnySyn doesn't do

AnySyn makes no changes to ES6 just to be more compatible with CoffeeScript. AnySyn is only to reduce ES6 noisiness. For example these are **not** supported.

```
str = `AnySyn doesn't change #{this} to ${that}`
# this non-comment doesn't become // this comment
```

### Atom integration out of the gate 

AnySyn will be supported by Atom the same as a first-class language.  When a javascript file is loaded it is automatically parsed to an AST, the plugin will convert that to text, and then AnySyn creates the editor buffer with the new syntax. It will have highlighting customized for the new syntax. Flipping the buffer between the AnySyn syntax and JS will be supported with one quick command.

### Status

Just a specification at this point.  There is nothing more than this readme.

### Why switch from CoffeeScript

Many CoffeeScript users like me are converting to ES6.  For a quick writeup comparing the two see [this](https://gist.github.com/danielgtaylor/0b60c2ed1f069f118562)

Here is my personal list of reasons for changing to ES6.

- **Improved debugging:** Even with source maps CoffeeScript is harder to debug.  
  - You can't hover over a variable like `@var` to see the value
  - You can't evaluate CoffeeScript in the console  
  - Stepping can be confusing because of line mismatch.  I sometimes have to step many times to get past one line of CoffeeScript.
- **Larger community:**  CoffeeScript has divided the community.  I can finally publish code without people bitching they can't read it.
- **Advanced features:**  While some CoffeeScript features are lost, like all code being expressions, there are many, if not more, features gained from ES6, like iterators.

### Examples of the "CoffeeScript" syntax

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

### Implementation


The following details how AnySyn would work and the interface it would expect from a syntax plugin.

- AnySyn would be a normal Atom package that when enabled would enable an invisible conversion process.  Opening javascript would just appear with the new syntax as if it was stored that way.  

- A config setting could allow specific files, maybe a regex on the path, to be linked to specific syntax plugins.  That would also specify an Atom grammar. The highlighting would be implemented the standard Atom way without any interaction with AnySyn.

- The plugin would provide two simple calls.
  - One call would accept an AST and return the text with new syntax.  This would use some code generator, probably [escodegen](https://github.com/estools/escodegen).
  - The second call would do the opposite.  It would take the text and return an AST, probably using [esprima](https://github.com/jquery/esprima) or [acorn](https://github.com/marijnh/acorn).

- AnySyn would create a texteditor, read the file, convert the javascript to an AST, call the plugin to get the converted text, and place it in the buffer. 

- AnySyn would trap any save and do the reverse.  Before the actual save it would pass the javascript through the beautifer.

- AnySyn would also provide an Atom command to toggle the buffer between the standard javascript and the new syntax.  This would be especially useful in debugging.  It would do this using the same two plugin calls.

### Ideas for the future

I know it is a bit premature but here are ideas that have been tossed around ...

- Adding support for icons.  The lamda symbol could be used instead of `=>`.
- Some wild kind of editing directly on the AST instead of text.
- Adding a syntax specification language that programmatically creates new syntaxes and grammars.
- Supporting other languages than javascript

### License
  AnySyn is copyright Mark Hahn via the MIT license.
