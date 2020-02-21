interface SqlColumn {
  name: string;
  type: string;
}

interface SqlResult {
  columns: SqlColumn[];
  rows: any[][];
}

// convert the sql result to an array of object, translating
// prop names; . => _ and @ => $
export function sqlResultToObjects(sqlResult: SqlResult): any[] {
  const propNames = sqlResult.columns
    .map(element => translatedPropName(element.name));
  const objects = sqlResult.rows.map(row => {
    const object: any = {};
    for (let i = 0; i < propNames.length; i++) {
      object[propNames[i]] = row[i];
    }
    return object;
  });

  return objects;
}

function translatedPropName(propName: string) {
  return propName
    .replace(/\./g, '_')
    .replace(/@/g, '$')
}