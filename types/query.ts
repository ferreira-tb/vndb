import type { MaybeArray } from './index';
import type { QueryBuilder, QueryBuilderOperator } from '../src/query';
import type {
  RequestPostCharacterFilters,
  RequestPostCharacterSort,
  RequestPostProducerFilters,
  RequestPostProducerSort,
  RequestPostReleaseFilters,
  RequestPostReleaseSort,
  RequestPostTagFilters,
  RequestPostTagSort,
  RequestPostTraitFilters,
  RequestPostTraitSort,
  RequestPostUserListFilters,
  RequestPostUserListSort,
  RequestPostVisualNovelFilters,
  RequestPostVisualNovelSort
} from './request';
import type {
  ResponsePostCharacter,
  ResponsePostProducer,
  ResponsePostRelease,
  ResponsePostTag,
  ResponsePostTrait,
  ResponsePostUserList,
  ResponsePostVisualNovel
} from './response';

export type QueryBuilderBase<T extends QueryBuilderEndpoint> = {
  and: (cb: (builder: QueryBuilderBase<T>) => void) => QueryBuilder<T>;
  or: (cb: (builder: QueryBuilderBase<T>) => void) => QueryBuilder<T>;
  f: (name: QueryBuilderFilter<T>) => QueryBuilderOperator<T>;
  filter: (name: QueryBuilderFilter<T>) => QueryBuilderOperator<T>;
  v: (value: any) => QueryBuilder<T>;
  value: (value: any) => QueryBuilder<T>;
};

export type QueryBuilderPush = (
  value: any,
  depthFn: ((depth: number) => number) | null,
  indexFn: ((index: number) => number) | null
) => void;

/**
 * @see https://api.vndb.org/kana#query-format
 */
export type QueryBuilderOptions<T extends QueryBuilderEndpoint> = {
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
  /**
   * Comma-separated list or array of fields to fetch for each database item.
   * Dot notation can be used to select nested JSON objects,
   * e.g. `"image.url"` will select the url field inside the image object.
   *
   * Multiple nested fields can be selected with brackets,
   * e.g. `"image{id,url,dims}"` is equivalent to `"image.id, image.url, image.dims"`.
   *
   * Every field of interest must be explicitely mentioned, there is no support for wildcard matching.
   * The same applies to nested objects, it is an error to list image without sub-fields in the example above.
   *
   * The top-level `id` field is always selected by default and does not have to be mentioned in this list.
   *
   * @example
   * ```
   * // Comma-separated string.
   * const list = "title, titles.main, image.url, developers.original";
   *
   * // String array.
   * const array = ["title", "titles.main", "image.url", "developers.original"];
   * ```
   */
  fields?: MaybeArray<string>;
  /**
   * Field to sort on. Supported values depend on the type of data being queried and are documented separately.
   */
  sort?: QueryBuilderSort<T>;
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
  /**
   * User ID. This field is mainly used for `ulist`,
   * but it also sets the default user ID to use for the visual novel `label` filter.
   */
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
};

/** @see https://api.vndb.org/kana#database-querying */
export type QueryBuilderEndpoint =
  | 'vn'
  | 'release'
  | 'producer'
  | 'character'
  | 'tag'
  | 'trait'
  | 'ulist';

/** @see https://api.vndb.org/kana#database-querying */
export type QueryBuilderFilter<T extends QueryBuilderEndpoint> = T extends 'vn'
  ? RequestPostVisualNovelFilters
  : T extends 'release'
    ? RequestPostReleaseFilters
    : T extends 'producer'
      ? RequestPostProducerFilters
      : T extends 'character'
        ? RequestPostCharacterFilters
        : T extends 'tag'
          ? RequestPostTagFilters
          : T extends 'trait'
            ? RequestPostTraitFilters
            : T extends 'ulist'
              ? RequestPostUserListFilters
              : never;

/** @see https://api.vndb.org/kana#database-querying */
export type QueryBuilderSort<T extends QueryBuilderEndpoint> = T extends 'vn'
  ? RequestPostVisualNovelSort
  : T extends 'release'
    ? RequestPostReleaseSort
    : T extends 'producer'
      ? RequestPostProducerSort
      : T extends 'character'
        ? RequestPostCharacterSort
        : T extends 'tag'
          ? RequestPostTagSort
          : T extends 'trait'
            ? RequestPostTraitSort
            : T extends 'ulist'
              ? RequestPostUserListSort
              : never;

export type QueryBuilderResponseResult<T extends QueryBuilderEndpoint> =
  T extends 'vn'
    ? ResponsePostVisualNovel
    : T extends 'release'
      ? ResponsePostRelease
      : T extends 'producer'
        ? ResponsePostProducer
        : T extends 'character'
          ? ResponsePostCharacter
          : T extends 'tag'
            ? ResponsePostTag
            : T extends 'trait'
              ? ResponsePostTrait
              : T extends 'ulist'
                ? ResponsePostUserList
                : never;

export type QueryBuilderResponse<T extends QueryBuilderEndpoint> = {
  /** Array of objects representing the query results. */
  results: QueryBuilderResponseResult<T>[];
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
  compact_filters?: string;
  /**
   * Only present if the query contained `"normalized_filters": true`.
   * This is a normalized JSON representation of the filters given in the query.
   */
  normalized_filters?: string[];
};
