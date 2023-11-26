import type { MaybeArray } from '../../types';

export function toArray<T>(value: MaybeArray<T>) {
  return Array.isArray(value) ? value : [value];
}
