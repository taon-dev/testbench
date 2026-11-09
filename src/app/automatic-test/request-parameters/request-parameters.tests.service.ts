import { Injectable, inject } from '@angular/core';

import { TestbenchAssertions } from '../testbench-assertions';
import { TestbenchTest } from '../testbench-test-ids';
import { TestBenchApiService } from '../testbench.api.service';
import { TestBenchBook, TestBenchPerson } from '../testbench.models';

@Injectable({ providedIn: 'root' })
export class RequestParameterTests extends TestbenchAssertions {
  private readonly testBenchApiService = inject(TestBenchApiService);

  private readonly methods: Record<string, () => Promise<void>> = {
    [TestbenchTest.bodyMappedUser]: () => this[TestbenchTest.bodyMappedUser](),
    [TestbenchTest.bodyNestedMappedEntities]: () => this[TestbenchTest.bodyNestedMappedEntities](),
    [TestbenchTest.queryMappedUser]: () => this[TestbenchTest.queryMappedUser](),
    [TestbenchTest.queryNestedMappedEntities]: () => this[TestbenchTest.queryNestedMappedEntities](),
    [TestbenchTest.bodyNumber]: () => this[TestbenchTest.bodyNumber](),
    [TestbenchTest.bodyBoolean]: () => this[TestbenchTest.bodyBoolean](),
    [TestbenchTest.bodyString]: () => this[TestbenchTest.bodyString](),
    [TestbenchTest.queryNumber]: () => this[TestbenchTest.queryNumber](),
    [TestbenchTest.queryBoolean]: () => this[TestbenchTest.queryBoolean](),
    [TestbenchTest.queryString]: () => this[TestbenchTest.queryString](),
  };

  run(id: string): Promise<void> {
    const test = this.methods[id];
    if (!test) throw new Error(`Test "${id}" is not part of RequestParameterTests.`);
    return test();
  }

  async [TestbenchTest.bodyMappedUser](): Promise<void> {
    const user = new TestBenchPerson();

    user.name = 'Darek';
    user.age = 40;

    const data =
      await this.testBenchApiService.requestParameters[TestbenchTest.bodyMappedUser](user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.bodyNestedMappedEntities](): Promise<void> {
    const book = new TestBenchBook();

    book.title = 'Taon Book';
    book.pages = 123;

    const user = new TestBenchPerson();

    user.name = 'Darek';
    user.age = 40;

    const data = await this.testBenchApiService.requestParameters[TestbenchTest.bodyNestedMappedEntities](book, user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.queryMappedUser](): Promise<void> {
    const user = new TestBenchPerson();

    user.name = 'Darek';
    user.age = 40;

    const data =
      await this.testBenchApiService.requestParameters[TestbenchTest.queryMappedUser](user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.queryNestedMappedEntities](): Promise<void> {
    const book = new TestBenchBook();

    book.title = 'Taon Book';
    book.pages = 123;

    const user = new TestBenchPerson();

    user.name = 'Darek';
    user.age = 40;

    const data = await this.testBenchApiService.requestParameters[TestbenchTest.queryNestedMappedEntities](book, user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.bodyNumber](): Promise<void> {
    const data =
      await this.testBenchApiService.requestParameters[TestbenchTest.bodyNumber](123.456).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.bodyBoolean](): Promise<void> {
    const data =
      await this.testBenchApiService.requestParameters[TestbenchTest.bodyBoolean](true).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.bodyString](): Promise<void> {
    const data = await this.testBenchApiService.requestParameters[TestbenchTest.bodyString]('hello from frontend').request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.queryNumber](): Promise<void> {
    const data =
      await this.testBenchApiService.requestParameters[TestbenchTest.queryNumber](123.456).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.queryBoolean](): Promise<void> {
    const data =
      await this.testBenchApiService.requestParameters[TestbenchTest.queryBoolean](true).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.queryString](): Promise<void> {
    const data = await this.testBenchApiService.requestParameters[TestbenchTest.queryString]('hello from frontend').request!();

    this.assertEqual(data.body.booleanValue, true);
  }
}
