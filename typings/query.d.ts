import { MaybeArray } from './index';

export type RequestQuery = {
    /**
     * Determine which database items to fetch.
     * @see https://api.vndb.org/kana#filters
     * 
     * @example
     * Example:
     * ```
     * ["and",
     *     ["or",
     *         ["lang", "=", "en"],
     *         ["lang", "=", "de"],
     *         ["lang", "=", "fr"]
     *     ],
     *     ["olang", "!=", "ja"],
     *     ["release", "=", ["and",
     *         ["released", ">=", "2020-01-01"],
     *         ["producer", "=", ["id", "=", "p30"]]
     *     ]
     *     ]
     * ]
     * ```
     */
    filters?: string | any[];
    fields?: string;
    /**
     * Field to sort on. Supported values depend on the type of data being queried and are documented separately. 
     */
    sort?: string;
    /** Set to true to sort in descending order. */
    reverse?: boolean;
    /** Number of results per page, max 100. Can also be set to 0 if you’re not interested in the results at all,
     * but just want to verify your query or get the `count`, `compact_filters` or `normalized_filters`.
     */
    results?: number;
    /**
     * Page number to request, starting from 1.
     * @see https://api.vndb.org/kana#pagination
     */
    page?: number;
    user?: string;
    /**
     * Whether the response should include the count field.
     * This option should be avoided when the count is not needed since it has a considerable performance impact.
     * 
     * It indicates the total number of entries that matched the given filters. 
     */
    count?: boolean;
    /**
     * Whether the response should include the `compact_filters` field.
     * It is a compact string representation of the filters given in the query.
     */
    compact_filters?: boolean;
    /**
     * Whether the response should include the normalized_filters field.
     * It is a normalized JSON representation of the filters given in the query. 
     */
    normalized_filters?: boolean;
}

export type RequestQueryEntryType = 'vn' | 'release' | 'producer' | 'character' | 'staff' | 'tag' | 'trait';

export type RequestQueryFiltersVisualNovel =
    | 'search'
    | 'lang'
    | 'olang'
    | 'platform'
    | 'length'
    | 'released'
    | 'rating'
    | 'votecount'
    | 'has_description'
    | 'has_anime'
    | 'has_screenshot'
    | 'has_review'
    | 'devstatus'
    | 'tag'
    | 'dtag'
    | 'anime_id'
    | 'label'
    | 'release'
    | 'character'
    | 'staff'
    | 'developer';

export type ResponseQuery<T = unknown> = {
    /** Array of objects representing the query results. */
    results: Array<T>;
    /**
     * When `true`, repeating the query with an incremented page number will yield more results.
     * This is a cheaper form of pagination than using the `count` field. 
     */
    more: boolean;
    /**
     * Only present if the query contained `"count": true`.
     * Indicates the total number of entries that matched the given filters. 
     */
    count?: number;
    /**
     * Only present if the query contained `"compact_filters": true`.
     * This is a compact string representation of the filters given in the query.
     */
    compact_filters: string;
    /**
     * Only present if the query contained `"normalized_filters": true`.
     * This is a normalized JSON representation of the filters given in the query. 
     */
    normalized_filters: string[];
}