Displays a graph using vega-lite using data from the alerting index threshold api

After generating some data with

```
es-apm-sys-sim 1 apm-sys-sim host-a https://elastic:changeme@localhost:9200
```

visit the following URL to see the graph of it

https://localhost:5601/_dev/index_threshold_graph/_query_data?index=apm-sys-sim&timeField=@timestamp&aggType=avg&interval=1s&window=5s&aggField=system.cpu.total.norm.pct&groupField=host.name.keyword

