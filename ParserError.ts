export default class ParserError {
  constructor(
    // whether or not we must "commit" to this error
    // a committed error comes from a "greedy" parser
    public readonly committed: boolean = true
  ) {}
}
