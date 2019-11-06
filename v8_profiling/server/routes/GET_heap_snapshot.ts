import { IRouter } from '../../../../src/core/server';
import { Plugin } from '../index';
import { createSession, Session } from '../lib/session';
import { takeHeapSnapshot } from '../lib/heap_snapshot';

const routeConfig = {
  path: '/_dev/heap_snapshot',
  validate: {},
};

export function registerRoute(plugin: Plugin, router: IRouter): void {
  router.get(routeConfig, async (
    context,
    request,
    response,
  ) => {
    let session: Session;
    try {
      session = await createSession(plugin);
    } catch (err) {
      return response.badRequest({ body: `unable to create session: ${err.message}` });
    }

    plugin.logger.info(`starting heap snapshot`);
    let snapshot
    try {
      snapshot = await takeHeapSnapshot(session);
    } catch (err) {
      return response.badRequest({ body: `unable to take heap snapshot: ${err.message}` });
    }

    plugin.logger.info(`finished heap snapshot`);

    return response.ok({
      body: snapshot,
      headers: {
        'content-type': 'application/json'
      }
    });
  });
}
