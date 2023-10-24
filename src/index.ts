import { QueryBuilder } from './query';
import { toArray } from './utils';
import type {
    MaybeArray,
    RequestBasicOptions,
    QueryBuilderOptions,
    QueryBuilderEndpoint,
    RequestGetUserFields,
    ResponseGetAuthinfo,
    ResponseGetStats,
    ResponseGetUser,
    ResponseGetUserListLabels,
    VNDBEndpoint,
    ResponseGetSchema,
    QueryBuilderResponse,
    RequestDeletePatchUserListGenericOptions
} from '../typings';

export class VNDB {
    readonly #delete = {
        /**
         * Remove a visual novel from the user’s list. Returns success even if the VN is not on the user’s list.
         * Removing a VN also removes any associated releases from the user’s list.
         */
        ulist: this.#ulist('u', 'DELETE'),

        /**
         * Remove a release from the user’s list. Returns success even if the release is not on the user’s list.
         * 
         * Removing a release does not remove the associated visual novels from the user’s visual novel list,
         * that requires separate calls to `DELETE /ulist/<id>`.
         */
        rlist: this.#ulist('r', 'DELETE')
    }

    readonly #get = {
        /**
         * Validates and returns information about the given API token.
         * @see https://api.vndb.org/kana#get-authinfo
         */
        authinfo: (token: string): Promise<ResponseGetAuthinfo> => {
            const headers = this.#headers(token);
            return this.#json(VNDB.endpoint('authinfo'), { headers });
        },

        /**
         * Returns a JSON object with metadata about several API objects, including enumeration values,
         * which fields are available for querying and a list of supported external links.
         * @see https://api.vndb.org/kana#get-schema 
         */
        schema: (options: RequestBasicOptions = {}): Promise<ResponseGetSchema> => {
            const headers = this.#headers(options.token);
            return this.#json(VNDB.endpoint('schema'), { headers });
        },

        /**
         * Returns a few overall database statistics.
         * @see https://api.vndb.org/kana#get-stats 
         */
        stats: (options: RequestBasicOptions = {}): Promise<ResponseGetStats> => {
            const headers = this.#headers(options.token);
            return this.#json(VNDB.endpoint('stats'), { headers });
        },

        /**
         * Fetch the list labels for a certain user.
         * @param user The user ID to fetch the labels for.
         * If the parameter is missing, the labels for the currently authenticated user are fetched instead.
         * @param fields List of fields to select.
         * Currently only `count` may be specified, the other fields are always selected.
         * @see https://api.vndb.org/kana#get-ulist_labels
         */
        ulistLabels: (user?: string, fields?: MaybeArray<'count'>, options: RequestBasicOptions = {}): Promise<ResponseGetUserListLabels> => {
            const url = VNDB.endpoint('ulist_labels');
            if (user) url.searchParams.append('user', user);
            if (fields) url.searchParams.append('fields', toArray(fields).join(','));

            const headers = this.#headers(options.token);
            return this.#json(url, { headers });
        },

        /** 
         * Lookup users by id or username.
         * @param q User ID or username to look up, can be given multiple times to look up multiple users.
         * @param fields List of fields to select.
         * The `id` and `username` fields are always selected and should not be specified here.
         * @see https://api.vndb.org/kana#get-user
         */
        user: (
            users: MaybeArray<string>,
            fields: MaybeArray<RequestGetUserFields> = [],
            options: RequestBasicOptions = {}
        ): Promise<ResponseGetUser> => {
            const url = VNDB.endpoint('user');
            toArray(users).forEach((user) => void url.searchParams.append('q', user));
            if (fields) url.searchParams.append('fields', toArray(fields).join(','));
    
            const headers = this.#headers(options.token);
            return this.#json(url, { headers });
        }
    }

    readonly #patch = {
        /**
         * Add or update a release in the user’s list. Requires the `listwrite` permission.
         * All visual novels linked to the release are also added to the user’s visual novel list,
         * if they aren’t in the list yet.
         * @see https://api.vndb.org/kana#patch-rlistid
         */
        rlist: this.#ulist('r', 'PATCH'),

        /**
         * Add or update a visual novel in the user’s list. Requires the `listwrite` permission.
         * @see https://api.vndb.org/kana#patch-ulistid
         */
        ulist: this.#ulist('u', 'PATCH')
    }

    readonly #post = {
        query: <T extends QueryBuilderEndpoint>(
            endpoint: QueryBuilderEndpoint,
            query: QueryBuilder<T>,
            options: RequestBasicOptions = {}
        ): Promise<QueryBuilderResponse<T>> => {
            const fn = this.#query(endpoint);
            return fn(query, options);
        },

        /**
         * @see https://api.vndb.org/kana#post-character
         */
        character: this.#query('character'),

        /**
         * @see https://api.vndb.org/kana#post-producer
         */
        producer: this.#query('producer'),

        /**
         * @see https://api.vndb.org/kana#post-release
         */
        release: this.#query('release'),

        /**
         * @see https://api.vndb.org/kana#post-tag
         */
        tag: this.#query('tag'),

        /**
         * @see https://api.vndb.org/kana#post-trait
         */
        trait: this.#query('trait'),

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
        ulist: this.#query('ulist'),

        /**
         * Query visual novel entries.
         * @see https://api.vndb.org/kana#post-vn
         */
        vn: this.#query('vn')
    }

    get delete() {
        return this.#delete;
    }

    get get() {
        return this.#get;
    }

    get patch() {
        return this.#patch;
    }

    get post() {
        return this.#post;
    }

    // Simple Requests
    // https://api.vndb.org/kana#simple-requests
    get authinfo() {
        return this.#get.authinfo;
    }

    get schema() {
        return this.#get.schema;
    }

    get stats() {
        return this.#get.stats;
    }

    get user() {
        return this.#get.user;
    }

    // Database Querying
    // https://api.vndb.org/kana#database-querying
    get character() {
        return this.#post.character;
    }

    get producer() {
        return this.#post.producer;
    }

    get release() {
        return this.#post.release;
    }

    get tag() {
        return this.#post.tag;
    }

    get trait() {
        return this.#post.trait;
    }

    get vn() {
        return this.#post.vn;
    }

    // List Management
    // https://api.vndb.org/kana#list-management
    get ulist() {
        return this.#post.ulist;
    }

    get ulistLabels() {
        return this.#get.ulistLabels;
    }

    // Internal
    #headers(token?: string) {
        const headers = new Headers();
        if (token) headers.append('Authorization', `token ${token}`);
        return headers;
    }

    async #json<T extends Record<string, any>>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
        const response = await fetch(input, init);
        if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
        return response.json();
    }

    #query<T extends QueryBuilderEndpoint>(endpoint: T) {
        return (query: QueryBuilder<T>, options: RequestBasicOptions = {}): Promise<QueryBuilderResponse<T>> => {
            const headers = this.#headers(options.token);
            headers.append('Content-Type', 'application/json');

            let { fields, ...queryOptions } = query.options;
            fields = Array.isArray(fields) ? fields.join(',') : (fields ?? '');
            const filters = query.compactFilters ? query.compactFilters : query.toArray();

            const body: QueryBuilderOptions<T> = { ...queryOptions, fields, filters };
            const request = new Request(VNDB.endpoint(endpoint), {
                method: 'POST',
                headers,
                body: JSON.stringify(body, null, 0)
            });

            return this.#json(request);
        }
    }

    #ulist<T extends 'u' | 'r', U extends 'DELETE' | 'PATCH'>(prefix: T, method: U) {
        return (
            id: string,
            options: RequestDeletePatchUserListGenericOptions<T, U>
        ) => {
            const { token, ...data } = options;
            const headers = this.#headers(token);
            if (method === 'PATCH') headers.append('Content-Type', 'application/json');

            const request = new Request(VNDB.endpoint(`${prefix}list/${id}`), {
                method,
                headers,
                body: JSON.stringify(data, null, 0)
            });

            return fetch(request);
        }
    }

    // Static
    public static readonly regex = {
        character: /c\d+/,
        producer: /p\d+/,
        release: /r\d+/,
        tag: /g\d+/,
        trait: /i\d+/,
        vn: /v\d+/
    }

    public static endpoint(input?: VNDBEndpoint) {
        return new URL(`https://api.vndb.org/kana/${input ?? ''}`);
    }
}

export * from './query';