import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { TaonStorageObject } from 'taon/src';
import { TestbenchStorageApiService } from '../testbench-storage.api.service';
import {
  formatManualTestError,
  deleteTestbenchAsset,
  getPublicAssetUrl,
  testbenchFileName,
  uploadNormalFile,
  verifyDownloadedFile,
} from '../testbench-storage.utils';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

@Component({
  selector: 'app-test1-normal-upload',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './normal-upload.component.html',
  styleUrl: './normal-upload.component.scss',
})
export class NormalUploadComponent {
  private readonly api = inject(TestbenchStorageApiService);

  readonly selectedFile = signal<File | null>(null);
  readonly uploaded = signal<TaonStorageObject | null>(null);
  readonly downloadUrl = signal('');
  readonly sha256 = signal('');
  readonly uploading = signal(false);
  readonly error = signal('');
  readonly message = signal('');

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.error.set('');
    this.message.set('');
    if (file && file.size > MAX_FILE_SIZE) {
      this.selectedFile.set(null);
      this.error.set(
        `File is ${formatBytes(file.size)}; the maximum is 50 MB. No request was made.`,
      );
      input.value = '';
      return;
    }
    this.selectedFile.set(file);
  }

  async upload(): Promise<void> {
    const file = this.selectedFile();
    if (!file || this.uploading()) return;

    this.uploading.set(true);
    this.error.set('');
    this.message.set('Uploading file and verifying downloaded bytes...');
    try {
      const previous = this.uploaded();
      if (previous) {
        await deleteTestbenchAsset(this.api, previous.key);
        this.uploaded.set(null);
        this.downloadUrl.set('');
      }
      const object = await uploadNormalFile(
        this.api,
        file,
        testbenchFileName('testbench-public-normal', file),
      );
      this.uploaded.set(object);
      const url = await getPublicAssetUrl(this.api, object.key);
      const hash = await verifyDownloadedFile(file, object, url);
      this.downloadUrl.set(url);
      this.sha256.set(hash);
      this.message.set('Upload and anonymous download verification succeeded.');
    } catch (error) {
      this.error.set(formatManualTestError(error));
      this.message.set('');
    } finally {
      this.uploading.set(false);
    }
  }

  async reset(): Promise<void> {
    this.error.set('');
    this.message.set('');
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
    this.sha256.set('');
  }
}

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
