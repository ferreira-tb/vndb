export type RequestBasicOptions = {
    /**
     * @see https://api.vndb.org/kana#user-authentication
     */
    token?: string;
}

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
export type RequestPostProducerFilters =
    | 'id'
    | 'search'
    | 'lang'
    | 'type';

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
export type RequestPostTagFilters =
    | 'id'
    | 'search'
    | 'category';

/** @see https://api.vndb.org/kana#filters-2 */
export type RequestPostTraitFilters =
    | 'id'
    | 'search';

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
export type RequestPostReleaseSort =
    | 'id'
    | 'title'
    | 'released'
    | 'searchrank';

/** @see https://api.vndb.org/kana#post-producer */
export type RequestPostProducerSort =
    | 'id'
    | 'name'
    | 'searchrank';

/** @see https://api.vndb.org/kana#post-tag */
export type RequestPostTagSort =
    | 'id'
    | 'name'
    | 'vn_count'
    | 'searchrank';

/** @see https://api.vndb.org/kana#post-trait */
export type RequestPostTraitSort =
    | 'id'
    | 'name'
    | 'char_count'
    | 'searchrank';

/** @see https://api.vndb.org/kana#post-character */
export type RequestPostCharacterSort =
    | 'id'
    | 'name'
    | 'searchrank';

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