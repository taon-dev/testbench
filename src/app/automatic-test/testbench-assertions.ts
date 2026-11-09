export abstract class TestbenchAssertions {
  protected assert(condition: unknown, message = 'Assertion failed'): asserts condition {
    if (!condition) throw new Error(message);
  }

  protected assertEqual<T>(actual: T, expected: T): void {
    if (actual !== expected) {
      throw new Error(
        `Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
      );
    }
  }
}
