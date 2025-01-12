import Parser from "./parser.ts";

// @ts-ignore: Property 'main' does not exist on type 'ImportMeta'.
if (import.meta.main) {


  const fooParser = Parser.string("foo") // Parser<'foo'>
  fooParser.run("foo"); // returns 'foo'
  fooParser.run("bar"); // returns an error or something

  const optionalFooParser = fooParser.optional() // Parser<Maybe<'foo'>>
  optionalFooParser.run('foo') // returns 'foo'
  optionalFooParser.run('bar') // returns nothing

  const elevenParser = Parser.specificNumber(11) // Parser<11>
  elevenParser.run('11') // returns 11
  elevenParser.run('112') // returns 11
  elevenParser.run('12') // returns an error
  elevenParser.run('abc') // returns an error

  const anyNumberParser = Parser.anyNumber() // Parser<number>
  anyNumberParser.run('39') // returns 39
  anyNumberParser.run('39abc') // returns 39
  anyNumberParser.run('abc') // returns an error
  anyNumberParser.run('abc39') // returns an error
  
  

  
  // console.log(yesStill)
  // console.log(no)
  
  // const parser = Parser.coordinate(); // Parser<Coordinate>
  // const maybeCoordinate = parser.run(string);

  

  // const fooBarParser = Parser.string("foo").and(Parser.string("bar")); // Parser<['foo', 'bar']>
  // fooBarParser.run("foobar"); // returns ['foo', 'bar']
  // fooBarParser.run("bar"); // returns an error or something

  // const fooOrBarParser = Parser.string("foo").or(Parser.string("bar"));
  // fooOrBarParser.run("foo"); // 'foo'
  // fooOrBarParser.run("bar"); // fails if greedy
  // fooOrBarParser.run("foobar"); // 'foo' ('bar' remains unconsumed)
  

  // error can be "committed" or "uncommitted"
  // greedy by default (committed) for perf reasons
  // you need to explicitly back out with "attempt"
}
