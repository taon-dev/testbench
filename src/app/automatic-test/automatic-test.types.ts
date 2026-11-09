import type { TestbenchTestId } from './testbench-test-ids';

export type AutomaticTestStatus = 'pending' | 'running' | 'success' | 'failed';

export interface AutomaticTestCase {
  id: TestbenchTestId;
  category: string;
  name: string;
  description: string;
  run(): Promise<void>;
}

export interface AutomaticTestGroup {
  run(id: string): Promise<void>;
}

export interface AutomaticTestResult extends AutomaticTestCase {
  status: AutomaticTestStatus;
  durationMs?: number;
  error?: string;
}
