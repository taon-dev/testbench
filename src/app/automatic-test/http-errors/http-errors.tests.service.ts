import { Injectable, inject } from '@angular/core';
import { TestbenchTest } from '../testbench-test-ids';
import { TestBenchApiService } from '../testbench.api.service';
import { TestbenchAssertions } from '../testbench-assertions';

@Injectable({ providedIn: 'root' })
export class HttpErrorTests extends TestbenchAssertions {
  private readonly testBenchApiService = inject(TestBenchApiService);

  private readonly methods: Record<string, () => Promise<void>> = {
    [TestbenchTest.throwError]: () => this[TestbenchTest.throwError](),
  };

  run(id: string): Promise<void> {
    const test = this.methods[id];
    if (!test) throw new Error(`Test "${id}" is not part of HttpErrorTests.`);
    return test();
  }

  async [TestbenchTest.throwError](): Promise<void> {
    let errorWasThrown = false;

    try {
      await this.testBenchApiService.httpErrors[TestbenchTest.throwError]().request!();
    } catch {
      errorWasThrown = true;
    }

    this.assert(errorWasThrown, 'Expected backend request to throw');
  }
}
