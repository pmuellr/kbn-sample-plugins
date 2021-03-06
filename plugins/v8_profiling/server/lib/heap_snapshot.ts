'use strict'

import { Session } from './session';
import { createDeferred } from './deferred';


// Start a new profile, resolves to a function to stop the profile and resolve
// the profile data.
export async function takeHeapSnapshot (session: Session): Promise<any> {
  session.plugin.logger.debug('starting heap snapshot');

  const deferred = createDeferred();
  const result: string[] = [];

  await session.post('Profiler.enable');
  await session.post('HeapProfiler.enable');

  session.on('HeapProfiler.reportHeapSnapshotProgress', ({ params }: { params: any} ) => {
    session.plugin.logger.debug(`HeapProfiler.reportHeapSnapshotProgress(${JSON.stringify(params)})`);
    if (params.finished == true) deferred.resolve();
  })

  session.on('HeapProfiler.addHeapSnapshotChunk', ({ params }: { params: any} ) => {
    session.plugin.logger.debug(`HeapProfiler.addHeapSnapshotChunk(${params.chunk.length})`);
    result.push(params.chunk);
  });

  await session.post('HeapProfiler.collectGarbage');
  await session.post('HeapProfiler.takeHeapSnapshot', { reportProgress: true });

  await deferred.promise;
  return result.join('');
}
