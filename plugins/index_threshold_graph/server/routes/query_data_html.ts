import {
  IRouter,
  RequestHandlerContext,
  KibanaRequest,
  IKibanaResponse,
  KibanaResponseFactory,
} from '../../../../../kibana/src/core/server';

import { InternalService } from '../index';
import { Body, BodySchema } from '../../../../../kibana/x-pack/plugins/alerting_index_threshold/server/types';

export function createQueryDataHtmlRoute(internalService: InternalService, router: IRouter, baseRoute: string) {
  internalService.logger.info(`installing route handler for GET ${baseRoute}/_query_data`);
  router.get(
    {
      path: `${baseRoute}/_query_data`,
      validate: {
        query: BodySchema,
      },
    },
    handler
  );
  async function handler(
    ctx: RequestHandlerContext,
    req: KibanaRequest<any, Body, any, any>,
    res: KibanaResponseFactory
  ): Promise<IKibanaResponse<any>> {
    internalService.logger.debug(`route query_data request: ${JSON.stringify(req.query, null, 4)}`);
    const queryData = await internalService.aitService.runQuery({
      logger: internalService.logger,
      callCluster: ctx.core.elasticsearch.dataClient.callAsCurrentUser,
      body: req.query,
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

    const result = `<!DOCTYPE html><html>
    <head>
        <meta charset="utf-8">
        <script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
        <script src="https://cdn.jsdelivr.net/npm/vega-lite@4"></script>
        <script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>
    </head>

    <body>
        <div id="vis"></div>

        <pre>
        TODO: this needs to be html escaped!
        ${JSON.stringify(vlSpec, null, 4)};
        </pre>
        <script>
        vegaEmbed('#vis', ${JSON.stringify(vlSpec, null, 4)});
        </script>
    </body>\n</html>`.trim();
    return res.ok({
      headers: {
        'content-type': 'text/html',
      },
      body: result,
    });
  }
}
