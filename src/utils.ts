import type { MaybeArray } from '../typings';

export function toArray<T>(value: MaybeArray<T>) {
    return Array.isArray(value) ? value : [value];
}