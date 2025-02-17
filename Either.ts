export default class Either<L, R> {
  constructor(
    private readonly data:
      | { tag: "left"; value: L }
      | { tag: "right"; value: R }
  ) {}
  // Bifunctor
  static left<L, R>(l: L): Either<L, R> {
    return new Either<L, R>({ tag: "left", value: l });
  }

  static right<L, R>(r: R): Either<L, R> {
    return new Either<L, R>({ tag: "right", value: r });
  }

  // If I use a type guard on the return type here that that asserts R.
  // If this were to be isRight(): boolean, then in getRight() i would need to cast return as R.
  // I'm pretty sure the body of the function needs to return a boolean for this to actually work.
  // TS needs a boolean condition for "narrowing" the type.
  // Returning just "right" here throws type error suggesting as much.
  isRight(): this is Either<never, R> {
    return this.data.tag === "right";
  }

  getRight(): R {
    if (this.isRight()) {
      return this.data.value;
    } else {
      throw new Error();
    }
  }

  isLeft(): this is Either<L, never> {
    return this.data.tag === "left";
  }

  getLeft(): L {
    if (this.isLeft()) {
      return this.data.value;
    } else {
      throw new Error();
    }
  }

  match<T>(matchers: { left: (l: L) => T; right: (r: R) => T }): T {
    if (this.data.tag === "left") {
      return matchers.left(this.data.value);
    } else {
      return matchers.right(this.data.value);
    }
  }

  unwrap(): L | R {
    return this.match<L | R>({ left: (l) => l, right: (r) => r });
  }
}
