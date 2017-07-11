Pokato
======

[![npm version][npm-badge]][npm-url]

A poor man's lens library for TypeScript.


Overview
--------

This is a simple library with functional pseudo-lenses that you may know from
languages like Haskell.

Note that there are many great lens-like libraries for JavaScript. If you use
JavaScript - use them, not this one! They have much nicer API and are more
general. This library was designed specifically to work nice with the
TypeScript's type system.

The main issue with making Haskell-like functional lenses work in TypeScript is
that its type inference algorithm is not strong enough. And while we can have
working lens implementation, we would have to provide generic type annotations
virtually everywhere which completely destroys the purpose of lenses - making
our lives easier.

Therefore, we end up with this pseudo-lens library. The problem with these
pseudo-lenses is that they are not very composable. However, it works just fine
for my everyday use case - updating deeply nested values in a Redux store.


Usage
-----

Let us assume you have a JSON like this:

``` typescript
let json = { foo: { bar: { baz: 42 }, quux: "norf" } }
```

Just import the `focus` function from this library:

``` typescript
import { focus } from "pokato";
```

and then use it like this:

``` typescript
focus(json).at("foo").at("bar").at("baz").get()
// => 42

focus(json).at("foo").at("quux").get()
// => "norf"

focus(json).at("foo").at("bar").at("baz").modify((x: number) => x * 2)
// => { foo: { bar: { baz: 84 }, quux: "norf" } }

focus(json).at("foo").at("quux").set("thud")
// => { foo: { bar: { baz: 42 }, quux: "thud" } }
```

For more usage samples and methods refer to the specification files.

Note that everything is type safe. That is, you can not do something like this:

``` typescript
focus(json).at("bar").get()
// compilation error (missing property "bar")

focus(json).at("foo").at("baz").get()
// compilation error (missing property "baz")

focus(json).at("foo").at("bar").at("baz").set("plugh")
// compilation error (incompatible types `number` and `string`)
```

You can also update multiple fields of a given object with the `then` operator:

``` typescript
focus({ foo: 1, bar: { baz: 2, quux: 3 } })
    .then($ => $.at("foo").modify(x => x + 10))
    .then($ => $.at("bar").at("baz").set(5))
    .unfocus()
// => { foo: 11, bar: { baz: 5, quux: 3 } }
```


Building
--------

Simply use the `build` script (it should work both with `npm` and with `yarn`).
There is also a simple Mocha specification that you can check using `test`
script.

    yarn build
    yarn test
    yarn lint

[npm-url]: https://www.npmjs.com/package/pokato
[npm-badge]: https://badge.fury.io/js/pokato.svg
