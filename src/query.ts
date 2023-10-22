import type {
    DeepArrayValue,
    MaybeArray,
    RequestQuery,
    RequestQueryEntryType,
    RequestQueryFiltersVisualNovel
} from '../typings';

type QueryBuilderAndOrParams<T extends RequestQueryEntryType> = {
    f: QueryBuilder<T>['_filter'];
    filter: QueryBuilder<T>['_filter'];
}

export class QueryBuilder<T extends RequestQueryEntryType> {
    private readonly filters = new DeepArray<any>(null, 0);
    private readonly indexMap = new IndexMap([[0, 0]]);
    
    private readonly operator: QueryBuilderOperator<T>;
    private readonly options: Omit<RequestQuery, 'filters'>;
    private readonly compactFilters: string | null;

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

        this.operator = new QueryBuilderOperator(this, this.filters);
    }

    public readonly and: QueryBuilder<T>['_and'] = this.proxify(this._and);
    public readonly f: QueryBuilder<T>['_filter'] = this.proxify(this._filter);
    public readonly filter: QueryBuilder<T>['_filter'] = this.proxify(this._filter);

    private _and(cb: (builder: QueryBuilderAndOrParams<T>) => void) {

    }

    private _filter(
        name: T extends 'vn' ? RequestQueryFiltersVisualNovel : never
    ) {
        if (this.filters.length === 0 || this.indexMap.isStart()) {
            this.filters.push([name]);
            this.indexMap.clear();
            this.indexMap.set(0, 1);
        } else if (this.indexMap.depth() === 0) {
            // Starts building a filter on the current index.
            this.filters.splice(this.indexMap.index(), 0, [name]);
            this.indexMap.set(0, 2);
        } else {

        }

        return this.operator;
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

    public toJSON() {
        return JSON.stringify(this.filters, null, 4);
    }
}

class QueryBuilderOperator<T extends RequestQueryEntryType> {
    declare public readonly equal: QueryBuilder<T>;

    constructor(builder: QueryBuilder<T>, filters: any[]) {
        return new Proxy(this, {
            get: (target, key, receiver) => {
                

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
            default: throw new Error('Invalid key');
        }
    }
}

class DeepArray<T> extends Array<DeepArrayValue<T>> { 
    constructor(
        /**
         * Indicates the index at which the `DeepArray` is located within the array that contains it.
         * 
         * If the `DeepArray` is not inside an array, `parentIndex` will be `null`.
         */
        public readonly parentIndex: number | null,
        public readonly depth: number,
        ...args: any[]
    ) {
        super(...args);
        
        return new Proxy(this, {
            set: (target, key, value) => {
                if (typeof key !== 'string') return false;

                const index = Number.parseInt(key);
                if (Number.isInteger(index) && index >= 0) {
                    const item = this.mapDepth(index, value);
                    return Reflect.set(target, index, item);
                } else {
                    return Reflect.set(target, key, value);
                }   
            }
        });
    }

    private mapDepth(index: number, value: MaybeArray<T>) {
        if (!Array.isArray(value)) return this.wrap(this.depth, value);
        const array = value instanceof DeepArray ? DeepArray.toArray(value) : value;
        return new DeepArray(
            index,
            this.depth + 1,
            ...array.map((i) => this.wrap(this.depth, i))
        );
    }

    public override push(...values: any[]) {
        return super.push(...values);
    }

    public override splice(start: number, deleteCount: number, ...values: any[]) {
        return super.splice(start, deleteCount, ...values);
    }

    private wrap(depth: number, value: T): DeepArrayValue<T> {
        return { depth, value };
    }

    public static toArray(array: DeepArray<any>): any[] {
        return new Array(...array.map(({ value }) => {
            return value instanceof DeepArray ? DeepArray.toArray(value) : value;
        }));
    }
}

class IndexMap extends Map<number, number> {
    public depth() {
        return Math.max(...this.keys());
    }

    public index() {
        return this.get(this.depth())!;
    }

    public isStart() {
        const depth = this.depth();
        if (depth !== 0) return false;
        return this.get(depth) === 0;
    }

    public override set(key: number, value: number) {
        return super.set(key, value);
    }
}