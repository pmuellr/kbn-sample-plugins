#!/bin/sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

$SCRIPT_DIR/ln-plugin.sh alert_type_examples
$SCRIPT_DIR/ln-plugin.sh index_threshold_graph
$SCRIPT_DIR/ln-plugin.sh v8_profiling
$SCRIPT_DIR/ln-plugin.sh el_constipation
$SCRIPT_DIR/ln-plugin.sh expression_playground
