import { alertType as alwaysFiringAlertType } from './alert_types/always_firing'

const PLUGIN_NAME = alert_type_examples.name

export default function alert_type_examples(kibana) {
  return new kibana.Plugin({
    id: PLUGIN_NAME,
    require: ['kibana', 'alerting'],
    init,
  })
}

export let serverLog: any = console

function init(server: any) {
  serverLog = new ServerLog(server)
  registerAlertType(server, alwaysFiringAlertType)
}

function registerAlertType(server, alertType) {
  server.plugins.alerting.setup.registerType(alertType)
  serverLog.info(`registered alert type: ${alertType.id}`)
}

class ServerLog {
  private server: any

  constructor(server: any) {
    this.server = server
  }

  debug(message: string) {
    this.server.log(['debug', PLUGIN_NAME], message)
  }

  info(message: string) {
    this.server.log(['info', PLUGIN_NAME], message)
  }

  warn(message: string) {
    this.server.log(['warn', PLUGIN_NAME], message)
  }

  error(message: string) {
    this.server.log(['error', PLUGIN_NAME], message)
  }
}