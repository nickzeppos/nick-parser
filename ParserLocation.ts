export default class ParserLocation {
  constructor(
    private readonly contents: string,
    private readonly nextIndex: number = 0
  ) {}

  remaining(): string {
    return this.contents.slice(this.nextIndex);
  }

  advance(n: number): ParserLocation {
    return new ParserLocation(this.contents, this.nextIndex + n);
  }

  peek(count: number) {
    return this.contents.slice(this.nextIndex, this.nextIndex + count);
  }

  getindex(): number {
    return this.nextIndex;
  }
}
