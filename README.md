# sample plugins for Kibana

The easiest way to use this is to symlink them into your `kibana/plugins`
directory, like so, assuming:

- you're currently in the `kibana/plugins` directory
- this repo's directory is a peer of the `kibana` directory

```
ln -s ../../kbn-sample-plugins/hello_world_legacy .
ln -s ../../kbn-sample-plugins/hello_world_np .
```