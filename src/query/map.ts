export class IndexMap extends Map<number, number> {
  /** Returns the deepest block level. */
  public depth() {
    return Math.max(...this.keys());
  }

  public index() {
    return this.get(this.depth());
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
