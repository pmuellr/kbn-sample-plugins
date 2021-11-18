import { AlertType } from '../../../../../kibana/x-pack/plugins/alerts/server';

import { sqlResultToObjects } from './lib/sql'

const actionGroups = ['up', 'down', 'flapping', 'noData'].map(actionGroup => {
  return { id: actionGroup, name: actionGroup }
});

export const alertType: AlertType = {
  id: 'example.heartbeat',
  name: 'Example alert for heartbeat/uptime monitoring',
  actionGroups,
  executor,
  defaultActionGroupId: 'default',
  producer: 'builtInAlerts'
}

interface ActionContext {
  startedAt: string,
  alertId: string,
  spaceId: string,
  namespace: string,
  name: string,
  tags: string[],
  createdBy: string,
  updatedBy: string,
  monitor: string,
}

interface MonitorRecord {
  timestamp: Date
  status: string
}

interface MonitorState {
  timestamp?: Date
  status: string
}

type MonitorStates = Record<string, MonitorState>

interface State {
  monitors: MonitorStates
}

function getStateFromRaw(object: any): State {
  if (object == null || object.monitors == null) {
    return { monitors: {} }
  }

  return { monitors: object.monitors as MonitorStates }
}

// whitelist index name to commonly used chars
const INDEX_NAME_PATTERN = /^[\w.,*-]+$/
function validateIndex(index: any): string | null {
  if (typeof index !== 'string') return null
  if (!index.match(INDEX_NAME_PATTERN)) return null

  return index
}

const DEFAULT_WINDOW_MINUTES = 10

function validateWindow(window: any): number {
  if (typeof window !== 'number') return DEFAULT_WINDOW_MINUTES
  if (window <= 0) return DEFAULT_WINDOW_MINUTES

  return window
}

async function executor(executeParams): Promise<State> {
  const { services, params, state: rawState } = executeParams;
  const state = getStateFromRaw(rawState)
  log(`state: ${JSON.stringify(state)}`)

  const index = validateIndex(params.index)
  if (index == null) {
    log(`invalid index name: "${params.index}`)
    return
  }

  const window = validateWindow(params.window)
  const windowSeconds = Math.round(window * 60)

  const sqlQuery = `
    SELECT
      monitor.name, monitor.status, agent.type, event.dataset, "@timestamp"
    FROM "${index}"
    WHERE
      agent.type='heartbeat'
        AND
      event.dataset='uptime'
        AND
      "@timestamp" > NOW() - INTERVAL ${windowSeconds} SECONDS
    ORDER BY "@timestamp" DESC
  `
  log(`running sql /${sqlQuery}/`)

  let result
  try {
    result = await services.callCluster('transport.request', {
      path: '/_sql?format=json',
      method: 'POST',
      body: {
        query: sqlQuery,
        fetch_size: 1000,
        client_id: 'alertType:example.heartbeat',
      },
    })
  } catch (err) {
    throw new Error(`error running essql for alert: ${err.message}`)
  }

  // convert the sql output to objects
  const objects = sqlResultToObjects(result)

  // get the names of the monitors found
  const monitorNames = new Set<string>(objects.map(o => o.monitor_name))
  log(`monitorNames: ${Array.from(monitorNames).join(', ')}`)

  // find the missing monitors from old state
  const missingMonitors = new Set(Object.keys(state.monitors))
  log(`missingMonitors-1: ${Array.from(missingMonitors).join(', ')}`)

  const actionContext = {
    startedAt: executeParams.startedAt.toISOString(),
    alertId: executeParams.alertId,
    spaceId: executeParams.spaceId,
    namespace: executeParams.namespace,
    name: executeParams.name,
    tags: executeParams.tags,
    createdBy: executeParams.createdBy,
    updatedBy: executeParams.updatedBy,
  }

  for (const monitorName of monitorNames) {
    missingMonitors.delete(monitorName)
    const records = getMonitorRecords(objects, monitorName)
    if (state.monitors[monitorName] == null) {
      state.monitors[monitorName] = { status: 'noData' }
    }

    processMonitorRecords(
      services,
      monitorName,
      records,
      state.monitors[monitorName],
      { ...actionContext, monitor: monitorName },
      )
  }

  log(`missingMonitors-2: ${Array.from(missingMonitors).join(', ')}`)
  // process missing monitors
  for (const monitorName of missingMonitors ) {
    delete state.monitors[monitorName]

    services.alertInstanceFactory(monitorName).scheduleActions('noData', {
      ...actionContext,
      monitor: monitorName
    })
  }

  return state
}

// process monitor records for a specific monitor
function processMonitorRecords(
  services: any,
  name: string,
  records: MonitorRecord[],
  monitorState: MonitorState,
  context: ActionContext,
) {
  log(`monitorState: ${JSON.stringify(monitorState)}`)
  const lastTimeStamp = monitorState.timestamp
  monitorState.timestamp = new Date()

  // this shouldn't happen, but just in case
  if (records.length === 0) {
    monitorState.status = 'noData'

    services.alertInstanceFactory(name).scheduleActions('noData', context)
    return
  }

  // count up's and down's
  let ups = 0, downs = 0
  for (const record of records) {
    if (record.status === 'up') ups++
    if (record.status === 'down') downs++
  }

  if (downs === 0 && ups > 0) {
    if (monitorState.status !== 'up') {
      monitorState.status = 'up'
      services.alertInstanceFactory(name).scheduleActions('up', context)
    }
    return
  }

  if (ups === 0 && downs > 0) {
    monitorState.status = 'down'
    services.alertInstanceFactory(name).scheduleActions('down', context)
    return
  }

  monitorState.status = 'flapping'
  services.alertInstanceFactory(name).scheduleActions('flapping', context)
}

// get monitor records for a specific monitor
function getMonitorRecords(objects: any[], name: string): MonitorRecord[] {
  return objects
    .filter(o => o.monitor_name === name)
    .map(o => {
      const status: string = o.monitor_status
      const timestamp = new Date(o.$timestamp)
      return { timestamp, status }
    })
}

function log(message) {
  // console.log('kbn-sample-plugins:heartbeat', message)
}