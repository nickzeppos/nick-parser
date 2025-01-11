import ParserLocation from "./ParserLocation.ts";

export default class ParserSuccess<A> {
  constructor(
    public readonly data: A,
    private readonly consumedCount: number
  ) {}

  hasConsumed(): boolean {
    return this.consumedCount > 0;
  }

  map<B>(f: (a: A) => B): ParserSuccess<B> {
    return new ParserSuccess(f(this.data), this.consumedCount);
  }

  advance(loc: ParserLocation): ParserLocation {
    return loc.advance(this.consumedCount);
  }

  append<B>(b: ParserSuccess<B>): ParserSuccess<[A, B]> {
    return new ParserSuccess(
      [this.data, b.data],
      this.consumedCount + b.consumedCount
    );
  }

  asSliceAt(loc: ParserLocation) {
    return new ParserSuccess(loc.peek(this.consumedCount), this.consumedCount);
  }

  get consumed(): number {
    return this.consumedCount;
  }
}
