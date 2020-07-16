# expression_playground plugin

This plugin provides some examples of playing with server-side expressions.

What are "expressions"?  Read through the docs on [Canvas expressions][] for
more info.

Note that server-side expressions aren't really supported at the time of this
writing (2020-07-14), but there's a quick hack to get the core bits to load
correctly, in [`server/index.ts`](server/index.ts):

    import "abort-controller/polyfill"

This provides a polyfill for the Web version of AbortController + friends that
are referenced in the code right now.  Clearly not something you'd want to add
to production code, but fine for a personal plugin :-)

# trying it out

There's a [`test.sh`](test.sh) bash script you can run some tests, hopefully
it's also readable and self-descriptive.

[Canvas expressions]: https://www.elastic.co/guide/en/kibana/master/canvas-expression-lifecycle.html