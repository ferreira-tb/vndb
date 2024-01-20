import type { QueryBuilder } from '.';
import type { QueryBuilderEndpoint, QueryBuilderPush } from '../types';

export class QueryBuilderOperator<T extends QueryBuilderEndpoint> {
  /** Alias for {@link QueryBuilderOperator.equal} */
  public declare readonly eq: QueryBuilder<T>;

  /** Equality operator (`=`). */
  public declare readonly equal: QueryBuilder<T>;

  /** Inequality operator (`!=`). */
  public declare readonly not: QueryBuilder<T>;

  /** Alias for {@link QueryBuilderOperator.greater} */
  public declare readonly gt: QueryBuilder<T>;

  /**  "Greater than" operator (`>`). */
  public declare readonly greater: QueryBuilder<T>;

  /** Alias for {@link QueryBuilderOperator.greaterOrEqual} */
  public declare readonly gte: QueryBuilder<T>;

  /** "Greater than or equal" operator (`>=`). */
  public declare readonly greaterOrEqual: QueryBuilder<T>;

  /** Alias for {@link QueryBuilderOperator.lower} */
  public declare readonly lt: QueryBuilder<T>;

  /** "Lower than" operator (`<`). */
  public declare readonly lower: QueryBuilder<T>;

  /** Alias for {@link QueryBuilderOperator.lowerOrEqual} */
  public declare readonly lte: QueryBuilder<T>;

  /** "Lower than or equal" operator (`<=`). */
  public declare readonly lowerOrEqual: QueryBuilder<T>;

  constructor(builder: QueryBuilder<T>, push: QueryBuilderPush) {
    // Operators follow a filter.
    return new Proxy(this, {
      get: (_, key) => {
        push(QueryBuilderOperator.parse(key), null, (i) => i + 1);
        return builder;
      }
    });
  }

  private static parse(key: string | symbol) {
    switch (key) {
      case 'eq':
        return '=';
      case 'equal':
        return '=';
      case 'not':
        return '!=';
      case 'gt':
        return '>';
      case 'greater':
        return '>';
      case 'gte':
        return '>=';
      case 'greaterOrEqual':
        return '>=';
      case 'lt':
        return '<';
      case 'lower':
        return '<';
      case 'lte':
        return '<=';
      case 'lowerOrEqual':
        return '<=';
      default:
        throw new Error('Invalid key');
    }
  }
}
