import type { RequestWithToken } from './request';

export * from './query';
export * from './request';
export * from './response';

export type VNDBConstructorOptions = Partial<Pick<RequestWithToken, 'token'>>;

export type VNDBEndpoint =
  | 'schema'
  | 'stats'
  | 'user'
  | 'authinfo'
  | 'vn'
  | 'release'
  | 'producer'
  | 'character'
  | 'tag'
  | 'trait'
  | 'ulist'
  | `ulist/${string}`
  | 'ulist_labels'
  | 'rlist'
  | `rlist/${string}`;
