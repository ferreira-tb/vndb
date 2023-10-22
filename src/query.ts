import type {
    QueryBuilderBase,
    QueryBuilderBaseFilterName,
    RequestQuery,
    RequestQueryEntryType
} from '../typings';

export class QueryBuilder<T extends RequestQueryEntryType> implements QueryBuilderBase<T> {
    private readonly filters: any[] = [];
    private readonly indexMap: IndexMap;
    
    private readonly operator: QueryBuilderOperator<T>;
    public readonly compactFilters: string | null;
    public readonly options: Omit<RequestQuery, 'filters'>;

    constructor(query: RequestQuery = {}) {
        const { filters, ...options } = query;
        this.options = options;

        if (typeof filters === 'string' && filters.length > 0) {
            this.compactFilters = filters;
        } else {
            this.compactFilters = null;
            if (Array.isArray(filters) && filters.length > 0) {
                this.filters.push(...filters);
            }
        }

        this.indexMap = new IndexMap([[0, this.filters.length]]);
        this.operator = new QueryBuilderOperator(this, this.push.bind(this));
    }

    public readonly and:(cb: (builder: QueryBuilderBase<T>) => void) => QueryBuilder<T> = this.proxify(this._and);
    public readonly or: (cb: (builder: QueryBuilderBase<T>) => void) => QueryBuilder<T> = this.proxify(this._or);
    public readonly f: (name: QueryBuilderBaseFilterName<T>) => QueryBuilderOperator<T> = this.proxify(this._filter);
    public readonly filter: (name: QueryBuilderBaseFilterName<T>) => QueryBuilderOperator<T> = this.proxify(this._filter);
    public readonly v: (value: any) => QueryBuilder<T> = this.proxify(this._value);
    public readonly value: (value: any) => QueryBuilder<T> = this.proxify(this._value);

    private readonly logicalCallback: QueryBuilderBase<T> = {
        and: this._and.bind(this),
        or: this._or.bind(this),
        f: this._filter.bind(this),
        filter: this._filter.bind(this),
        v: this._value.bind(this),
        value: this._value.bind(this)
    }

    private _and(cb: (builder: QueryBuilderBase<T>) => void) {
        this.pushLogicalOperator('and');
        cb(this.logicalCallback);
        this.reduceDepth();
        return this;
    }

    private _filter(name: QueryBuilderBaseFilterName<T>) {
        // Filters always start a new block.
        // Therefore, the value of the next index will always be 1.
        // e.g. ["lang", "=", "en"]
        this.push([name], (d) => d + 1, () => 1);
        return this.operator;
    }

    private _or(cb: (builder: QueryBuilderBase<T>) => void) {
        this.pushLogicalOperator('or');
        cb(this.logicalCallback);
        this.reduceDepth();
        return this;
    }

    private _value(value: any) {
        // Values follow operators.
        // They will close the current block and decrease the depth level.
        const depth = this.indexMap.depth();
        const parentIndex = this.indexMap.get(depth - 1);
        this.push(value, (d) => d - 1, () => parentIndex + 1);
        return this;
    }

    private goToCurrentDepth() {
        const keys = Array.from(this.indexMap.keys()).sort((a, b) => a - b);
        keys.pop();

        let currentArray = this.filters;
        for (const key of keys) {
            const arrayIndex = this.indexMap.get(key);
            currentArray = currentArray[arrayIndex];
        }

        return currentArray;
    }

    private proxify<T extends (...args: any[]) => any>(fn: T) {
        return new Proxy(fn.bind(this), {
            apply: (target, thisArg, argumentsList) => {
                if (this.compactFilters) {
                    throw new Error('Builder is locked: did you already set some compact filters?');
                }
                return Reflect.apply(target, thisArg, argumentsList);
            }
        })
    }

