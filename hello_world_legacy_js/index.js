module.exports = hello_world_legacy_js

const PLUGIN_NAME = hello_world_legacy_js.name

function hello_world_legacy_js(kibana) {
  return new kibana.Plugin({
    id: PLUGIN_NAME,
    require: ['kibana', 'alerting'],
    init,
  });
}

function init() {
  console.log(`${PLUGIN_NAME} plugin initializing!`)
}