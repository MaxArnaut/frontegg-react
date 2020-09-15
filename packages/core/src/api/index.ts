import * as auth from './auth';
import * as profile from './teams';
import * as metadata from './metadata';
import * as reports from './reports';

export { ContextHolder, FronteggContext } from './ContextHolder';

export * as fetch from './fetch';
export * from './auth/interfaces';
export * from './teams/interfaces';
export * from './metadata/interfaces';
export * from './reports/interfaces';

export const api = {
  auth,
  profile,
  metadata,
  reports,
};
