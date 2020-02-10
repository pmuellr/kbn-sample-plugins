import {
  IRouter,
  RequestHandlerContext,
  KibanaRequest,
  IKibanaResponse,
  KibanaResponseFactory,
} from '../../../../../kibana/src/core/server';

import { InternalService } from '../index';
import { QueryDataParams, QueryDataParamsSchema } from '../../../../../kibana/x-pack/plugins/alerting_index_threshold/server/types';

export function createGraphSpecRoute(internalService: InternalService, router: IRouter, baseRoute: string) {
  router.get(
    {
      path: `${baseRoute}/api`,
      validate: {
        query: QueryDataParamsSchema,
      },
    },
    handler
  );

  async function handler(
    ctx: RequestHandlerContext,
    req: KibanaRequest<any, QueryDataParams, any, any>,
    res: KibanaResponseFactory
  ): Promise<IKibanaResponse<any>> {
    internalService.logger.debug(`route query_data request: ${JSON.stringify(req.query, null, 4)}`);
    const queryData = await internalService.aitService.runQuery({
      logger: internalService.logger,
      callCluster: ctx.core.elasticsearch.dataClient.callAsCurrentUser,
      queryParams: req.query,
    });
    internalService.logger.debug(`route query_data response: ${JSON.stringify(queryData, null, 4)}`);

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
      data: { values: vlData },
      mark: {
        type: 'line',
        interpolate: 'monotone'
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