    private push(
        value: any,
        depthFn: ((depth: number) => number) | null,
        indexFn: ((index: number) => number) | null
    ) {
        const depth = this.indexMap.depth();
        const index = this.indexMap.index();
        const array = this.goToCurrentDepth();
        array[index] = value;

        this.setIndex(depthFn, indexFn, depth, index);
    }

    private pushLogicalOperator(operator: 'and' | 'or') {
        // This kind of operator normally starts a new block by inserting itself at the beginning of it afterwards.
        // However, if the root array is empty, it should not start a block.
        // The depth must not increase in such cases, but the index should.
        const op = this.filters.length === 0 ? operator : [operator];
        this.push(
            op,
            (d) => Array.isArray(op) ? d + 1 : d,
            (i) => Array.isArray(op) ? 1 : i + 1
        );
    }

    private reduceDepth() {
        const depth = this.indexMap.depth();
        const reduceBy = depth === 0 ? 0 : depth - 1;
        const parentIndex = this.indexMap.get(reduceBy);
        this.setIndex((d) => d - 1, () => parentIndex + 1);
    }

    private setIndex(
        depthFn: ((depth: number) => number) | null,
        indexFn: ((index: number) => number) | null,
        depth = this.indexMap.depth(),
        index = this.indexMap.index()
    ) {
        this.indexMap.set(
            depthFn ? depthFn(depth) : depth,
            indexFn ? indexFn(index) : index
        );
    }

    private sanitizeFilters() {
        let filters = this.filters;
        if (filters.length === 1 && Array.isArray(filters[0])) {
            filters = filters[0];
        }

        if (Array.isArray(filters) && filters.every((f) => Array.isArray(f))) {
            throw new TypeError('Every root value is an array.');
        }

        return filters;
    }

    public toArray(): any[] {
        return JSON.parse(this.toJSON(0));
    }

    public toJSON(space: string | number = 4) {
        return JSON.stringify(this.sanitizeFilters(), null, space);
    }
}

class QueryBuilderOperator<T extends RequestQueryEntryType> {
    declare public readonly eq: QueryBuilder<T>;
    declare public readonly equal: QueryBuilder<T>;
    declare public readonly not: QueryBuilder<T>;
    declare public readonly gt: QueryBuilder<T>;
    declare public readonly greater: QueryBuilder<T>;
    declare public readonly gte: QueryBuilder<T>;
    declare public readonly greaterOrEqual: QueryBuilder<T>;
    declare public readonly lt: QueryBuilder<T>;
    declare public readonly lower: QueryBuilder<T>;
    declare public readonly lte: QueryBuilder<T>;
    declare public readonly lowerOrEqual: QueryBuilder<T>;
    
    constructor(builder: QueryBuilder<T>, push: QueryBuilder<T>['push']) {
        // Operators follow a filter.
        return new Proxy(this, {
            get: (_target, key) => {
                push(this.parse(key), null, (i) => i + 1);
                return builder;
            }
        });
    }

    private parse(key: string | symbol) {
        switch (key) {
            case 'eq': return '=';
            case 'equal': return '=';
            case 'not': return '!=';
            case 'gt': return '>';
            case 'greater': return '>';
            case 'gte': return '>=';
            case 'greaterOrEqual': return '>=';
            case 'lt': return '<';
            case 'lower': return '<';
            case 'lte': return '<=';
            case 'lowerOrEqual': return '<=';
            default: throw new Error('Invalid key');
        }
    }
}

class IndexMap extends Map<number, number> {
    /** Returns the deepest block level. */
    public depth() {
        return Math.max(...this.keys());
    }

    public index() {
        return this.get(this.depth())!;
    }

    public override get(index: number) {
        const value = super.get(index);
        if (typeof value !== 'number') {
            throw new TypeError(`No such index: ${index}`);
        }

        return value;
    }

    public override set(depth: number, index: number) {
        while (this.depth() > depth) {
            this.delete(this.depth());
        }

        return super.set(depth, index);
    }
}

export type { QueryBuilderOperator, IndexMap };