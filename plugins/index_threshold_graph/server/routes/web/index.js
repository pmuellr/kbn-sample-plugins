//@ts-ignore
const thisUrl = import.meta.url

// The $body export defines the HTML structure of the note.
// The references in the class properties of the elements are
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
    <tr><td>indexName:</td>                          <td class=indexNameView></td></tr>
    <tr><td>timeField:</td>                          <td class=timeFieldView></td></tr>
    <tr><td>aggType:</td>                            <td class=aggTypeView></td></tr>
    <tr><td>aggField:</td>                           <td class=aggFieldView></td></tr>
    <tr><td>termField:</td>                          <td class=termFieldView></td></tr>
    <tr><td><span class=intervalSeconds></span></td> <td class=intervalSecondsView></td></tr>
    <tr><td><span class=timeWindowSize></span></td>  <td class=timeWindowSizeView></td></tr>
    <tr><td><span class=intervals></span></td>       <td class=intervalsView></td></tr>
  </table>

  <div id="vis"></div>

  <hr>
  <p><i><a target=_blank href="${thisUrl}">view source</a></i></p>
  <p><i><a target=_blank href="https://github.com/pmuellr/shnort">built with shnort</a></i></p>
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

export function queryParams(timerFired, indexName, timeField, aggType, aggField, termField, intervalSeconds, timeWindowSize, intervals) {
  const dateRangeSeconds = intervals * intervalSeconds
  const dateEnd = new Date().toISOString();
  const dateStart = new Date(Date.now() - dateRangeSeconds * 1000).toISOString()
  return {
    index: indexName,
    timeField,
    aggType,
    aggField,
    groupBy: 'top',
    termField,
    termSize: 1000,
    interval: `${intervalSeconds}s`,
    timeWindowSize,
    timeWindowUnit: 's',
    dateStart,
    dateEnd,
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
    <option>avg
    <option>min
    <option>max
    <option>sum
    <option>count
  </select>`
}

export function aggFieldView(html) {
  return html`<input value="system.cpu.total.norm.pct" size=40>`
}

export function termFieldView(html) {
  return html`<input value="host.name.keyword"  size=40>`
}

export function intervalSecondsView(html) {
  return html`<input type=range min=1 max=60 step=1 value=1>`
}

export function timeWindowSizeView(html) {
  return html`<input type=range min=1 max=120 step=1 value=5>`
}

export function intervalsView(html) {
  return html`<input type=range min=0 max=198 step=2 value=40>`
}
