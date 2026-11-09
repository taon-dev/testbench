import { Component, OnInit, inject, signal } from '@angular/core';
import { TestbenchStorageApiService } from './testbench-storage.api.service';
import { formatManualTestError } from './testbench-storage.utils';

interface RuntimeDiagnostics {
  runtime: 'Node.js' | 'Cloudflare Worker';
  storageAvailable: boolean;
  privateAssetSigningConfigured: boolean;
}

@Component({
  selector: 'testbench-runtime-diagnostics',
  standalone: true,
  templateUrl: './testbench-runtime-diagnostics.component.html',
  styleUrl: './testbench-runtime-diagnostics.component.scss',
})
export class TestbenchRuntimeDiagnosticsComponent implements OnInit {
  private readonly api = inject(TestbenchStorageApiService);

  readonly diagnostics = signal<RuntimeDiagnostics | null>(null);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    try {
      const response =
        await this.api.storageController.runtimeDiagnostics().request!();
      this.diagnostics.set(response.body.json);
    } catch (error) {
      this.error.set(formatManualTestError(error));
    }
  }
}
