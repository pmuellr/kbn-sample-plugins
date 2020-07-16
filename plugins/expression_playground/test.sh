#!/usr/bin/env bash

# sets the URL to Kibana, override with KBN_URLBASE env var
KBN_URLBASE=${KBN_URLBASE:-http://elastic:changeme@localhost:5601}

# tests to run - note that these don't return anything (currently), look in the
# kibana log for the output

main() {
  # print all the functions available
  # epg_functions

  # {"result":"hello, world"}
  epg_run '{
    "expression": "slog",
    "input": "hello, world"
  }'

  # {"result":"hello, world x 3"} + lines logged in console
  epg_runs '
    input "hello, world x 3"
    | slog
    | slog
    | slog
  '

  # logs "initial input", "initial input", "later input"
  epg_runs '
    input "initial input"
    | slog
    | var_set foo value="later input"
    | slog
    | var foo
    | slog
  '

  # a row from a dataset
  epg_runs 'demodata | head' | json

  # a query over a dataset
  epg_runs 'demodata
    | ply
        by="project"
        fn={math "count(username)" | as "num_users"}
        fn={math "mean(price)" | as "price"}
  ' | json

  # {"result":">1"}
  epg_runs '
    input 2
    | if condition={gt 1}
        then={slog ">1"}
        else={slog "<=1"}
  '

  # {"result":"<=1"}
  epg_runs '
    input 0
    | if condition={gt 1}
        then={slog ">1"}
        else={slog "<=1"}
  '
}

# run a pipeline with specified JSON input
epg_run() {
  curl --silent $KBN_URLBASE/_dev/epg/run \
    -k \
    -H "kbn-xsrf: foo" \
    -H "content-type: application/json" \
    -d "$1";
  echo;
}

# run a pipeline expression as a string with no input or context
epg_runs() {
  curl --silent $KBN_URLBASE/_dev/epg/runs \
    -k \
    -H "kbn-xsrf: foo" \
    -H "content-type: text/plain" \
    -d "$1";
  echo;
}

# print the functions available
epg_functions() {
  curl --silent $KBN_URLBASE/_dev/epg/functions -k;
  echo;
}

# run the main function
main
