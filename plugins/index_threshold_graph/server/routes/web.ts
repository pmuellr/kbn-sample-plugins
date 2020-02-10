import {
  IRouter,
  RequestHandlerContext,
  KibanaRequest,
  IKibanaResponse,
  KibanaResponseFactory,
} from '../../../../../kibana/src/core/server';

import { InternalService } from '../index';
import { QueryDataParams, QueryDataParamsSchema } from '../../../../../kibana/x-pack/plugins/alerting_index_threshold/server/types';

import * as fs from 'fs';
import * as path from 'path';

const jsFileName = 'index.js'
const htmlFileName = 'index.html'

// YOLO
const jsFile = fs.readFileSync(path.join(__dirname, 'web', jsFileName), 'utf8')
const htmlFile = fs.readFileSync(path.join(__dirname, 'web', htmlFileName), 'utf8')

export function createWebRoutes(internalService: InternalService, router: IRouter, baseRoute: string) {
  router.get({ path: `${baseRoute}/index.html`, validate: {} }, getHandler(htmlFile, 'text/html'));
  router.get({ path: `${baseRoute}/index.js`, validate: {} }, getHandler(jsFile, 'text/javascript'));
  router.get({ path: baseRoute, validate: {} }, async function handler(
    ctx: RequestHandlerContext,
    req: KibanaRequest,
    res: KibanaResponseFactory
  ): Promise<IKibanaResponse<any>> {
    return res.redirected({
      headers: { location: `${baseRoute}/index.html` },
    });
  });

  function getHandler(body: string, contentType: string) {
    return async function handler(
      ctx: RequestHandlerContext,
      req: KibanaRequest,
      res: KibanaResponseFactory
    ): Promise<IKibanaResponse<any>> {
      return res.ok({
        headers: { 'content-type': contentType },
        body,
      });
    };
  }
}
