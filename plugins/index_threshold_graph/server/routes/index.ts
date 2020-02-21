import { IRouter } from '../../../../../kibana/src/core/server';
import { Service } from '../index';
import { createGraphSpecRoute } from './graph_spec';
import { createWebRoutes } from './web';

export const BaseRoute = '/_dev/index_threshold_graph';

export function registerRoutes(service: Service, router: IRouter): void {
  createGraphSpecRoute(service, router, BaseRoute);
  createWebRoutes(service, router, BaseRoute);
}
