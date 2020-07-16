import { ExpressionsService, AnyExpressionFunctionDefinition } from '../../../../../kibana/src/plugins/expressions'
import { functions as canvasCommonFunctions } from './canvas-common-functions'
// import { functions as canvasCommonFunctions } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/common'
import { functions as canvasServerFunctions } from '../../../../../kibana/x-pack/plugins/canvas/canvas_plugin_src/functions/server'

import { Plugin } from '../index'
import { getFunctionDefinition as get_slog } from './slog'
import { getFunctionDefinition as get_input } from './input'

export interface FunctionParams {
  plugin: Plugin
  expService: ExpressionsService
}

export function registerFunctions(params: FunctionParams): void {
  const { plugin, expService } = params

  registerFunctionArray(expService, [
    get_slog(params),
    get_input(params),
  ])

  registerFunctionArray(expService, canvasCommonFunctions.map(fn => fn()))
  registerFunctionArray(expService, canvasServerFunctions.map(fn => fn()))
}

function registerFunctionArray(expService: ExpressionsService, fns: AnyExpressionFunctionDefinition[]): void {
  for (const fn of fns) {
    expService.registerFunction(fn);
  }
}