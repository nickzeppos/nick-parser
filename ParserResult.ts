import Either from "./Either.ts";
import ParserError from "./ParserError.ts";
import ParserSuccess from "./ParserSuccess.ts";

export default class ParserResult<A> {
  constructor(private readonly data: Either<ParserError, ParserSuccess<A>>) {}

  static success<A>(a: A, consumedCount: number): ParserResult<A> {
    return new ParserResult(Either.right(new ParserSuccess(a, consumedCount)));
  }

  static error<A>(error: ParserError): ParserResult<A> {
    return new ParserResult(Either.left(error));
  }

  // Methods for expressing the nature of the result
  isSuccess(): boolean {
    // Operating on this.data
    // We want to return based on whether or not data represents a successful parse
    // data is an Either, where the right-handed side is success, while the left is error
    // So we want to return based on whether or not data is right handed (i.e., true if right, else false)
    return this.data.isRight()
  }

  // Methods for getting data out
  getData(): ParserSuccess<A> {
    if (this.isSuccess()) {
      return this.data.getRight()
    }
    throw new Error('Tried getting data out of an unsuccessful parser result')
  }
}
