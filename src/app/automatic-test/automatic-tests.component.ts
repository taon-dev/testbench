import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { AutomaticTestRunner } from './automatic-test.runner.service';
import type { AutomaticTestResult } from './automatic-test.types';

@Component({
  selector: 'app-automatic-tests',
  standalone: true,
  imports: [DecimalPipe, MatButtonModule],
  templateUrl: './automatic-tests.component.html',
  styleUrl: './automatic-tests.component.scss',
})
export class AutomaticTestsComponent {
  private readonly runner = inject(AutomaticTestRunner);

  readonly runningAll = signal(false);

  readonly tests = signal<AutomaticTestResult[]>(
    this.runner.cases.map(test => ({ ...test, status: 'pending' })),
  );

  readonly groups = computed(() => {
    const grouped = new Map<string, AutomaticTestResult[]>();
    for (const test of this.tests()) {
      const group = grouped.get(test.category) ?? [];
      group.push(test);
      grouped.set(test.category, group);
    }
    return [...grouped.entries()];
  });

  readonly passed = computed(
    () => this.tests().filter(test => test.status === 'success').length,
  );

  readonly failed = computed(
    () => this.tests().filter(test => test.status === 'failed').length,
  );

  readonly running = computed(
    () => this.tests().filter(test => test.status === 'running').length,
  );

  async startTests(): Promise<void> {
    if (this.runningAll()) return;

    this.runningAll.set(true);
    this.tests.update(tests =>
      tests.map(test => ({ ...test, status: 'pending', durationMs: undefined, error: undefined })),
    );

    try {
      for (const test of this.runner.cases) {
        await this.runTest(test.id);
      }
    } finally {
      this.runningAll.set(false);
    }
  }

  async runTest(id: string): Promise<void> {
    const test = this.runner.cases.find(item => item.id === id);
    if (!test) throw new Error(`Unknown automatic test: ${id}`);

    this.patchTest(id, { status: 'running', error: undefined, durationMs: undefined });
    const result = await this.runner.run(test);
    this.patchTest(id, result);
  }

  private patchTest(id: string, patch: Partial<AutomaticTestResult>): void {
    this.tests.update(tests =>
      tests.map(test => (test.id === id ? { ...test, ...patch } : test)),
    );
  }
}
