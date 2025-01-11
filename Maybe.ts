export default class Maybe<A> {
  constructor(
    private readonly data: { tag: "nothing" } | { tag: "just"; value: A }
  ) {}

  static nothing<A>(): Maybe<A> {
    return new Maybe({ tag: "nothing" });
  }

  static just<A>(a: A): Maybe<A> {
    return new Maybe({ tag: "just", value: a });
  }
}
