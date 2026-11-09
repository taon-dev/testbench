import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import type { TaonStorageObject } from 'taon/src';

import { TestbenchRuntimeDiagnosticsComponent } from '../testbench-runtime-diagnostics.component';
import { TestbenchStorageApiService } from '../testbench-storage.api.service';
import {
  formatManualTestError,
  deleteTestbenchAsset,
  manualHttpStatus,
  testbenchFileName,
  uploadNormalFile,
  verifyDownloadedRange,
} from '../testbench-storage.utils';

type AssetKind = 'file' | 'video' | 'audio';

interface PrivateAsset {
  file: File;
  object: TaonStorageObject;
  url: string;
  status?: number;
  error?: string;
}

@Component({
  selector: 'app-test4-private-assets',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSlideToggleModule,
    TestbenchRuntimeDiagnosticsComponent,
    DecimalPipe,
  ],
  templateUrl: './private-assets.component.html',
  styleUrl: './private-assets.component.scss',
})
export class PrivateAssetsComponent {
  private readonly api = inject(TestbenchStorageApiService);

  readonly authenticated = signal(false);

  readonly authToken = signal('');

  readonly selected = signal<Partial<Record<AssetKind, File>>>({});

  readonly assets = signal<Partial<Record<AssetKind, PrivateAsset>>>({});

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

  async setAuthenticated(authenticated: boolean): Promise<void> {
    this.error.set('');
    this.message.set('');
    try {
      const response =
        await this.api.storageController.setTestbenchAuthentication(
          authenticated,
        ).request!();
      const result = response.body.json;
      this.authenticated.set(result.authenticated);
      this.authToken.set(result.token);
      if (result.authenticated) {
        this.message.set(
          'Backend issued a short-lived TestBench authentication token.',
        );
        await this.refreshAllAssetAccess();
      } else {
        this.clearMediaUrls();
        this.message.set(
          'Authentication disabled. Testing unauthenticated URL requests against existing private assets.',
        );
        await this.checkUnauthenticatedAccess();
      }
    } catch (error) {
      this.authenticated.set(false);
      this.authToken.set('');
      this.error.set(formatManualTestError(error));
    }
  }

  async upload(kind: AssetKind): Promise<void> {
    const file = this.selected()[kind];
    if (!file || this.uploading()) return;

    this.uploading.set(kind);
    this.error.set('');
    this.message.set(`Uploading private ${kind} asset...`);
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
        testbenchFileName(`testbench-private-${kind}`, file),
      );
      this.assets.update(current => ({
        ...current,
        [kind]: { file, object, url: '' },
      }));
      this.message.set(
        'Private asset uploaded; requesting access through the backend auth check.',
      );
      await this.refreshAssetAccess(kind);
    } catch (error) {
      this.error.set(formatManualTestError(error));
      this.message.set('');
    } finally {
      this.uploading.set(null);
    }
  }

  async refreshAssetAccess(kind: AssetKind): Promise<void> {
    const asset = this.assets()[kind];
    if (!asset) return;

    const authToken = this.authToken();
    try {
      const url = (
        await this.api.storageController.getPrivateUrl(asset.object.key, {
          expiresInSeconds: 5 * 60,
        }).request!(
          authToken
            ? { headers: { 'x-testbench-auth': authToken } }
            : undefined,
        )
      ).body.text;
      if (!url) throw new Error('Backend returned an empty private asset URL.');
      const status = await verifyDownloadedRange(asset.file.size, url);
      this.patchAsset(kind, { url, status, error: undefined });
    } catch (error) {
      const status = manualHttpStatus(error);
      this.patchAsset(kind, {
        url: '',
        status,
        error: formatManualTestError(error),
      });
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

    await this.setAuthenticated(false);
    this.selected.set({});
    this.assets.set({});
  }

  private async refreshAllAssetAccess(): Promise<void> {
    for (const kind of ['file', 'video', 'audio'] as const) {
      await this.refreshAssetAccess(kind);
    }
  }

  private async checkUnauthenticatedAccess(): Promise<void> {
    for (const kind of ['file', 'video', 'audio'] as const) {
      const asset = this.assets()[kind];
      if (asset) await this.refreshAssetAccess(kind);
    }
  }

  private clearMediaUrls(): void {
    this.assets.update(current => {
      const next = { ...current };
      for (const kind of ['file', 'video', 'audio'] as const) {
        if (next[kind]) next[kind] = { ...next[kind]!, url: '' };
      }
      return next;
    });
  }

  private patchAsset(kind: AssetKind, patch: Partial<PrivateAsset>): void {
    this.assets.update(current => {
      const asset = current[kind];
      return asset ? { ...current, [kind]: { ...asset, ...patch } } : current;
    });
  }
}
