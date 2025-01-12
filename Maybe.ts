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

  /*
  Law 1: identity
    this.map(id) => Maybe<A>
    Maybe.just(x).map(id) = Maybe.just(x)
    Maybe.nothing().map(id) = Maybe.nothing()
  
  Law 2: composition
    const a2b: (a: A) => B
    const b2c: (b: B) => C
    const compose: <A,B,C>(b2c: B => C, a2b: A => B) => (a: A) => C

    left side:
    compose(b2c, a2b): A => C
    this.map(compose(b2c, a2b)): Maybe<C>

    right side:
    const maybeMapPartial<A,B>(f: A => B): (ma: Maybe<A>) => Maybe<B>

    maybeMapPartial(a2b): (ma: Maybe<A>) => Maybe<B>
    maybeMapPartial(b2c): (mb: Maybe<B>) => Maybe<C>
    compose(maybeMapPartial(b2c), maybeMapPartial(a2b)): (ma: Maybe<A>) => Maybe<C>
  */
  map<B>(f: (a: A) => B): Maybe<B> {
    return this.data.tag === "just"
      ? Maybe.just(f(this.data.value))
      : Maybe.nothing();
  }
}
