import type { MaybeArray } from '../typings';

export function searchParams(name: string, value: MaybeArray<string>) {
    return new URLSearchParams(toArray(value).map((v) => [name, v]));
}

export function toArray<T>(value: MaybeArray<T>) {
    return Array.isArray(value) ? value : [value];
}