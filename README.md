# sample plugins for Kibana

The easiest way to use this is to symlink them into your `kibana/plugins`
directory, like so, assuming:

- you're currently in the `kibana/plugins` directory
- this repo's directory is a peer of the `kibana` directory

```
ln -s ../../kbn-sample-plugins/hello_world_np_js .
ln -s ../../kbn-sample-plugins/hello_world_legacy .
ln -s ../../kbn-sample-plugins/hello_world_legacy_js .
ln -s ../../kbn-sample-plugins/alert_type_examples .
```

Note that sym-linking doesn't currently work if the plugin uses
`@kbn/config-schema`, and you'll need to copy the files instead, like so:

```
cp -R ../../kbn-sample-plugins/v8_profiling .
```

Note that when symlinking, as above, absolute and relative imports
including `..` may not work, but relative to the plugin directory 
or lower will.


# Alert Type Examples

This plugin adds the following alert types:

- `example.always-firing`
- `example.essql`
- `example.fizz-buzz`

To play with the alerts in an existing kibana dev environment, you will need
to do the following:

- install [`kbn-actions`](https://github.com/pmuellr/kbn-action)

- install [`jq`](https://stedolan.github.io/jq/)

- add the following lines to `config kibana.dev.yml`

  ```
  xpack.actions.enabled: true
  xpack.alerting.enabled: true
  ```

- in one terminal, start es via:

  ```
  yarn es snapshot --ssl
  ```

- in another terminal, start kibana via:

  ```
  yarn start --no-base-path --ssl
  ```

- open another terminal to run `kbn-action` and `kbn-alert` commands,
  running the following first to set the endpoint for those commands:
  
  ```
  export KBN_URLBASE=https://elastic:changeme@localhost:5601
  ```

You will probably want to create a server-log action that you can use with these
alerts; do that via:

```
export ACTION_ID=`kbn-action create .server-log 'server-log' '{}' '{}' | jq -r '.id'`
```

Note that stores the action id in the env var `ACTION_ID`, used in subsequent commands.

Test it via:

```
kbn-action execute $ACTION_ID '{level: info, message: hallo}'
```

You should see a line `hallo` logged to the Kibana server log.

After creating a bunch of alerts, you'll probably want to delete them, and
perhaps actions you've created.  Use the following commands to delete all
existing alerts and actions:

```
kbn-alert  ls | jq -r '.data | .[] | .id' | xargs -L 1 kbn-alert  delete
kbn-action ls | jq -r '.data | .[] | .id' | xargs -L 1 kbn-action delete
```

## `example.always-firing`

An alert that always fires on it's interval.

This alert always fires the `default` group, with the following properties
in it's context:

- `date` - date/time the alert fired, in ISO format
- `count` - number of times the alert function has run

#### example invocation

```
kbn-alert create example.always-firing 1s '{}' "[{group:default id:'${ACTION_ID}' params:{level: info, message: 'alert example.always-firing, date: {{context.date}}; count: {{context.count}}'}}]" 
```

## `example.essql`

An alert that runs an es sql query on an interval, and fires when hits are
found.

documentation TBD

#### example invocation

```
kbn-alert create example.essql 30s '{query: "SELECT host.id as instanceId, \"@timestamp\" as timeStamp, system.cpu.system.pct as cpu FROM \"metricbeat-*\" WHERE system.cpu.system.pct > 1.5 AND timeStamp > NOW() - INTERVAL 30 SECONDS"}' "[{group: hits, id: '$ACTION_ID', params: {level: info, message: 'host {{instanceId}} at cpu {{cpu}} at {{timeStamp}}'}}]"
```

## `example.fizz-buzz`

An alert that fires groups `fizz`, `buzz`, and `fizz-buzz` on various
intervals.

#### example invocation

```
kbn-alert create example.fizz-buzz 1s '{}' "[ {group: fizz, id: '$ACTION_ID', params: {level: info, message: 'fizz {{context.count}}'}}  {group: buzz, id: '$ACTION_ID', params: {level: info, message: 'buzz {{context.count}}'}} {group: 'fizz-buzz', id: '$ACTION_ID', params: {level: info, message: 'fizz-buzz {{context.count}}'}} ]"
```

# V8 Profiling

This plugin adds the following http entrypoints:

## `/_dev/cpu_profile?duration=<number>`

Captures a CPU profile for `duration` seconds.

`duration` defaults to 5.

## `/_dev/heap_snapshot`

Captures a heap snapshot.


#### example invocations

```
curl -k "https://elastic:changeme@localhost:5601/_dev/cpu_profile?duration=10" > my.cpuprofile

curl -k "https://elastic:changeme@localhost:5601/_dev/heap_snapshot" > my.heapsnapshot
```

Note the file extensions `.cpuprofile` and `.heapsnapshot` are required when
loading the files into the V8's Chrome Dev Tools via the URL 
[`chrome://inspect/`](chrome://inspect/).
