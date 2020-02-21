import {
  IRouter,
  RequestHandlerContext,
  KibanaRequest,
  IKibanaResponse,
  KibanaResponseFactory,
} from '../../../../../kibana/src/core/server';

import { Service } from '../index';
import {
  TimeSeriesParams,
  TimeSeriesParamsSchema,
  TimeSeriesResult
} from '../../../../../kibana/x-pack/plugins/alerting_builtins/server/alert_types/index_threshold/lib/time_series_types';

export function createGraphSpecRoute(service: Service, router: IRouter, baseRoute: string) {
  router.get(
    {
      path: `${baseRoute}/api`,
      validate: {
        query: TimeSeriesParamsSchema,
      },
    },
    handler
  );

  async function handler(
    ctx: RequestHandlerContext,
    req: KibanaRequest<any, TimeSeriesParams, any, any>,
    res: KibanaResponseFactory
  ): Promise<IKibanaResponse<any>> {
    if (!service.alertingBuiltins) {
      service.logger.warn('the alertingBuiltins plugin is not available')
      return
    }

    const messagePrefix = 'alertingBuiltins.indexThreshold.timeSeriesQuery'
    service.logger.debug(`${messagePrefix} request: ${JSON.stringify(req.query)}`);
    const timeStart = Date.now()
    const queryData = await service.alertingBuiltins.indexThreshold.timeSeriesQuery({
      logger: service.logger,
      callCluster: ctx.core.elasticsearch.dataClient.callAsCurrentUser,
      queryParams: req.query,
    });
    service.logger.debug(`${messagePrefix} response: ${JSON.stringify(queryData)}`);
    const timeElapsed = Date.now() - timeStart
    service.logger.debug(`${messagePrefix} elapsed millis: ${timeElapsed}`);

    const vlData = [];
    for (const group of Object.keys(queryData)) {
      for (const entry of queryData[group]) {
        vlData.push({ group, date: entry[0], value: entry[1] });
      }
    }

    const yAxisTitle = `${req.query.aggType}(${req.query.aggField})`;
    const vlSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
      description: 'graph description',
      width: 500,
      height: 250,
      data: { values: vlData },
      mark: {
        type: 'line',
        "point": true,
        // interpolate: 'monotone'
      },
      encoding: {
        x: { field: 'date', type: 'temporal' },
        y: { field: 'value', type: 'quantitative', title: yAxisTitle },
        color: { field: 'group', type: 'nominal' },
      },
    };
    
    return res.ok({
      headers: {
        'content-type': 'application/json',
      },
      body: vlSpec,
    });
  }
}
