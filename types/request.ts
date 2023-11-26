import type { QueryBuilderEndpoint, QueryBuilderOptions } from './query';
import type { ResponsePostUserListRelease } from './response';

export type RequestWithToken = {
  /**
   * @see https://api.vndb.org/kana#user-authentication
   */
  token: string;
};

export type RequestBasicOptions = Partial<RequestWithToken>;

export type RequestSearchOptions<T extends QueryBuilderEndpoint> =
  RequestBasicOptions & Omit<QueryBuilderOptions<T>, 'filters'>;

export type RequestGetUserFields = 'lengthvotes' | 'lengthvotes_sum';

/** @see https://api.vndb.org/kana#vn-filters */
export type RequestPostVisualNovelFilters =
  | 'id'
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

/** @see https://api.vndb.org/kana#release-filters */
export type RequestPostReleaseFilters =
  | 'id'
  | 'search'
  | 'lang'
  | 'platform'
  | 'released'
  | 'resolution'
  | 'resolution_aspect'
  | 'minage'
  | 'medium'
  | 'voiced'
  | 'engine'
  | 'rtype'
  | 'extlink'
  | 'patch'
  | 'freeware'
  | 'uncensored'
  | 'official'
  | 'has_ero'
  | 'vn'
  | 'producer';

/** @see https://api.vndb.org/kana#producer-filters */
export type RequestPostProducerFilters = 'id' | 'search' | 'lang' | 'type';

/** @see https://api.vndb.org/kana#character-filters */
export type RequestPostCharacterFilters =
  | 'id'
  | 'search'
  | 'role'
  | 'blood_type'
  | 'sex'
  | 'height'
  | 'weight'
  | 'bust'
  | 'waist'
  | 'hips'
  | 'cup'
  | 'age'
  | 'trait'
  | 'dtrait'
  | 'birthday'
  | 'seiyuu'
  | 'vn';

/** @see https://api.vndb.org/kana#filters-1 */
export type RequestPostTagFilters = 'id' | 'search' | 'category';

/** @see https://api.vndb.org/kana#filters-2 */
export type RequestPostTraitFilters = 'id' | 'search';

/** @see https://api.vndb.org/kana#post-ulist */
export type RequestPostUserListFilters = RequestPostVisualNovelFilters;

/** @see https://api.vndb.org/kana#post-vn */
export type RequestPostVisualNovelSort =
  | 'id'
  | 'title'
  | 'released'
  | 'rating'
  | 'votecount'
  | 'searchrank';

/** @see https://api.vndb.org/kana#post-release */
export type RequestPostReleaseSort = 'id' | 'title' | 'released' | 'searchrank';

/** @see https://api.vndb.org/kana#post-producer */
export type RequestPostProducerSort = 'id' | 'name' | 'searchrank';

/** @see https://api.vndb.org/kana#post-tag */
export type RequestPostTagSort = 'id' | 'name' | 'vn_count' | 'searchrank';

/** @see https://api.vndb.org/kana#post-trait */
export type RequestPostTraitSort = 'id' | 'name' | 'char_count' | 'searchrank';

/** @see https://api.vndb.org/kana#post-character */
export type RequestPostCharacterSort = 'id' | 'name' | 'searchrank';

/** @see https://api.vndb.org/kana#post-ulist */
export type RequestPostUserListSort =
  | 'id'
  | 'title'
  | 'released'
  | 'rating'
  | 'votecount'
  | 'voted'
  | 'vote'
  | 'added'
  | 'lastmod'
  | 'started'
  | 'finished'
  | 'searchrank';

export type RequestDeletePatchUserListGenericOptions<
  T extends 'u' | 'r',
  U extends 'DELETE' | 'PATCH'
> = U extends 'PATCH'
  ? T extends 'u'
    ? RequestPatchUserList
    : RequestPatchUserListReleaseList
  : U extends 'DELETE'
    ? T extends 'u'
      ? RequestDeleteUserList
      : RequestDeleteUserListReleaseList
    : never;

/**
 * All members are be optional (except the token), missing members are not modified.
 * A `null` value can be used to unset a field (except for labels).
 *
 * The virtual labels with id 0 (“No label”) and 7 (“Voted”) can not be set.
 * The “voted” label is automatically added/removed based on the vote field.
 *
 * **Wonky behavior alert:** this API does not verify label ids and lets you add non-existent labels.
 * These are not displayed on the website and not returned by `POST /ulist`,
 * but they’re still stored in the database and may magically show up if a label with that id is created in the future.
 * Don’t rely on this behavior, it’s a bug.
 *
 * **More wonky behavior:** the website automatically unsets the other
 * Playing/Finished/Stalled/Dropped labels when you select one of those,
 * but this is not enforced server-side and the API lets you set all labels at the same time.
 * This is totally not a bug.
 *
 * **Slightly unintuitive behavior alert:**
 * this API always adds the visual novel to the user’s list if it’s not already present.
 * Use `DELETE` if you want to remove a VN from the list.
 *
 * @see https://api.vndb.org/kana#patch-ulistid
 */
export type RequestPatchUserList = RequestWithToken & {
  /** Integer between 10 and 100. */
  vote?: number;
  notes?: string;
  started?: Date;
  finished?: Date;
  /**
   * Array of integers, label ids.
   * Setting this will overwrite any existing labels assigned to the VN with the given array.
   */
  labels?: number[];
  /**
   * Array of label ids to add to the VN, any already existing labels will be unaffected.
   */
  labels_set?: number[];
  /** Array of label ids to remove from the VN. */
  labels_unset?: number[];
};

export type RequestPatchUserListReleaseList = RequestWithToken & {
  status?: ResponsePostUserListRelease['list_status'];
};

export type RequestDeleteUserList = RequestWithToken;
export type RequestDeleteUserListReleaseList = RequestWithToken;
