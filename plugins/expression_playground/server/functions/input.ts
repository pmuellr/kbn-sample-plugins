import { ExpressionFunctionDefinition } from '../../../../../kibana/src/plugins/expressions';
import { FunctionParams } from './index'

interface Arguments {
  value: string | number | boolean;
}

type ExpressionDef = ExpressionFunctionDefinition<'input', unknown, Arguments, unknown>

const def: Omit<ExpressionDef, 'fn'> = {
  name: 'input',
  help: 'Output the argument as input to the next stage',
  args: {
    value: {
      aliases: ['_'],
      types: ['string', 'number', 'boolean'],
      help: 'value to output'
    },
  }
};

export function getFunctionDefinition(params: FunctionParams): ExpressionDef {
  return { ...def, fn }

  function fn(input: unknown, args: any) {
    const value = args.value
    const valueString = (typeof value !== 'object') ? `${value}` : JSON.stringify(value)

    params.plugin.logger.debug(`fn input: ${valueString}`)
    return value
  }
}
