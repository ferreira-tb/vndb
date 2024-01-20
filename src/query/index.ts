import { IndexMap } from './map';
import { QueryBuilderOperator } from './operator';
import type {
  QueryBuilderBase,
  QueryBuilderEndpoint,
  QueryBuilderFilter,
  QueryBuilderOptions
} from '../types';

export class QueryBuilder<T extends QueryBuilderEndpoint>
  implements QueryBuilderBase<T>
{
  readonly #filters: any[] = [];
  readonly #indexMap: IndexMap;
  readonly #operator: QueryBuilderOperator<T>;

  public readonly compactFilters: string | null;
  public readonly options: Omit<QueryBuilderOptions<T>, 'filters'>;

  constructor(options: QueryBuilderOptions<T> = {}) {
    const { filters, ...members } = options;
    this.options = members;

    if (typeof filters === 'string' && filters.length > 0) {
      this.compactFilters = filters;
    } else {
      this.compactFilters = null;
      if (Array.isArray(filters) && filters.length > 0) {
        this.#filters.push(...filters);
      }
    }

    this.#indexMap = new IndexMap([[0, this.#filters.length]]);
    this.#operator = new QueryBuilderOperator(this, this.#push.bind(this));
  }

  /** Used to combine different filters. */
  public readonly and: (
    cb: (builder: QueryBuilderBase<T>) => void
  ) => QueryBuilder<T> = this.#proxify(this.#and.bind(this));

  /** Used to combine different filters. */
  public readonly or: (
    cb: (builder: QueryBuilderBase<T>) => void
  ) => QueryBuilder<T> = this.#proxify(this.#or.bind(this));

  /** Alias for {@link QueryBuilder.filter} */
  public readonly f: (name: QueryBuilderFilter<T>) => QueryBuilderOperator<T> =
    this.#proxify(this.#filter.bind(this));

  /** Starts building a filter block (like ["id", "=", "v17"]). */
  public readonly filter: (
    name: QueryBuilderFilter<T>
  ) => QueryBuilderOperator<T> = this.#proxify(this.#filter.bind(this));

  /** Alias for {@link QueryBuilder.value} */
  public readonly v: (value: any) => QueryBuilder<T> = this.#proxify(
    this.#value.bind(this)
  );

  /**
   * Declares a value.
   * Should ONLY be used after operators (like "equal" or "greater").
   *
   * For example, in the block `["id", "=", "v17"]`, the value would be `"v17"`.
   */
  public readonly value: (value: any) => QueryBuilder<T> = this.#proxify(
    this.#value.bind(this)
  );

  public toArray(): any[] {
    return JSON.parse(this.toJSON(0));
  }

  public toJSON(space: string | number = 4) {
    return JSON.stringify(this.#sanitizeFilters(), null, space);
  }

  readonly #logicalCallback: QueryBuilderBase<T> = {
    and: this.#and.bind(this),
    or: this.#or.bind(this),
    f: this.#filter.bind(this),
    filter: this.#filter.bind(this),
    v: this.#value.bind(this),
    value: this.#value.bind(this)
  };

  #and(cb: (builder: QueryBuilderBase<T>) => void) {
    this.#pushLogicalOperator('and');
    cb(this.#logicalCallback);
    this.#reduceDepth();
    return this;
  }

  #filter(name: QueryBuilderFilter<T>) {
    // Filters always start a new block.
    // Therefore, the value of the next index will always be 1.
    // e.g. ["lang", "=", "en"]
    this.#push(
      [name],
      (d) => d + 1,
      () => 1
    );
    return this.#operator;
  }

  #or(cb: (builder: QueryBuilderBase<T>) => void) {
    this.#pushLogicalOperator('or');
    cb(this.#logicalCallback);
    this.#reduceDepth();
    return this;
  }

  #value(value: any) {
    // Values follow operators.
    // They will close the current block and decrease the depth level.
    const depth = this.#indexMap.depth();
    const parentIndex = this.#indexMap.get(depth - 1);
    this.#push(
      value,
      (d) => d - 1,
      () => parentIndex + 1
    );
    return this;
  }

  #goToCurrentDepth() {
    const keys = Array.from(this.#indexMap.keys()).sort((a, b) => a - b);
    keys.pop();

    let currentArray = this.#filters;
    for (const key of keys) {
      const arrayIndex = this.#indexMap.get(key);
      currentArray = currentArray[arrayIndex];
    }

    return currentArray;
  }

  #proxify<P extends (...args: any[]) => any>(fn: P) {
    return new Proxy(fn.bind(this), {
      apply: (target, thisArg, argumentsList) => {
        if (this.compactFilters) {
          throw new Error(
            'Builder is locked: did you already set some compact filters?'
          );
        }

        return Reflect.apply(target, thisArg, argumentsList);
      }
    });
  }

  #push(
    value: any,
    depthFn: ((depth: number) => number) | null,
    indexFn: ((index: number) => number) | null
  ) {
    const depth = this.#indexMap.depth();
    const index = this.#indexMap.index();
    const array = this.#goToCurrentDepth();
    array[index] = value;

    this.#setIndex(depthFn, indexFn, depth, index);
  }

  #pushLogicalOperator(operator: 'and' | 'or') {
    // This kind of operator normally starts a new block by inserting itself at the beginning of it afterwards.
    // However, if the root array is empty, it should not start a block.
    // The depth must not increase in such cases, but the index should.
    const op = this.#filters.length === 0 ? operator : [operator];
    this.#push(
      op,
      (d) => (Array.isArray(op) ? d + 1 : d),
      (i) => (Array.isArray(op) ? 1 : i + 1)
    );
  }

  #reduceDepth() {
    const depth = this.#indexMap.depth();
    const reduceBy = depth === 0 ? 0 : depth - 1;
    const parentIndex = this.#indexMap.get(reduceBy);
    this.#setIndex(
      (d) => d - 1,
      () => parentIndex + 1
    );
  }

  #setIndex(
    depthFn: ((depth: number) => number) | null,
    indexFn: ((index: number) => number) | null,
    depth = this.#indexMap.depth(),
    index = this.#indexMap.index()
  ) {
    this.#indexMap.set(
      depthFn ? depthFn(depth) : depth,
      indexFn ? indexFn(index) : index
    );
  }

  #sanitizeFilters() {
    let filters = this.#filters;
    if (filters.length === 1 && Array.isArray(filters[0])) {
      filters = filters[0];
    }

    if (Array.isArray(filters) && filters.every((f) => Array.isArray(f))) {
      throw new TypeError('Every root value is an array.');
    }

    return filters;
  }
}

export type { IndexMap, QueryBuilderOperator };
