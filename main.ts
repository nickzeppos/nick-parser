import Parser from "./parser.ts";

if (import.meta.main) {
  const string = "(1,2)";
  const parser = Parser.coordinate(); // Parser<Coordinate>
  const maybeCoordinate = parser.run(string);

  const fooParser = Parser.string("foo");
  fooParser.run("foo"); // returns 'foo'
  fooParser.run("bar"); // returns an error or something

  const fooBarParser = Parser.string("foo").and(Parser.string("bar")); // Parser<['foo', 'bar']>
  fooBarParser.run("foobar"); // returns ['foo', 'bar']
  fooBarParser.run("bar"); // returns an error or something

  const fooOrBarParser = Parser.string("foo").or(Parser.string("bar"));
  fooOrBarParser.run("foo"); // 'foo'
  fooOrBarParser.run("bar"); // fails if greedy
  fooOrBarParser.run("foobar"); // 'foo' ('bar' remains unconsumed)
  fooOrBarParser.attempt("bar"); // 'bar'
  // error can be "committed" or "uncommitted"
  // greedy by default (committed) for perf reasons
  // you need to explicitly back out with "attempt"
}
