import { Logger } from './logger'

import { alertType as alwaysFiringAlertType } from './alert_types/always_firing'
import { alertType as essqlAlertType } from './alert_types/essql'
import { alertType as fizzBuzzAlertType } from './alert_types/fizz_buzz'
import { alertType as heartBeatAlertType } from './alert_types/heartbeat'

const PLUGIN_NAME = alert_type_examples.name

export default function alert_type_examples(kibana) {
  return new kibana.Plugin({
    id: PLUGIN_NAME,
    require: ['kibana', 'alerting'],
    init,
  })
}

export let serverLog: Logger

function init(server: any) {
  serverLog = new Logger(server, PLUGIN_NAME)
  registerAlertType(server, alwaysFiringAlertType)
  registerAlertType(server, essqlAlertType)
  registerAlertType(server, fizzBuzzAlertType)
  registerAlertType(server, heartBeatAlertType)
}

function registerAlertType(server, alertType) {
  server.plugins.alerting.setup.registerType(alertType)
  serverLog.info(`registered alert type: ${alertType.id}`)
}
