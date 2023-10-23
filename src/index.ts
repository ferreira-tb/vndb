import { QueryBuilder } from './query';
import { searchParams, toArray } from './utils';
import type {
    MaybeArray,
    RequestBasicOptions,
    RequestQuery,
    RequestQueryEntryType,
    RequestQueryFunctionType,
    RequestUserOptionalFields,
    ResponseAuthinfo,
    ResponseQuery,
    ResponseStats,
    ResponseUser
} from '../typings';

export class VNDB {
    /**
     * Query visual novel entries.
     * @see https://api.vndb.org/kana#post-vn
     */
    public readonly vn: RequestQueryFunctionType<'vn'> = this._query('vn').bind(this);
    /**
     * @see https://api.vndb.org/kana#post-release
     */
    public readonly release: RequestQueryFunctionType<'release'> = this._query('release').bind(this);
    /**
     * @see https://api.vndb.org/kana#post-producer
     */
    public readonly producer: RequestQueryFunctionType<'producer'> = this._query('producer').bind(this);
    /**
     * @see https://api.vndb.org/kana#post-character
     */
    public readonly character: RequestQueryFunctionType<'character'> = this._query('character').bind(this);
    /**
     * @see https://api.vndb.org/kana#post-tag
     */
    public readonly tag: RequestQueryFunctionType<'tag'> = this._query('tag').bind(this);
    /**
     * @see https://api.vndb.org/kana#post-trait
     */
    public readonly trait: RequestQueryFunctionType<'trait'> = this._query('trait').bind(this);

    /**
     * Fetch a user’s list. This API is very much like `vn`,
     * except it **REQUIRES THE `user` PARAMETER TO BE SET** and it has a different response structure.
     * All visual novel filters can be used here.
     * 
     * If the user has visual novel entries on their list that have been deleted from the database,
     * these will not be returned through the API even though they do show up on the website.
     * 
     * @see https://api.vndb.org/kana#post-ulist
     * 
     * @example
     * ```
     * const query = new QueryBuilder({
     *      user: 'u2',
     *      fields: ['id', 'vote', 'vn.title'],
     *      sort: 'vote',
     *      reverse: true,
     *      results: 10
     * });
     * 
     * query.f('label').eq.v(7);
     * 
     * const vndb = new VNDB();
     * vndb.ulist(query).then(({ results }) => {
     *      console.log(results);
     * });
     * ```
     */
    public readonly ulist: RequestQueryFunctionType<'ulist'> = this._query('ulist').bind(this);

    /**
     * Validates and returns information about the given API token.
     * @see https://api.vndb.org/kana#get-authinfo
     */
    public authinfo(token: string): Promise<ResponseAuthinfo> {
        const headers = this.headers(token);
        return this.json(VNDB.endpoint('authinfo'), { headers });
    }

    private headers(token?: string) {
        const headers = new Headers();
        if (token) headers.append('Authorization', `token ${token}`);
        return headers;
    }

    private async json<T extends Record<string, any>>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
        const response = await fetch(input, init);
        if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
        return response.json();
    }

    public query<T extends RequestQueryEntryType>(
        endpoint: RequestQueryEntryType,
        query: QueryBuilder<T>,
        options: RequestBasicOptions = {}
    ) {
        const fn = this._query(endpoint);
        return fn.bind(this)(query, options);
    }

    /**
     * Returns a JSON object with metadata about several API objects, including enumeration values,
     * which fields are available for querying and a list of supported external links.
     * @see https://api.vndb.org/kana#get-schema 
     */
    public schema(options: RequestBasicOptions = {}) {
        const headers = this.headers(options.token);
        return this.json(VNDB.endpoint('schema'), { headers });
    }

    /**
     * Returns a few overall database statistics.
     * @see https://api.vndb.org/kana#get-stats 
     */
    public stats(options: RequestBasicOptions = {}): Promise<ResponseStats> {
        const headers = this.headers(options.token);
        return this.json(VNDB.endpoint('stats'), { headers });
    }

    /** 
     * Lookup users by id or username.
     * @param q User ID or username to look up, can be given multiple times to look up multiple users.
     * @param fields List of fields to select.
     * The `id` and `username` fields are always selected and should not be specified here.
     * @see https://api.vndb.org/kana#get-user
     */
    public user(
        q: MaybeArray<string | number>,
        fields: MaybeArray<RequestUserOptionalFields> = [],
        options: RequestBasicOptions = {}
    ): Promise<ResponseUser> {
        const url = VNDB.endpoint('user');
        const users = toArray(q).map((u) => typeof u === 'string' ? u : `u${u.toString(10)}`);
        url.search = searchParams('q', users).toString();
        if (fields) url.searchParams.append('fields', toArray(fields).join(','));

        const headers = this.headers(options.token);
        return this.json(url, { headers });
    }

    public static endpoint(input = '') {
        return new URL(`https://api.vndb.org/kana/${input}`);
    }

    private _query(endpoint: RequestQueryEntryType) {
        const self = this;
        return function<T extends RequestQueryEntryType>(query: QueryBuilder<T>, options: RequestBasicOptions = {}) {
            const headers = self.headers(options.token);
            headers.append('Content-Type', 'application/json');

            let { fields, ...queryOptions } = query.options;
            fields = Array.isArray(fields) ? fields.join(',') : (fields ?? '');
            const filters = query.compactFilters ? query.compactFilters : query.toArray();

            const body: RequestQuery<T> = { ...queryOptions, fields, filters };
            const request = new Request(VNDB.endpoint(endpoint), {
                method: 'POST',
                headers,
                body: JSON.stringify(body, null, 0)
            });

            return self.json<ResponseQuery>(request);
        }
    }
}

export * from './query';