import { ExpressionsService } from '../../../../src/plugins/expressions'
import { Plugin } from '../index'
import { getFunctionDefinition as get_slog } from './slog'

export interface FunctionParams {
  plugin: Plugin
  expService: ExpressionsService
}

export function registerFunctions(params: FunctionParams): void {
  const { plugin, expService } = params

  expService.registerFunction(get_slog(params));
}
