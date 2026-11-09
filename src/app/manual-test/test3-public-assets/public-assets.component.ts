import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { TaonStorageObject } from 'taon/src';

import { TestbenchRuntimeDiagnosticsComponent } from '../testbench-runtime-diagnostics.component';
import { TestbenchStorageApiService } from '../testbench-storage.api.service';
import {
  formatManualTestError,
  deleteTestbenchAsset,
  getPublicAssetUrl,
  testbenchFileName,
  uploadNormalFile,
  verifyDownloadedRange,
} from '../testbench-storage.utils';

type AssetKind = 'file' | 'video' | 'audio';

interface PublicAsset {
  file: File;
  object: TaonStorageObject;
  url: string;
  status: number;
}

@Component({
  selector: 'app-test3-public-assets',
  standalone: true,
  imports: [MatButtonModule, TestbenchRuntimeDiagnosticsComponent, DecimalPipe],
  templateUrl: './public-assets.component.html',
  styleUrl: './public-assets.component.scss',
})
export class PublicAssetsComponent {
  private readonly api = inject(TestbenchStorageApiService);

  readonly selected = signal<Partial<Record<AssetKind, File>>>({});

  readonly assets = signal<Partial<Record<AssetKind, PublicAsset>>>({});

  readonly uploading = signal<AssetKind | null>(null);

  readonly error = signal('');

  readonly message = signal('');

  selectFile(kind: AssetKind, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selected.update(current => ({ ...current, [kind]: file }));
    this.error.set('');
    this.message.set('');
  }

  async upload(kind: AssetKind): Promise<void> {
    const file = this.selected()[kind];
    if (!file || this.uploading()) return;

    this.uploading.set(kind);
    this.error.set('');
    this.message.set(
      `Uploading ${kind} asset and checking anonymous access...`,
    );
    try {
      const previous = this.assets()[kind];
      if (previous) {
        await deleteTestbenchAsset(this.api, previous.object.key);
        this.assets.update(current => {
          const next = { ...current };
          delete next[kind];
          return next;
        });
      }
      const object = await uploadNormalFile(
        this.api,
        file,
        testbenchFileName(`testbench-public-${kind}`, file),
      );
      this.assets.update(current => ({
        ...current,
        [kind]: { file, object, url: '', status: 0 },
      }));
      const url = await getPublicAssetUrl(this.api, object.key);
      const status = await verifyDownloadedRange(file.size, url);

      this.assets.update(current => ({
        ...current,
        [kind]: { file, object, url, status },
      }));
      this.message.set(
        `Anonymous access verified with HTTP ${status}${file.size > 0 ? ' (Range response)' : ''}.`,
      );
    } catch (error) {
      this.error.set(formatManualTestError(error));
      this.message.set('');
    } finally {
      this.uploading.set(null);
    }
  }

  async reset(): Promise<void> {
    this.error.set('');
    this.message.set('');
    for (const asset of Object.values(this.assets())) {
      if (!asset) continue;
      try {
        await deleteTestbenchAsset(this.api, asset.object.key);
      } catch (error) {
        this.error.set(formatManualTestError(error));
        return;
      }
    }
    this.selected.set({});
    this.assets.set({});
  }
}
