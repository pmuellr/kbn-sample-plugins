//@ts-ignore
import { createModule  } from 'https://pmuellr.github.io/blort/blort-cdn.js'

const module = createModule()

module.addMutable('timerFired', new Date())

module.addVariable(function *timer(timerFiredMutable, Promises) {
  while (true) {
    timerFiredMutable.value = new Date()
    yield Promises.delay(3000, timerFiredMutable.value)
  }  
})

module.addVariable(async function updateGraph(vlSpec) {
  //@ts-ignore
  vegaEmbed('#vis', vlSpec)
  return `last ran at ${new Date()}`
})

module.addVariable(async function vlSpec(queryStringParams, timerFired) {
  const response = await fetch(`api?${queryStringParams}`)
  return await response.json()
})

module.addVariable(function queryStringParams(queryParams) {
  const terms = []
  for (const key of Object.keys(queryParams)) {
    terms.push(`${key}=${queryParams[key]}`)
  }
  return terms.join('&')
})

module.addVariable(function queryParams(indexName, timeField, aggType, aggField, groupField, intervalSeconds, windowSeconds, intervalsBefore, intervalsAfter) {
  return {
    index: indexName,
    timeField,
    aggType,
    aggField,
    groupField,
    interval: `${intervalSeconds}s`,
    window: `${windowSeconds}s`,
    intervalsBefore,
    intervalsAfter
  }
})

module.addViewOf(function indexName(html) {
  return html`<input value="apm-sys-sim" />`
})

module.addViewOf(function timeField(html) {
  return html`<input value="@timestamp" />`
})

module.addViewOf(function aggType(html) {
  return html`<select>
    <option>average
    <option>min
    <option>max
    <option>sum
    <option>count
  </select>`
})

module.addViewOf(function aggField(html) {
  return html`<input value="system.cpu.total.norm.pct" />`
})

module.addViewOf(function groupField(html) {
  return html`<input value="host.name.keyword" />`
})

module.addViewOf(function intervalSeconds(html) {
  return html`<input type=range min=1 max=60 step=1 value=1>`
})

module.addViewOf(function windowSeconds(html) {
  return html`<input type=range min=1 max=1000 step=1 value=5>`
})

module.addViewOf(function intervalsAfter(html) {
  return html`<input type=range min=0 max=1000 step=1 value=0>`
})

module.addViewOf(function intervalsBefore(html) {
  return html`<input type=range min=1 max=1000 step=1 value=10>`
})
