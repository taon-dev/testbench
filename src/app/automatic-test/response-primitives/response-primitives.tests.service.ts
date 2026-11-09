import { Injectable, inject } from '@angular/core';
import { TestbenchTest } from '../testbench-test-ids';
import { TestBenchApiService } from '../testbench.api.service';
import { TestbenchAssertions } from '../testbench-assertions';

@Injectable({ providedIn: 'root' })
export class ResponsePrimitiveTests extends TestbenchAssertions {
  private readonly testBenchApiService = inject(TestBenchApiService);

  private readonly methods: Record<string, () => Promise<void>> = {
    [TestbenchTest.getBoolean]: () => this[TestbenchTest.getBoolean](),
    [TestbenchTest.getNumber]: () => this[TestbenchTest.getNumber](),
    [TestbenchTest.getZero]: () => this[TestbenchTest.getZero](),
    [TestbenchTest.getString]: () => this[TestbenchTest.getString](),
    [TestbenchTest.getEmptyString]: () => this[TestbenchTest.getEmptyString](),
    [TestbenchTest.getNull]: () => this[TestbenchTest.getNull](),
    [TestbenchTest.getStringArray]: () => this[TestbenchTest.getStringArray](),
    [TestbenchTest.getNumberArray]: () => this[TestbenchTest.getNumberArray](),
    [TestbenchTest.getObject]: () => this[TestbenchTest.getObject](),
    [TestbenchTest.getMixedObject]: () => this[TestbenchTest.getMixedObject](),
    [TestbenchTest.getSerializationEdgeCases]: () => this[TestbenchTest.getSerializationEdgeCases](),
  };

  run(id: string): Promise<void> {
    const test = this.methods[id];
    if (!test) throw new Error(`Test "${id}" is not part of ResponsePrimitiveTests.`);
    return test();
  }

  async [TestbenchTest.getBoolean](): Promise<void> {
    const data =
      await this.testBenchApiService.responsePrimitives[TestbenchTest.getBoolean]().request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.getNumber](): Promise<void> {
    const data =
      await this.testBenchApiService.responsePrimitives[TestbenchTest.getNumber]().request!();

    this.assertEqual(data.body.numericValue, 123.456);
  }

  async [TestbenchTest.getZero](): Promise<void> {
    const data =
      await this.testBenchApiService.responsePrimitives[TestbenchTest.getZero]().request!();

    this.assertEqual(data.body.numericValue, 0);
  }

  async [TestbenchTest.getString](): Promise<void> {
    const data =
      await this.testBenchApiService.responsePrimitives[TestbenchTest.getString]().request!();

    this.assertEqual(data.body.text, 'hello from Taon backend');
  }

  async [TestbenchTest.getEmptyString](): Promise<void> {
    const data =
      await this.testBenchApiService.responsePrimitives[TestbenchTest.getEmptyString]().request!();

    this.assertEqual(data.body.text, '');
  }

  async [TestbenchTest.getNull](): Promise<void> {
    const data =
      await this.testBenchApiService.responsePrimitives[TestbenchTest.getNull]().request!();

    this.assertEqual(data.body.json, null);
  }

  async [TestbenchTest.getStringArray](): Promise<void> {
    const data =
      await this.testBenchApiService.responsePrimitives[TestbenchTest.getStringArray]().request!();

    const value = data.body.json;

    this.assert(Array.isArray(value), 'Expected value to be an array');

    this.assertEqual(value.length, 3);
    this.assertEqual(value[0], 'one');
    this.assertEqual(value[1], 'two');
    this.assertEqual(value[2], 'three');
  }

  async [TestbenchTest.getNumberArray](): Promise<void> {
    const data =
      await this.testBenchApiService.responsePrimitives[TestbenchTest.getNumberArray]().request!();

    const value = data.body.json;

    this.assert(Array.isArray(value), 'Expected value to be an array');

    this.assertEqual(value.length, 3);
    this.assertEqual(value[0], 10);
    this.assertEqual(value[1], 20);
    this.assertEqual(value[2], 30);
  }

  async [TestbenchTest.getObject](): Promise<void> {
    const data =
      await this.testBenchApiService.responsePrimitives[TestbenchTest.getObject]().request!();

    const value = data.body.json;

    this.assertEqual(value.name, 'test-object');
    this.assertEqual(value.enabled, true);
    this.assertEqual(value.count, 123);
  }

  async [TestbenchTest.getMixedObject](): Promise<void> {
    const data =
      await this.testBenchApiService.responsePrimitives[TestbenchTest.getMixedObject]().request!();

    const value = data.body.json;

    this.assertEqual(value.boolean, true);
    this.assertEqual(value.number, 123);
    this.assertEqual(value.string, 'hello');

    this.assert(Array.isArray(value.array), 'Expected nested array');

    this.assertEqual(value.nested.foo, 'bar');
  }

  async [TestbenchTest.getSerializationEdgeCases](): Promise<void> {
    const data =
      await this.testBenchApiService.responsePrimitives[TestbenchTest.getSerializationEdgeCases]().request!();

    const value = data.body.json;
    this.assertEqual(value.booleanValues[0], true);
    this.assertEqual(value.booleanValues[1], false);
    this.assertEqual(value.numbers[0], 0);
    this.assertEqual(value.numbers[1], -12);
    this.assertEqual(value.numbers[2], 123.456);
    this.assertEqual(value.textValues[0], '');
    this.assertEqual(value.textValues[1], '雪だるま ☃️ 🚀');
    this.assertEqual(value.textValues[2], 'special: & = ? # % +');
    this.assertEqual(value.textValues[3], '123');
    this.assertEqual(value.textValues[4], 'false');
    this.assertEqual(value.textValues[5], '{"value":1}');
    this.assert(Array.isArray(value.emptyArray), 'Expected an empty array');
    this.assertEqual(value.emptyArray.length, 0);
    this.assertEqual(Object.keys(value.emptyObject).length, 0);
    this.assertEqual(value.nested.values[0].value, 'deep value');
  }
}
