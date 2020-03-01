import {
  Logger,
} from '../../../../kibana/src/core/server';

export class Service {
  constructor(private readonly logger: Logger) {
  }

  fromCode(spec: RenderCodeSpec): RenderSchema {
    return this.fromObject(objectFromCode(spec));
  }

  fromObject(spec: RenderObjectSpec): RenderSchema {
    return createFromObject(spec);
  }
}

export interface RenderCodeSpec {
} 

export interface RenderObjectSpec {
} 

export interface RenderSchema {
} 

function objectFromCode(spec: RenderCodeSpec): RenderObjectSpec {
  return {}
}

function createFromObject(spec: RenderObjectSpec): RenderSchema {
  return {}
}