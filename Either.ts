export default class Either<L, R> {
  // Bifunctor
  static left<L, R>(l: L): Either<L, R> {
    return new Either<L, R>({ tag: "left", value: l });
  }

  static right<L, R>(r: R): Either<L, R> {
    return new Either<L, R>({ tag: "right", value: r });
  }

  constructor(
    private readonly data:
      | { tag: "left"; value: L }
      | { tag: "right"; value: R }
  ) {}
}
