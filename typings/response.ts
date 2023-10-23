export type ResponseGetSchema = Record<string, any>;

export type ResponseGetStats = {
    chars: number;
    producers: number;
    releases: number;
    staff: number;
    tags: number;
    traits: number;
    vn: number;
}

export type ResponseGetUserUser = {
    /** String in `u123` format. */
    id: string;
    username: string;
    /** Integer, number of play time votes this user has submitted. */
    lengthvotes?: number;
    /** Integer, sum of the user’s play time votes, in minutes. */
    lengthvotes_sum?: number;
}

/**
 * The response object contains one key for each given parameter,
 * its value is either `null` if no such user was found or otherwise an object implementing the `User` interface.
 */
export type ResponseGetUser = Record<string, ResponseGetUserUser | null>;

export type ResponseGetAuthinfoPermissions = 'listread' | 'listwrite';

export type ResponseGetAuthinfo = {
    id: string;
    username: string;
    /**
     * `listread`: Allows read access to private labels and entries in the user’s visual novel list.
     * 
     * `listwrite`: Allows write access to the user’s visual novel list.
     */
    permissions: ResponseGetAuthinfoPermissions[];
}

/** @see https://api.vndb.org/kana#vn-fields */
export type ResponsePostVisualNovelTitleEntry = {
    /** Each language appears at most once in the titles list. */
    lang?: string;
    /** Title in the original script. */
    title?: string;
    /** Romanized version of `title`. */
    latin?: string | null;
    official?: boolean;
    /**
     * Whether this is the “main” title for the visual novel entry.
     * Exactly one title has this flag set in the titles array and
     * it’s always the title whose lang matches the VN’s `olang` field.
     * 
     * This field is included for convenience,
     * you can of course also use the olang field to grab the main title. 
     */
    main?: boolean;
}

export type ResponsePostVisualNovelImage = {
    /** Image identifier. */
    id?: string;
    url?: string;
    /** Pixel dimensions of the image, array with two integer elements indicating the width and height. */
    dims?: [number, number];
    /** Average image flagging vote for sexual content. */
    sexual?: 0 | 1 | 2;
    /** Average image flagging vote for violence. */
    violence?: 0 | 1 | 2;
    /** Number of image flagging votes. */
    votecount?: number;
}

export type ResponsePostVisualNovelScreenshot = ResponsePostVisualNovelImage & {
    /** URL to the thumbnail. */
    thumbnail?: string;
    /** Pixel dimensions of the thumbnail, array with two integer elements. */
    thumbnail_dims?: [number, number];
    /**
     * Release object. All release fields can be selected.
     * It is very common for all screenshots of a VN to be assigned to the same release,
     * so the fields you select here are likely to get duplicated several times in the response.
     * 
     * If you want to fetch more than just a few fields,
     * it is more efficient to only select `release.id` here and
     * then grab detailed release info with a separate request.
     */
    release?: ResponsePostRelease;
}

export type ResponsePostVisualNovelTag = ResponsePostTag & {
    /** Tag rating between 0 (exclusive) and 3 (inclusive). */
    rating?: 1 | 2 | 3;
    /** Spoiler level. */
    spoiler?: 0 | 1 | 2;
    lie?: boolean;
}

/** @see https://api.vndb.org/kana#vn-fields */
export type ResponsePostVisualNovel = {
    id: string;
    /** Main title as displayed on the site, typically romanized from the original script.  */
    title?: string;
    /** Alternative title, typically the same as title but in the original script. */
    alttitle?: string | null;
    titles?: ResponsePostVisualNovelTitleEntry[];
    /** List of aliases. */
    aliases?: string[];
    /** Language the VN has originally been written in. */
    olang?: string;
    /** Integer, development status.
     * `0` meaning "Finished", `1` is "In development" and `2` for "Cancelled".
     */
    devstatus?: 0 | 1 | 2;
    /** Release date. */
    released?: string | null;
    /** List of languages the VN is available in. Does not include machine translations. */
    languages?: string[];
    /** List of platforms for which the VN is available. */
    platforms?: string[];
    image?: ResponsePostVisualNovelImage | null;
    /**
     * Rough length estimate of the VN between 1 (very short) and 5 (very long).
     * This field is only used as a fallback for when there are no length votes,
     * so you’ll probably want to fetch `length_minutes` too.
     */
    length?: 1 | 2 | 3 | 4 | 5 | null;
    /** Average of user-submitted play times in minutes. */
    length_minutes?: number | null;
    /** Number of submitted play times. */
    length_votes?: number;
    /**
     * May contain formatting codes.
     * @see https://vndb.org/d9#4
     */
    description?: string | null;
    /** Number between 10 and 100, `null` if nobody voted. */
    rating?: number | null;
    /** Number of votes. */
    votecount?: number;
    screenshots?: ResponsePostVisualNovelScreenshot[];
    /** Only directly applied tags are returned, parent tags are not included. */
    tags?: ResponsePostVisualNovelTag[];
    /**
     *  The developers of a VN are all producers with a “developer” role on a release linked to the VN.
     * You can get this same information by fetching all relevant release entries,
     * but if all you need is the list of developers then querying this field is faster. 
     */
    developers?: ResponsePostProducer[];
}

