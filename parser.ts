import Either from "./Either.ts";
import Maybe from "./Maybe.ts";
import ParserError from "./ParserError.ts";
import ParserLocation from "./ParserLocation.ts";
import ParserResult from "./ParserResult.ts";

export type Coordinate = {
  x: number;
  y: number;
};

// Parser is a type constructor
// has a type hole we fill

// What is a Functor?
// a unary type constructor that
// has a function `fmap` that satisfies the Functor laws
// - identity (if you give fmap id and an instance of f a, you get back the same instance of f a)
//   id : x -> x
//   fmap : Functor f => (a -> b) -> f a -> f b
//                       a1          a2     r
//   fmap id : f a -> f a
//   fmap id fa : f a
//   fmap id fa = fa
// - composition
//   TODO: left up to reader
export default class Parser<A> {
  constructor(public readonly _run: (loc: ParserLocation) => ParserResult<A>) {}

  // Methods
  // root run method
  run(s: string): ParserResult<A> {
    return this._run(new ParserLocation(s));
  }

  attempt(): Parser<A> {
    throw new Error("not implemented");
  }

  // Compound
  static coordinate(): Parser<Coordinate> {
    throw new Error("not implemented");
  }

  // Primitives
  static string<S extends string = string>(str: S): Parser<S> {
    return new Parser((loc: ParserLocation) =>
      loc.remaining().startsWith(str)
        ? ParserResult.success(str, str.length)
        : ParserResult.error(new ParserError(true))
    );
  }

  optional(): Parser<Maybe<A>> {
    // TODO: try to implement this
    throw new Error("not implemented");
  }

  many(): Parser<A[]> {
    throw new Error("not implemented");
  }

  manyAtLeast1(): Parser<[A, ...A[]]> {
    throw new Error("not implemented");
  }

  listOfN(n: number): Parser<A[]> {
    throw new Error("not implemented");
  }

  // Combinators
  and<B>(pb: Parser<B>): Parser<[A, B]> {
    throw new Error("not implemented");
  }

  or<B>(pb: Parser<B>): Parser<Either<A, B>> {
    throw new Error("not implemented");
  }
}
