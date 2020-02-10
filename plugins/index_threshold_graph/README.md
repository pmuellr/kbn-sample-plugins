# index_threshold_graph plugin

Displays a graph using vega-lite using data from the alerting index threshold api

First, start generating some data with
[`es-apm-sys-sim`](https://github.com/pmuellr/es-apm-sys-sim):

```
es-apm-sys-sim 1 apm-sys-sim https://elastic:changeme@localhost:9200
```

Then visit the following URL to see the graph of the data:

https://localhost:5601/_dev/index_threshold_graph/index.html

![example session](threshold.gif)