import { QueryBuilder } from './query';
import { searchParams, toArray } from './utils';
import type {
    MaybeArray,
    RequestBasicOptions,
    RequestQuery,
    RequestQueryEntryType,
    RequestUserOptionalFields,
    ResponseAuthinfo,
    ResponseQuery,
    ResponseStats,
    ResponseUser
} from '../typings';

export class VNDB {
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

    public query<T extends RequestQueryEntryType>(query: QueryBuilder<T>, options: RequestBasicOptions = {}) {
        const headers = this.headers(options.token);
        headers.append('Content-Type', 'application/json');

        let { fields, ...queryOptions } = query.options;
        fields = Array.isArray(fields) ? fields.join(',') : (fields ?? '');
        const filters = query.compactFilters ? query.compactFilters : query.toArray();

        const body: RequestQuery = { ...queryOptions, fields, filters };
        const request = new Request(VNDB.endpoint('vn'), {
            method: 'POST',
            headers,
            body: JSON.stringify(body, null, 0)
        });

        return this.json<ResponseQuery>(request);
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
}

export * from './query';