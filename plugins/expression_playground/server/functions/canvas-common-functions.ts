// not all of the common canvas functions can be loaded in the server ...

import { all } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/all'
import { alterColumn } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/alterColumn'
import { any } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/any'
import { asFn } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/as'
import { caseFn } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/case'
import { clear } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/clear'
import { columns } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/columns'
import { compare } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/compare'
import { containerStyle } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/containerStyle'
import { context } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/context'
import { csv } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/csv'
import { date } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/date'
import { doFn } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/do'
import { dropdownControl } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/dropdownControl'
import { eq } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/eq'
import { exactly } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/exactly'
import { filterrows } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/filterrows'
import { formatdate } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/formatdate'
import { formatnumber } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/formatnumber'
import { getCell } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/getCell'
import { gt } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/gt'
import { gte } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/gte'
import { head } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/head'
import { ifFn } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/if'
import { image } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/image'
import { joinRows } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/join_rows'
import { lt } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/lt'
import { lte } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/lte'
import { mapColumn } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/mapColumn'
import { mapCenter } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/map_center'
import { math } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/math'
import { metric } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/metric'
import { neq } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/neq'
import { palette } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/palette'
import { pie } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/pie'
import { ply } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/ply'
import { progress } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/progress'
import { render } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/render'
import { repeatImage } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/repeatImage'
import { replace } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/replace'
import { revealImage } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/revealImage'
import { rounddate } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/rounddate'
import { rowCount } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/rowCount'
import { savedLens } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/saved_lens'
import { savedMap } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/saved_map'
import { savedSearch } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/saved_search'
import { savedVisualization } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/saved_visualization'
import { seriesStyle } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/seriesStyle'
import { shape } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/shape'
import { sort } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/sort'
import { staticColumn } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/staticColumn'
import { string } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/string'
import { switchFn } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/switch'
import { table } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/table'
import { tail } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/tail'
import { timerange } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/time_range'
import { timefilter } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/timefilter'
import { timefilterControl } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common/timefilterControl'

export const functions = [
  all,
  alterColumn,
  any,
  asFn,
  caseFn,
  clear,
  columns,
  compare,
  // containerStyle,
  context,
  csv,
  date,
  doFn,
  // dropdownControl,
  eq,
  exactly,
  filterrows,
  formatdate,
  formatnumber,
  getCell,
  gt,
  gte,
  head,
  ifFn,
  // image,
  joinRows,
  lt,
  lte,
  mapColumn,
  // mapCenter,
  math,
  // metric,
  neq,
  // palette,
  // pie,
  ply,
  // progress,
  // render,
  // repeatImage,
  replace,
  // revealImage,
  rounddate,
  rowCount,
  // savedLens,
  // savedMap,
  // savedSearch,
  // savedVisualization,
  // seriesStyle,
  // shape,
  sort,
  staticColumn,
  string,
  switchFn,
  // table,
  tail,
  timerange,
  timefilter,
  // timefilterControl,
]
