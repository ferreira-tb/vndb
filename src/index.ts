import { QueryBuilder } from './query';
import { searchParams, toArray } from './utils';
import type {
    MaybeArray,
    RequestQueryEntryType,
    RequestUserOptionalFields,
    ResponseAuthinfo,
    ResponseStats,
    ResponseUser
} from '../typings';

export class VNDB {
    /**
     * Validates and returns information about the given API token.
     * @see https://api.vndb.org/kana#get-authinfo
     */
    public authinfo(token: string): Promise<ResponseAuthinfo> {
        const headers = new Headers();
        headers.append('Authorization', `token ${token}`);
        return this.json(VNDB.endpoint('authinfo'), { headers });
    }

    private async json<T extends Record<string, any>>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
        const response = await fetch(input, init);
        if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
        return response.json();
    }

    public query<T extends RequestQueryEntryType>(query: QueryBuilder<T>) {
        console.log(query);
    }

    /**
     * Returns a JSON object with metadata about several API objects, including enumeration values,
     * which fields are available for querying and a list of supported external links.
     * @see https://api.vndb.org/kana#get-schema 
     */
    public schema() {
        return this.json(VNDB.endpoint('schema'));
    }

    /**
     * Returns a few overall database statistics.
     * @see https://api.vndb.org/kana#get-stats 
     */
    public stats(): Promise<ResponseStats> {
        return this.json(VNDB.endpoint('stats'));
    }

    /** 
     * Lookup users by id or username.
     * @param q User ID or username to look up, can be given multiple times to look up multiple users.
     * @param fields List of fields to select.
     * The `id` and `username` fields are always selected and should not be specified here.
     * @see https://api.vndb.org/kana#get-user
     */
    public user(q: MaybeArray<string | number>, fields?: MaybeArray<RequestUserOptionalFields>): Promise<ResponseUser> {
        const url = VNDB.endpoint('user');
        const users = toArray(q).map((u) => typeof u === 'string' ? u : `u${u.toString(10)}`);
        url.search = searchParams('q', users).toString();
        if (fields) url.searchParams.append('fields', toArray(fields).join(','));
        return this.json(url);
    }

    private static endpoint(input = '') {
        return new URL(`https://api.vndb.org/kana/${input}`);
    }
}

export { QueryBuilder } from './query';