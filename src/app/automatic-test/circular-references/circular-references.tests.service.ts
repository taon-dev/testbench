import { Injectable, inject } from '@angular/core';
import { TestbenchTest } from '../testbench-test-ids';
import { TestBenchApiService } from '../testbench.api.service';
import { TestbenchAssertions } from '../testbench-assertions';
import { TestBenchPerson, TestBenchPersonCirc } from '../testbench.models';

@Injectable({ providedIn: 'root' })
export class CircularReferenceTests extends TestbenchAssertions {
  private readonly testBenchApiService = inject(TestBenchApiService);

  private readonly methods: Record<string, () => Promise<void>> = {
    [TestbenchTest.bodyMappedUserWithCircuralFromClient]: () => this[TestbenchTest.bodyMappedUserWithCircuralFromClient](),
    [TestbenchTest.bodyMappedUserWithCircuralFromServer]: () => this[TestbenchTest.bodyMappedUserWithCircuralFromServer](),
    [TestbenchTest.queryMappedUserWithCircuralFromClient]: () => this[TestbenchTest.queryMappedUserWithCircuralFromClient](),
  };

  run(id: string): Promise<void> {
    const test = this.methods[id];
    if (!test) throw new Error(`Test "${id}" is not part of CircularReferenceTests.`);
    return test();
  }

  async [TestbenchTest.bodyMappedUserWithCircuralFromClient](): Promise<void> {
    const user = new TestBenchPersonCirc();
    const friend = new TestBenchPersonCirc();
    friend.name = 'Franek';
    friend.age = 30;
    user.friend = friend;
    user.name = 'Darek';
    user.age = 40;
    friend.friend = user;

    const data =
      await this.testBenchApiService.circularReferences[TestbenchTest.bodyMappedUserWithCircuralFromClient](user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.bodyMappedUserWithCircuralFromServer](): Promise<void> {
    const data =
      await this.testBenchApiService.circularReferences[TestbenchTest.bodyMappedUserWithCircuralFromServer]().request!();

    const user = data.body.json;
    // this.assertEqual(data.body.json, true);

    this.assert(
      user instanceof TestBenchPerson,
      'Expected value to be TestBenchPerson',
    );

    this.assert(
      user.friend instanceof TestBenchPerson,
      'Expected friend value to be TestBenchPerson',
    );

    this.assert(
      user.friend.friend instanceof TestBenchPerson,
      'Expected friend.friend value to be TestBenchPerson',
    );
  }

  async [TestbenchTest.queryMappedUserWithCircuralFromClient](): Promise<void> {
    const user = new TestBenchPersonCirc();

    user.name = 'Darek';
    user.age = 40;
    user.friend = user;

    const data =
      await this.testBenchApiService.circularReferences[TestbenchTest.queryMappedUserWithCircuralFromClient](user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }
}
