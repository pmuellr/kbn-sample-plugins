# run this to define an `epg_run` command in bash

```bash
epg_run() { \
  curl $KBN_URLBASE/_dev/epg/run \
    -k \
    -H "kbn-xsrf: foo" \
    -H "content-type: application/json" \
    -d "$1"; \
}
```

# run this to define an `epg_functions` command in bash

```bash
epg_functions() { \
  curl $KBN_URLBASE/_dev/epg/functions -k; \
}
```

# run it
```bash
epg_run '{ "expression": "slog", "input": "hello, world" }'
epg_run '{ "expression": "slog | slog | slog", "input": "hello, world x 3" }'
epg_run '{ "expression": "slog | var_set foo value=\"Foo!\" | slog | var foo | slog", "input": "initial input" }'
```