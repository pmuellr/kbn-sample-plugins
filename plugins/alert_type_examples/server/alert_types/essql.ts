import { AlertType } from '../../../../../kibana/x-pack/plugins/alerts/server';

export const alertType: AlertType = {
  id: 'example.essql',
  name: 'Example alert that runs an essql, fires when results are non-empty',
  actionGroups: [{ id: 'hits', name: 'hits' }],
  executor,
  defaultActionGroupId: 'default',
  producer: 'builtInAlerts'
};

async function executor({ services, params }) {
  let result;
  try {
    result = await services.callCluster('transport.request', {
      path: '/_sql?format=json',
      method: 'POST',
      body: {
        query: params.query,
        fetch_size: 1,
        client_id: '.essql-alert-type',
      },
    });
  } catch (err) {
    throw new Error(`error running essql for alert ???: ${err.message}`);
    return;
  }

  const objects = sqlResultToObjects(result);

  for (const object of objects) {
    services.alertInstanceFactory(object.instanceId).scheduleActions('hits', result);
  }
}

interface SqlColumn {
  name: string;
  type: string;
}

interface SqlResult {
  columns: SqlColumn[];
  rows: any[][];
}

// convert the sql result to an array of object, ensuring there is an
// instanceId property, and only keeping the first object for each
// instanceId property
function sqlResultToObjects(sqlResult: SqlResult): any[] {
  const props = sqlResult.columns.map(element => element.name);
  const allObjects = sqlResult.rows.map(row => {
    const object: any = { instanceId: '' };
    for (let i = 0; i < props.length; i++) {
      object[props[i]] = row[i];
    }
    return object;
  });
  const seen = new Set();
  const objects = allObjects.filter(object => {
    if (seen.has(object.instanceId)) return false;
    seen.add(object.instanceId);
    return true;
  });

  return objects;
}

/*
POST /_sql?format=json
POST /_sql?format=txt
{
    "query": "SELECT host.id as instanceId, \"@timestamp\" as timeStamp, system.cpu.system.pct as cpu FROM \"metricbeat-*\" WHERE system.cpu.system.pct > 1.5 AND timeStamp > NOW() - INTERVAL 30 SECONDS"
}
*/
