import { Injectable, inject } from '@angular/core';
import { TestbenchTest } from '../testbench-test-ids';
import { TestBenchApiService } from '../testbench.api.service';
import { TestbenchAssertions } from '../testbench-assertions';
import { TestBenchPerson } from '../testbench.models';

@Injectable({ providedIn: 'root' })
export class EntityMappingTests extends TestbenchAssertions {
  private readonly testBenchApiService = inject(TestBenchApiService);

  private readonly methods: Record<string, () => Promise<void>> = {
    [TestbenchTest.getMappedObject]: () => this[TestbenchTest.getMappedObject](),
    [TestbenchTest.getMappedObjectRawJson]: () => this[TestbenchTest.getMappedObjectRawJson](),
    [TestbenchTest.getMappedObjectArray]: () => this[TestbenchTest.getMappedObjectArray](),
    [TestbenchTest.getMappedObjectArrayRawJson]: () => this[TestbenchTest.getMappedObjectArrayRawJson](),
  };

  run(id: string): Promise<void> {
    const test = this.methods[id];
    if (!test) throw new Error(`Test "${id}" is not part of EntityMappingTests.`);
    return test();
  }

  async [TestbenchTest.getMappedObject](): Promise<void> {
    const data =
      await this.testBenchApiService.entityMapping[TestbenchTest.getMappedObject]().request!();

    const value = data.body.json;

    this.assert(
      value instanceof TestBenchPerson,
      'Expected body.json to be instance of TestBenchPerson',
    );

    this.assertEqual(value.name, 'Darek');
    this.assertEqual(value.age, 40);

    this.assertEqual(value.description, 'Darek (40)');
  }

  async [TestbenchTest.getMappedObjectRawJson](): Promise<void> {
    const data =
      await this.testBenchApiService.entityMapping[TestbenchTest.getMappedObjectRawJson]().request!();

    const value = data.body.rawJson;

    this.assert(
      !(value instanceof TestBenchPerson),
      'Expected body.rawJson NOT to be TestBenchPerson instance',
    );

    this.assertEqual((value as any).name, 'Darek');

    this.assertEqual((value as any).age, 40);
  }

  async [TestbenchTest.getMappedObjectArray](): Promise<void> {
    const data =
      await this.testBenchApiService.entityMapping[TestbenchTest.getMappedObjectArray]().request!();

    const value = data.body.json;

    this.assert(Array.isArray(value), 'Expected value to be an array');

    this.assertEqual(value.length, 2);

    this.assert(
      value[0] instanceof TestBenchPerson,
      'Expected first value to be TestBenchPerson',
    );

    this.assert(
      value[1] instanceof TestBenchPerson,
      'Expected second value to be TestBenchPerson',
    );

    this.assertEqual(value[0].description, 'John (30)');

    this.assertEqual(value[1].description, 'Alice (25)');
  }

  async [TestbenchTest.getMappedObjectArrayRawJson](): Promise<void> {
    const data =
      await this.testBenchApiService.entityMapping[TestbenchTest.getMappedObjectArrayRawJson]().request!();

    const value = data.body.rawJson;

    this.assert(Array.isArray(value), 'Expected rawJson value to be an array');

    this.assert(
      !(value[0] instanceof TestBenchPerson),
      'Expected rawJson value NOT to be TestBenchPerson',
    );

    this.assertEqual((value[0] as any).name, 'John');

    this.assertEqual((value[1] as any).name, 'Alice');
  }
}
