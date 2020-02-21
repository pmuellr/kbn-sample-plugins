//@ts-ignore
const thisUrl = import.meta.url

// The $body export defines the HTML structure of the note.
// The references in the class properties of the div's and span's are
// to variables, exported as functions below.
export const $body = `
  <p>
    Use <a href="https://github.com/pmuellr/es-apm-sys-sim">es-apm-sys-sim</a>
    to feed data to this graph:
  </p>
  <pre>
      es-apm-sys-sim 1 4 apm-sys-sim https://elastic:changeme@localhost:9200
  </pre>
  <table>
    <tr><td>indexName:</td>          <td class=indexNameView></td></tr>
    <tr><td>timeField:</td>          <td class=timeFieldView></td></tr>
    <tr><td>aggType:</td>            <td class=aggTypeView></td></tr>
    <tr><td>aggField:</td>           <td class=aggFieldView></td></tr>
    <tr><td>groupField:</td>         <td class=groupFieldView></td></tr>
    <tr><td>interval: (seconds)</td> <td class=intervalSecondsView></td> <td><span class=intervalSeconds></span></td></tr>
    <tr><td>window: (seconds)</td>   <td class=windowSecondsView></td>   <td><span class=windowSeconds></span></td></tr>
    <tr><td>intervals:</td>          <td class=intervalsView></td>       <td><span class=intervals></span></td></tr>
  </table>

  <div id="vis"></div>

  <hr>
  <p><i><a href="${thisUrl}">view current source</a></i></p>
  <p><i><a href="https://github.com/pmuellr/shnort">built with shnort</a></i></p>
  <p><span class=timer></span></p>
  <p><span class=updateGraph></span></p>
`

export const timerFiredMutableInit = new Date()

export function *timer(timerFiredMutable, Promises) {
  while (true) {
    timerFiredMutable.value = new Date()
    yield Promises.delay(3000, timerFiredMutable.value)
  }  
}

export async function updateGraph(vlSpec) {
  //@ts-ignore
  vegaEmbed('#vis', vlSpec)
  return `updateGraph last ran at ${new Date()}`
}

export async function vlSpec(queryStringParams, timerFired) {
  const response = await fetch(`api?${queryStringParams}`)
  return await response.json()
}

export function queryStringParams(queryParams) {
  const terms = []
  for (const key of Object.keys(queryParams)) {
    terms.push(`${key}=${queryParams[key]}`)
  }
  return terms.join('&')
}

export function queryParams(indexName, timeField, aggType, aggField, groupField, intervalSeconds, windowSeconds, intervals) {
  const dateRangeSeconds = intervals * intervalSeconds
  return {
    index: indexName,
    timeField,
    aggType,
    aggField,
    groupField,
    interval: `${intervalSeconds}s`,
    window: `${windowSeconds}s`,
    dateStart: `now-${dateRangeSeconds}s`,
    dateEnd: `now`,
  }
}

export function indexNameView(html) {
  return html`<input value="apm-sys-sim" size=40>`
}

export function timeFieldView(html) {
  return html`<input value="@timestamp" size=40>`
}

export function aggTypeView(html) {
  return html`<select>
    <option>average
    <option>min
    <option>max
    <option>sum
    <option>count
  </select>`
}

export function aggFieldView(html) {
  return html`<input value="system.cpu.total.norm.pct" size=40>`
}

export function groupFieldView(html) {
  return html`<input value="host.name.keyword"  size=40>`
}

export function intervalSecondsView(html) {
  return html`<input type=range min=1 max=60 step=1 value=1>`
}

export function windowSecondsView(html) {
  return html`<input type=range min=1 max=120 step=1 value=5>`
}

export function intervalsView(html) {
  return html`<input type=range min=0 max=200 step=1 value=1>`
}
