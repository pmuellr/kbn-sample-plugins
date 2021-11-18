# sample plugins for Kibana

**Warning: these are all in various states of disrepair.  But
usually easy to get working again in Kibana with tweaks.**

The easiest way to use these is to symlink them into your `kibana/plugins`
directory.  Run the `ln-plugins.sh` command to link the plugins locally into
a peer kibana clone directory.  Ie, this git repo clone should be in the same
directory as the kibana repo clone you want it installed in.

# `el_constipation` - detect event loop blockages

This plugin will log to the console when the event log has been blocked for
a configured threshold.  

One http entrypoint is provided to force the event loop to be blocked for a
specified amount of time.  The following curl invocation will block the
event loop for 5 seconds (5000 milliseconds).

    export KBN_URLBASE=https://elastic:changeme@localhost:5601
    curl -k -X POST -H "kbn-xsrf: X" $KBN_URLBASE/_dev/eat_cpu?millis=5000



# `v8_profiling` - V8 CPU Profiling and Heap Snapshots

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

You can also use those URLs in the browser.  When used, they will download
the relevant file to your "Downloads" directory with the relevant file
extension and a time-stamp based name.


# `index_threshold_graph` - display index threshold alert data

See the [`index_threshold_graph` README](plugins/index_threshold_graph/README.md)
for more info on this plugin.


# `alert_type_examples` - Alert Type Examples

This plugin adds the following alert types:

- `example.always-firing`
- `example.essql`
- `example.fizz-buzz`
- `example.heartbeat`

To play with the alerts in an existing kibana dev environment, you will need
to do the following:

- install [`kbn-actions`](https://github.com/pmuellr/kbn-action)

- install [`jq`](https://stedolan.github.io/jq/)

- for Kibana 7.5 or lower, add the following lines to `config kibana.dev.yml`

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
kbn-alert create example.always-firing "always firing example" 1s \
  '{}' \
  "[
    {group:default id:'${ACTION_ID}' params:{level: info, message:
      'alert example.always-firing, date: {{context.date}}; count: {{context.count}}'}
    }
  ]" 
```

## `example.essql`

An alert that runs an es sql query on an interval, and fires when hits are
found.

documentation TBD

#### example invocation

```
kbn-alert create example.essql "essql example" 30s \
  '{query: "SELECT host.id as instanceId, \"@timestamp\" as timeStamp, system.cpu.system.pct as cpu FROM \"metricbeat-*\" WHERE system.cpu.system.pct > 1.5 AND timeStamp > NOW() - INTERVAL 30 SECONDS"}' \
  "[
    {group: hits, id: '$ACTION_ID', params: {level: info, message:
      'host {{instanceId}} at cpu {{cpu}} at {{timeStamp}}'
    }}
  ]"
```

## `example.fizz-buzz`

An alert that fires groups `fizz`, `buzz`, and `fizz-buzz` on various
intervals.

#### example invocation

```
kbn-alert create example.fizz-buzz "fizz-buzz example" 1s \
  '{}' \
  "[ 
    {group: fizz,        id: '$ACTION_ID', params: {level: info, message: 'fizz {{context.count}}'}}
    {group: buzz,        id: '$ACTION_ID', params: {level: info, message: 'buzz {{context.count}}'}}
    {group: 'fizz-buzz', id: '$ACTION_ID', params: {level: info, message: 'fizz-buzz {{context.count}}'}}
   ]"
```

## `example.heartbeat`

An alert that works off of uptime heartbeat documents.

You can use [`es-hb-sim`](https://github.com/pmuellr/es-hb-sim) as a simulator to feed data to an elasticsearch index, in the shape this alert is expecting.

This alert takes two parameters:

- `index` - the name of the index to search for uptime heartbeat data
- `window` - the number of minutes worth of most recent data to access

There are four groups for this alert:

- `up` - the monitor has transitioned from a non-up state to up
- `down` - the monitor is down
- `flapping` - the monitor has reported being up and down
- `noData` - not enough data to make an analysis

The context passed to the action contains:

- `startedAt` - ISO string of date the alert execution started
- `alertId` - id of the alert
- `spaceId` - spaceId of the alert (string)
- `namespace` - namespace of the alert (string or undefined for 'default' spaceId)
- `name` - name of the alert
- `tags` - tags of the alert
- `createdBy` - userid that created the alert
- `updatedBy` - userid that last updated the alert
- `monitor` - the name of the monitor affected by this alert 

#### example invocation

(note window: 0.17 is 0.17 minutes == 10 seconds, useful to test with)

```
kbn-alert create example.heartbeat 'example heartbeat' 1s \
  '{index: "monitor-sample" window: 0.17}' \
  "[
    {group:up       id:'$ACTION_ID' params:{level:info, message: 'up: {{context.monitor}}'}}
    {group:down     id:'$ACTION_ID' params:{level:info, message: 'down: {{context.monitor}}'}}
    {group:flapping id:'$ACTION_ID' params:{level:info, message: 'flapping: {{context.monitor}}'}}
    {group:noData   id:'$ACTION_ID' params:{level:info, message: 'noData: {{context.monitor}}'}}
   ]"
```
