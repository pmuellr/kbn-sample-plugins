const PLUGIN_NAME = hello_world_legacy.name

export default function hello_world_legacy(kibana) {
  return new kibana.Plugin({
    id: PLUGIN_NAME,
    require: ['kibana', 'alerting'],
    init,
  });
}

function init() {
  console.log(`${PLUGIN_NAME} plugin initializing!`)
}