import { ExpressionFunctionDefinition } from '../../../../../kibana/src/plugins/expressions';
import { FunctionParams } from './index'

type ExpressionDef = ExpressionFunctionDefinition<'slog', unknown, {}, unknown>

const def: Omit<ExpressionDef, 'fn'> = {
  name: 'slog',
  args: {},
  help: 'Logs the input to the kibana logger',
};

export function getFunctionDefinition(params: FunctionParams): ExpressionDef {
  return { ...def, fn }

  function fn(input: unknown) {
    params.plugin.logger.info(`slog: ${input}`)
    return input
  }
}

