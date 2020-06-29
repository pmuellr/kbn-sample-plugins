import { IRouter } from '../../../../../kibana/src/core/server';
import { ExpressionsService } from '../../../../src/plugins/expressions';
import { Plugin } from '../index';

import { registerRoute as POST_run } from './POST_run';
import { registerRoute as GET_functions } from './GET_functions';

export interface RouteParams {
  plugin: Plugin;
  router: IRouter;
  expService: ExpressionsService;
}

export function registerRoutes(params: RouteParams): void {
  POST_run(params);
  GET_functions(params);
}