export type ResponsePostReleaseLanguage = {
    /** Each language appears at most once. */
    lang?: string;
    /**
     * Title in the original script.
     * Can be null, in which case the title for this language is the same as the “main” language. 
     */
    title?: string | null;
    /** Romanized version of title. */
    latin?: string | null;
    /** Whether this is a machine translation. */
    mtl?: boolean;
    /** Whether this language is used to determine the “main” title for the release entry. */
    main?: boolean;
}

export type ResponsePostReleaseMedia = {
    medium?: string;
    /** This is 0 for media where a quantity does not make sense, like “internet download”. */
    qty?: number;
}

/**
 * @see https://api.vndb.org/kana#release-fields
 * @see https://api.vndb.org/kana#vn-fields
 */
export type ResponsePostReleaseVisualNovel = ResponsePostVisualNovel & {
    /** The release type for this visual novel. */
    rtype?: 'trial' | 'partial' | 'complete';
}

export type ResponsePostReleaseProducer = ResponsePostProducer & {
    developer?: boolean;
    publisher?: boolean;
}

export type ResponsePostReleaseExternalLink = {
    url?: string;
    /** English human-readable label for this link. */
    label?: string;
    /** Internal identifier of the site, intended for applications that want to
     * localize the label or to parse/format/extract remote identifiers.
     * 
     * Keep in mind that the list of supported sites, their internal names and
     * their ID types are subject to change. */
    name?: string;
    /**
     * Remote identifier for this link. Not all sites have a sensible identifier
     * as part of their URL format, in such cases this field is simply equivalent to the URL.
     */
    id?: string;
}

/** @see https://api.vndb.org/kana#release-fields */
export type ResponsePostRelease = {
    id: string;
    /** Main title as displayed on the site, typically romanized from the original script.  */
    title?: string;
    /** Alternative title, typically the same as title but in the original script. */
    alttitle?: string | null;
    languages?: ResponsePostReleaseLanguage[];
    platforms?: string[];
    media?: ResponsePostReleaseMedia[];
    /** List of visual novels this release is linked to. */
    vns?: ResponsePostReleaseVisualNovel[];
    producers?: ResponsePostReleaseProducer[];
    /** Release date. */
    released?: string;
    /** Age rating. */
    minage?: number | null;
    patch?: boolean;
    freeware?: boolean;
    uncensored?: boolean | null;
    official?: boolean;
    has_ero?: boolean;
    resolution?: 'non-standard' | [number, number] | null;
    engine?: string | null;
    /** 1 = not voiced, 2 = only ero scenes voiced, 3 = partially voiced, 4 = fully voiced. */
    voiced?: 1 | 2 | 3 | 4 | null;
    /**
     * May contain formatting codes.
     * @see https://vndb.org/d9#4
     */
    notes?: string | null;
    /** JAN/EAN/UPC code. */
    gtin?: string | null;
    /** Catalog number. */
    catalog?: string | null;
    /**
     * Links to external websites. This list is equivalent to the links displayed
     * on the release pages on the site, so it may include redundant entries
     * (e.g. if a Steam ID is known, links to both Steam and SteamDB are included)
     * and links that are automatically fetched from external resources
     * (e.g. PlayAsia, for which a GTIN lookup is performed).
     * These extra sites are not listed in the extlinks list of the schema. 
     */
    extlinks?: ResponsePostReleaseExternalLink[];
}

/** @see https://api.vndb.org/kana#producer-fields */
export type ResponsePostProducer = {
    id: string;
    name?: string;
    /** Name in the original script. */
    original?: string | null;
    aliases?: string[];
    lang?: string;
    /** Producer type, "co" for company, "in" for individual and "ng" for amateur group. */
    type?: 'co' | 'in' | 'ng';
    /**
     * May contain formatting codes.
     * @see https://vndb.org/d9#4
     */
    description?: string | null;
}

export type ResponsePostCharacterImage = ResponsePostVisualNovelImage;

export type ResponsePostCharacterSex = 'm' | 'f' | 'b' | null;

export type ResponsePostCharacterVisualNovel = ResponsePostVisualNovel & {
    spoiler?: number;
    /** "main" for protagonist, "primary" for main characters. */
    role?: 'main' | 'primary' | 'side' | 'appears';
    /** Specific release that this character appears in. */
    release?: ResponsePostRelease | null;
}

export type ResponsePostCharacterTrait = ResponsePostTrait & {
    spoiler?: 0 | 1 | 2;
    lie?: boolean;
}

