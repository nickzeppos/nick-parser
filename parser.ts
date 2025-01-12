import Either from "./Either.ts";
import Maybe from "./Maybe.ts";
import ParserError from "./ParserError.ts";
import ParserLocation from "./ParserLocation.ts";
import ParserResult from "./ParserResult.ts";

export type Coordinate = {
  x: number;
  y: number;
};

// What is a type constructor?
// - thing that takes a type (or types) and constructs a new type.

// What is a functor?
// - a unary type constructor!
// - so, Parser is a type constructor that will accept one type (A). So Parser is a Functor.

// A functor:
// - is a unary type constructor, e.g., Functor<A>.
// - has a function `fmap` that satisfies the Functor laws, identity and composition.
// - fmap you might think of as a function that allows you to lift and operate on the inner value of a functor without disturbing the context its contents
//  - i.e., given F<A>, operate on A while preserving F
// - and the laws of identity and composition, provided fmap satisfies them, ensures that this can actually be done

//
// identity
//
// provided:
// Functor f
// f's fmap is fmap
// fn is a: A -> b: B
// fmap(fn, fa) -> fb
// in ts, it might look like this, provided type Functor
// const fmap = <A,B>(fn: (a: A) => B, fa: Functor<A>) => Functor<B>
//
// So, in the identity case, we are going to pass the function id in as the fn arg
// const id = <T>(x: T): T => x
// const fmap = <A,B>(fn: (a: A) => B, fa: Functor<A>) => Functor<B>
// fmap(id, fa) => fa
//
// For your own intuition, you might think about B as basically being the ReturnType<typeof Parameter<fmap, 'fn'>> or something like that
// Don't need to get hung up on the change over from f b to f a in the fn = id case, this is allowed/inferred because id is polymorphic
//
// Just to get used to some syntax more closely associated w/ FP languages (e.g., idris)
// In a "moving things left-to-right" kind of way...
// id: x => x
// fmap : Functor f => (a -> b) -> f a -> f b
// fmap id : f a -> f b
// fmap id f a : f a
// fmap id f a = f a

//
// composition
//
// provided:
// Functor f
// f's fmap is fmap
// function g: A -> B
// function h: B -> C
// compose: h . g
// law of composition says that fmap must satisfy
// fmap (h . g) = fmap h . fmap g
//
// We take our fmap from the identity case, above
// const fmap = <A,B>(fn: (a: A) => B, fa: Functor<A>) => Functor<B>
//
// define two functions
// const g: G = <A,B>(a: A) => B
// const h: H = <B,C>(b: B) => C
// and let's define compose
// const compose = <A, B, C>(
//  h: (b: B) => C,
//  g: (a: A) => B):
//  (a: A) => C =>
//  h(g(a))
//
// such that we can define hg as
// const hg = compose(h,g)
//
// and the following is true of fmap
// fmap(hg, fa) === fmap(h, fmap(g, fa))
// That is, given two operations, h and g, and given the desire to apply them to Functor<A>, the following 2 cases are equivalent:
// 1. Operate inside the Functor context once, i.e., lift A, apply g, get B, apply h, get C, put C back in to get Functor<C>
// 2. Operate inside the Functor context over and over, i.e., lift A, apply g, put B back in to get Functor<B>, lift B, apply h, put C back in to get Functor<C>
// the outcome of both procedures is the same, both return Functor<C>
//
// And again, just to get used to some more FP like syntax, moving things "left-to-right"...
// (.) : (b -> c) -> (a -> b) -> (a -> c)
// fmap : Functor f => (a -> b) -> f a -> f b

// fmap compose fa : f b
// fmap compose f a = f c

/*
a2b : a -> b
b2c : b -> c
fmap b2c : f b -> f c
fmap a2b : f a -> f b

fmap (b2c . a2b) = fmap b2c . fmap a2b

left side:
(.) : ...
(.) b2c : ...
(.) b2c a2b : ...
b2c . a2b : ...
fmap (b2c . a2b) : f a -> f c

right side:
(.) : (b -> c) -> (a -> b) -> (a -> c)
(.) (fmap b2c) : (a -> f b) -> (a -> f c)
(.) (fmap b2c) (fmap a2b) : f a -> f c
fmap b2c . fmap a2b : f a -> f c
*/

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

  // Static methods, those things which belong to Parser itself.
  //
  // Primitives
  static succeed<B>(value: B): Parser<B> {
    // AKA Applicative's Pure
    return new Parser(() => ParserResult.success(value, 0));
  }

  static string<S extends string = string>(str: S): Parser<S> {
    return new Parser((loc: ParserLocation) =>
      loc.remaining().startsWith(str)
        ? ParserResult.success(str, str.length)
        : ParserResult.error(new ParserError(true))
    );
  }

  static specificNumber<N extends number = number>(n: N): Parser<N> {
    return new Parser((loc: ParserLocation) =>
      loc.remaining().startsWith(String(n))
        ? ParserResult.success(n, String(n).length)
        : ParserResult.error(new ParserError(true))
    );
  }

  private static readonly numbers: Array<string> = [..."0123456789"];

  static anyNumber(): Parser<number> {
    return new Parser((loc: ParserLocation) => {
      // buffer we're going to tack valid numbers onto
      let buffer = "";

      // We're going to peek in one character at a time
      while (true) {
        const char = loc.peek(1);

        // If it's in our numbers array, add it to buffer and advance 1 character
        if (Parser.numbers.includes(char)) {
          buffer += char;
          loc = loc.advance(1);

          // If it's not in our numbers array, break
        } else {
          break;
        }
      }

      // If there's anything in the buffer, it's a success
      if (buffer.length !== 0)
        return ParserResult.success(Number(buffer), loc.getindex());

      // If there's nothing there, it's an error
      return ParserResult.error(new ParserError(true));
    });
  }

  // Compound
  static coordinate(): Parser<Coordinate> {
    throw new Error("not implemented");
  }

  // There may or may not be A
  optional(): Parser<Maybe<A>> {
    return this.map(Maybe.just) // success
      .or<Maybe<A>>(Parser.succeed(Maybe.nothing<A>())) // error
      .map((result) => result.unwrap()); // merge types for both branches
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

  // Functor
  map<B>(f: (a: A) => B): Parser<B> {
    return new Parser((loc) => this._run(loc).mapSuccess(f));
  }
}

// interface Functor<A> {
//   fmap: <B>(fn: (a: A) => B) => Functor<B>
// }

// const id = <T>(x: T): T => x

// class Maybe<A> implements Functor<A> {
//   private constructor(private value: A | null) {}

//   static just<A>(value: A): Maybe<A> {
//     return new Maybe(value);
//   }

//   static nothing<A>(): Maybe<A> {
//     return new Maybe<A>(null);
//   }

//   fmap<B>(fn: (a: A) => B): Maybe<B> {
//     if (this.value === null) return Maybe.nothing();
//     return Maybe.just(fn(this.value));
//   }
// }

// const maybeVal = Maybe.just(100)
// const identity = maybeVal.fmap(id)
// TS infers A = B
