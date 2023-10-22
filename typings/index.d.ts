export * from './query';

export type MaybeArray<T> = T | T[];

export type RequestBasicOptions = {
    /**
     * @see https://api.vndb.org/kana#user-authentication
     */
    token?: string;
}

/**
 * `listread`: Allows read access to private labels and entries in the user’s visual novel list.
 * 
 * `listwrite`: Allows write access to the user’s visual novel list.
 */
export type TokenPermissions = 'listread' | 'listwrite';

export type ResponseAuthinfo = {
    id: string;
    username: string;
    permissions: TokenPermissions[];
}

export type ResponseStats = {
    chars: number;
    producers: number;
    releases: number;
    staff: number;
    tags: number;
    traits: number;
    vn: number;
}

export type User = {
    /** String in `u123` format. */
    id: string;
    username: string;
    /** Integer, number of play time votes this user has submitted. */
    lengthvotes?: number;
    /** Integer, sum of the user’s play time votes, in minutes. */
    lengthvotes_sum?: number;
}

export type RequestUserOptionalFields = 'lengthvotes' | 'lengthvotes_sum';

/**
 * The response object contains one key for each given parameter,
 * its value is either `null` if no such user was found or otherwise an object implementing the `User` interface.
 */
export type ResponseUser = Record<string, User | null>;