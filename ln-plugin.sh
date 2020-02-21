#!/bin/sh

PLUGIN=$1

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

LOC_PLUGIN_DIR=$SCRIPT_DIR/plugins
KBN_PLUGIN_DIR=$SCRIPT_DIR/../kibana/plugins

LOC_PLUGIN=$LOC_PLUGIN_DIR/$PLUGIN

if [ ! -d "$LOC_PLUGIN" ]; then
    echo "local kibana plugin '$PLUGIN' does not exist" 
    echo "plugins that do exist:"
    ls $LOC_PLUGIN_DIR
    exit 1
fi

if [ ! -d "$KBN_PLUGIN_DIR" ]; then
    echo "dev kibana plugin directory '$KBN_PLUGIN_DIR' does not exist" 
    exit 1
fi

CMD="ln -s -f $LOC_PLUGIN $KBN_PLUGIN_DIR"
echo $CMD
$CMD