import { ExpressionFunctionDefinition } from '../../../../../kibana/src/plugins/expressions';
import { FunctionParams } from './index'

interface Arguments {
  value: string | number | boolean;
}

type ExpressionDef = ExpressionFunctionDefinition<'slog', unknown, Arguments, unknown>

const def: Omit<ExpressionDef, 'fn'> = {
  name: 'slog',
  help: 'Logs the input to the kibana logger',
  args: {
    value: {
      aliases: ['_'],
      types: ['string', 'number', 'boolean'],
      help: 'value to log'
    },
  },
};

export function getFunctionDefinition(params: FunctionParams): ExpressionDef {
  return { ...def, fn }

  function fn(input: unknown, args: any) {
    if (args.value != null) input = args.value
    
    const inputString = (typeof input !== 'object') ? `${input}` : JSON.stringify(input)

    params.plugin.logger.info(`slog: ${inputString}`)
    return input
  }
}

