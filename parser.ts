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
// compose: (h . g)
// law of composition says that fmap must satisfy
// fmap((h . g), fa) === fmap(h, fmap(g, fa))
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
// compose : (b -> c) -> (a -> b) -> (a -> c)
// fmap : Functor f => (a -> b) -> f a -> f b
// fmap compose : f a -> f b
// fmap compose f a : f c
// fmap compose f a = f c


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
    // 
    // The context in which this is called is that there exists some Parser<A>
    // And we're trying to modify it's behavior to create Parser<Maybe<A>>
    // 
    // So what do we need to do?
    // Create a new parser, which, inside
    // Runs the "current" parser, via this._run
    // If the current parser succeeds, the new parser will return a successful parser result wrapped around a Maybe.just
    // If the current parser fails, the new parser will return a successful parser result wrapped around a Maybe.nothing
    const newParser = new Parser<Maybe<A>>((loc: ParserLocation) => {
      // run current parser
      const incomingParserResult = this._run(loc)
      
      // fail case, success w/ maybe nothing
      if (!incomingParserResult.isSuccess()) {
        return ParserResult.success(Maybe.nothing(), 0)
      }

      // success case, success with maybe.just
      const { data, consumed } = incomingParserResult.getData()
      return ParserResult.success(Maybe.just(data), consumed)
    })
    
    return newParser
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