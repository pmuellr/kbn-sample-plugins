import { IRouter } from '../../../../../kibana/src/core/server';
import { InternalService } from '../index';
import { createQueryDataHtmlRoute } from './query_data_html';

export const BaseRoute = '/_dev/index_threshold_graph';

export function registerRoutes(internalService: InternalService, router: IRouter): void {
  createQueryDataHtmlRoute(internalService, router, BaseRoute);
}
