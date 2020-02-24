<p>
  Use <a href="https://github.com/pmuellr/es-apm-sys-sim">es-apm-sys-sim</a>
  to feed data to this graph:
</p>

<pre>
    es-apm-sys-sim 1 4 apm-sys-sim https://elastic:changeme@localhost:9200
</pre>

<table>
  <tr><td>indexName:</td>  <td><input bind:value={indexName}/></td></tr>
  <tr><td>timeField:</td>  <td><input bind:value={timeField}/></td></tr>
  <tr><td>groupField:</td> <td><input bind:value={groupField}/></td></tr>
  <tr><td>aggField:</td>   <td><input bind:value={aggField}/></td></tr>
  <tr><td>aggType:</td> <td>
    <select bind:value={aggType}>
      <option value=average></option>
      <option value=min></option>
      <option value=max></option>
      <option value=sum></option>
      <option value=count></option>
    </select>
  </td></tr>
  <tr><td>interval: (seconds)</td> <td><label>
    <input type=number bind:value={intervalSeconds} min=1 max=60/>
    <input type=range  bind:value={intervalSeconds} min=1 max=60/>
  </label></td></tr>
  <tr><td>window: (seconds)</td> <td><label>
    <input type=number bind:value={windowSeconds} min=1 max=300/>
    <input type=range  bind:value={windowSeconds} min=1 max=300/>
  </label></td></tr>
  <tr><td>intervals:</td>  <td><label>
    <input type=number bind:value={intervals} min=1 max=1000 step=2/>
    <input type=range  bind:value={intervals} min=1 max=1000 step=2/>
  </label></td></tr>
</table>

<div id="vis"></div>

<hr>
<p><i><a target=_blank href="${thisUrl}">view source</a></i></p>
<p><i><a target=_blank href="https://github.com/pmuellr/shnort">built with shnort</a></i></p>

<script>
let indexName = 'apm-sys-sim'
let timeField = '@timestamp'
let aggType = 'average'
let aggField = 'system.cpu.total.norm.pct'
let groupField = 'host.name.keyword'
let intervalSeconds = 1
let windowSeconds = 5
let intervals = 50

$: {
  const queryParams = {
    index: indexName,
    timeField,
    aggType,
    aggField,
    groupField,
    interval: `${intervalSeconds}s`,
    window: `${windowSeconds}s`,
    dateStart: `now-${intervals * intervalSeconds}s`,
    dateEnd: `now`,
  }

  const terms = []
  for (const key of Object.keys(queryParams)) {
    terms.push(`${key}=${queryParams[key]}`)
  }

  const queryParamsString = terms.join('&')
  const response = await fetch(`api?${queryStringParams}`)
  vlSpec = await response.json()

  vegaEmbed('#vis', vlSpec)
}
</script>
