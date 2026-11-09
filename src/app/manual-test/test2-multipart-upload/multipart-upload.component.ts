import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { TaonStorageObject } from 'taon/src';

import { TestbenchStorageApiService } from '../testbench-storage.api.service';
import {
  assertStorageMetadata,
  deleteTestbenchAsset,
  formatManualTestError,
  testbenchFileName,
  verifyDownloadedRange,
} from '../testbench-storage.utils';

@Component({
  selector: 'app-test2-multipart-upload',
  standalone: true,
  imports: [DecimalPipe, MatButtonModule],
  templateUrl: './multipart-upload.component.html',
  styleUrl: './multipart-upload.component.scss',
})
export class MultipartUploadComponent {
  private readonly api = inject(TestbenchStorageApiService);

  private uploadTask: Promise<void> | null = null;

  private abortController: AbortController | null = null;

  readonly selectedFile = signal<File | null>(null);

  readonly uploaded = signal<TaonStorageObject | null>(null);

  readonly downloadUrl = signal('');

  readonly progress = signal(0);

  readonly uploading = signal(false);

  readonly error = signal('');

  readonly message = signal('');

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile.set(input.files?.[0] ?? null);
    this.error.set('');
    this.message.set('');
  }

  async startUpload(): Promise<void> {
    const file = this.selectedFile();
    if (!file || this.uploading()) return;

    this.abortController = new AbortController();
    this.uploadTask = this.performUpload(file, this.abortController);
    await this.uploadTask;
    this.uploadTask = null;
    this.abortController = null;
  }

  cancelUpload(): void {
    this.abortController?.abort();
  }

  async reset(): Promise<void> {
    this.abortController?.abort();
    if (this.uploadTask) await this.uploadTask;

    const uploaded = this.uploaded();
    if (uploaded) {
      try {
        await deleteTestbenchAsset(this.api, uploaded.key);
      } catch (error) {
        this.error.set(formatManualTestError(error));
        return;
      }
    }

    this.selectedFile.set(null);
    this.uploaded.set(null);
    this.downloadUrl.set('');
    this.progress.set(0);
    this.error.set('');
    this.message.set('');
  }

  private async performUpload(
    file: File,
    abortController: AbortController,
  ): Promise<void> {
    this.uploading.set(true);
    this.progress.set(0);
    this.error.set('');
    this.message.set('Starting authenticated multipart upload...');

    try {
      const auth = await this.api.storageController
        .setTestbenchAuthentication(true)
        .request!();
      const authToken = auth.body.json.token;
      if (!authToken) throw new Error('Backend did not return a TestBench auth token.');

      const previous = this.uploaded();
      if (previous) {
        await deleteTestbenchAsset(this.api, previous.key);
        this.uploaded.set(null);
        this.downloadUrl.set('');
      }
      const fileName = testbenchFileName('testbench-multipart', file);
      const objects = await this.api.storageController.uploadFileInChunks(
        file,
        {
          fileName,
          contentType: file.type || undefined,
          signal: abortController.signal,
          onProgress: percentage => this.progress.set(percentage),
        },
        undefined,
        { headers: { 'x-testbench-auth': authToken } },
      );
      if (objects.length !== 1) {
        throw new Error(`Expected one completed upload, received ${objects.length}.`);
      }

      const object = objects[0];
      assertStorageMetadata(file, object);
      this.uploaded.set(object);
      const url = (
        await this.api.storageController
          .getPrivateUrl(object.key, { expiresInSeconds: 5 * 60 })
          .request!({ headers: { 'x-testbench-auth': authToken } })
      ).body.text;
      if (!url) throw new Error('Backend returned an empty private download URL.');
      const downloadStatus = await verifyDownloadedRange(file.size, url);

      this.downloadUrl.set(url);
      this.message.set(
        `Multipart completion verified. Private download range returned HTTP ${downloadStatus}; the helper checks each uploaded chunk checksum.`,
      );
    } catch (error) {
      if (abortController.signal.aborted) {
        this.message.set('Upload cancelled. Taon aborts the unfinished multipart session.');
        return;
      }
      this.error.set(formatManualTestError(error));
      this.message.set('');
    } finally {
      this.uploading.set(false);
    }
  }
}
