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
}
