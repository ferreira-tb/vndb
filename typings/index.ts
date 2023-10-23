export * from './query';
export * from './response';
export * from './request';

export type MaybeArray<T> = T | T[];

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
    | 'ulist_labels'
    | 'rlist';