/** @see https://api.vndb.org/kana#fields */
export type ResponsePostCharacter = {
    id: string;
    name?: string;
    /** Name in the original script. */
    original?: string | null;
    aliases?: string[];
    /**
     * May contain formatting codes.
     * @see https://vndb.org/d9#4
     */
    description?: string | null;
    image?: ResponsePostCharacterImage | null;
    blood_type?: 'a' | 'b' | 'ab' | 'o';
    /** Centimeters. */
    height?: number | null;
    /** Kilograms. */
    weight?: number | null;
    /** Centimeters. */
    bust?: number | null;
    /** Centimeters. */
    waist?: number | null;
    /** Centimeters. */
    hips?: number | null;
    cup?: string | null;
    age?: number | null;
    /** Possibly `null`, otherwise an array of two integers: month and day, respectively.  */
    birthday?: [number, number] | null;
    /**
     * Possibly null, otherwise an array of two strings:
     * the character’s apparent (non-spoiler) sex and the character’s real (spoiler) sex.
     * 
     * Possible values are null, "m", "f" or "b" (meaning “both”).
     */
    sex?: [ResponsePostCharacterSex, ResponsePostCharacterSex] | null;
    /**
     * Visual novels this character appears in.
     * The same visual novel may be listed multiple times with a different release and
     * the spoiler level and role can be different per release.
     */
    vns?: ResponsePostCharacterVisualNovel[];
    traits?: ResponsePostCharacterTrait[];
}

/** @see https://api.vndb.org/kana#tag-fields */
export type ResponsePostTag = {
    id: string;
    name?: string;
    aliases?: string[];
    /**
     * May contain formatting codes.
     * @see https://vndb.org/d9#4
     */
    description?: string | null;
    /** "cont" for content, "ero" for sexual content and "tech" for technical tags. */
    category?: 'cont' | 'ero' | 'tech';
    searchable?: boolean;
    applicable?: boolean;
    /** Number of VNs this tag has been applied to, including any child tags. */
    vn_count?: number;
}

export type ResponsePostTrait = {
    id: string;
    name?: string;
    aliases?: string[];
    /**
     * May contain formatting codes.
     * @see https://vndb.org/d9#4
     */
    description?: string | null;
    searchable?: boolean;
    applicable?: boolean;
    group_id?: string;
    group_name?: string;
    /** Number of characters this trait has been applied to, including child traits. */
    char_count?: number;
}

export type ResponsePostUserListLabel = {
    id: number;
    label?: string;
}

export type ResponsePostUserListVisualNovel = ResponsePostVisualNovel;

export type ResponsePostUserListRelease = ResponsePostRelease & {
    /** 0 for “Unknown”, 1 for “Pending”, 2 for “Obtained”, 3 for “On loan”, 4 for “Deleted”. */
    list_status?: 0 | 1 | 2 | 3 | 4;
}

export type ResponsePostUserList = {
    id: string;
    /**
     * Unix timestamp.
     * @see https://developer.mozilla.org/en-US/docs/Glossary/Unix_time
     */
    added?: number;
    /**
     * Integer, can be `null`, unix timestamp of when the user voted on this VN.
     * @see https://developer.mozilla.org/en-US/docs/Glossary/Unix_time
     */
    voted?: number | null;
    /**
     * Integer, unix timestamp when the user last modified their list for this VN.
     * @see https://developer.mozilla.org/en-US/docs/Glossary/Unix_time
     */
    lastmod?: number;
    /** Integer, can be `null`, 10 - 100. */
    vote?: number | null;
    /** Start date, can be null, `yyyy-MM-dd` format. */
    started?: string | null;
    /** Finish date, can be null, `yyyy-MM-dd` format. */
    finished?: string | null;
    notes?: string | null;
    /**
     * User labels assigned to this VN.
     * Private labels are only listed when the user is authenticated.
     */
    labels?: ResponsePostUserListLabel[];
    /** Visual novel info. */
    vn?: ResponsePostUserListVisualNovel;
    releases?: ResponsePostUserListRelease[];
}

export type ResponseGetUserListLabelsLabel = {
    /** Integer identifier of the label. */
    id: number;
    /**
     * Whether this label is private. Private labels are only included when authenticated with the listread permission.
     * 
     * The "Voted" label (id=7) is always included even when private.
     */
    private: boolean;
    label: string;
    /**
     * The ‘Voted’ label may have different counts depending on whether the user has authenticated.
     */
    count: number;
}

/**
 * Labels with an id below 10 are the pre-defined labels and are the same for everyone,
 * though even pre-defined labels are excluded if they are marked private.
 * @see https://api.vndb.org/kana#get-ulist_labels
 */
export type ResponseGetUserListLabels = {
    labels: ResponseGetUserListLabelsLabel[];
}