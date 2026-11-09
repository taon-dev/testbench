import type { TaonStorageObject } from 'taon/src';
import { TestbenchStorageApiService } from './testbench-storage.api.service'; // @browser

export function testbenchFileName(prefix: string, file: File): string {
  const safeName = file.name.replace(/[\\/]/g, '_');
  return `${prefix}-${crypto.randomUUID()}-${safeName}`;
}

//#region @browser
export async function uploadNormalFile(
  api: TestbenchStorageApiService,
  file: File,
  fileName: string,
): Promise<TaonStorageObject> {
  const formData = new FormData();
  formData.append('file', file, fileName);
  const response = await api.storageController
    .uploadFormDataToServer(formData)
    .request!();
  const objects = response.body.json;
  if (objects.length !== 1) {
    throw new Error(`Expected one uploaded object, received ${objects.length}.`);
  }
  assertStorageMetadata(file, objects[0]);
  return objects[0];
}
//#endregion

//#region @browser
export async function getPublicAssetUrl(
  api: TestbenchStorageApiService,
  key: string,
): Promise<string> {
  const response = await api.storageController.getPublicUrl(key).request!();
  if (!response.body.text) {
    throw new Error('The storage controller returned an empty public URL.');
  }
  return response.body.text;
}
//#endregion

//#region @browser
export async function deleteTestbenchAsset(
  api: TestbenchStorageApiService,
  key: string,
): Promise<void> {
  const result = await api.storageController.delete(key).request!();
  if (!result.body.booleanValue) {
    throw new Error(`Storage did not confirm deletion of "${key}".`);
  }
}
//#endregion

//#region @browser
export async function verifyDownloadedFile(
  file: File,
  object: TaonStorageObject,
  url: string,
): Promise<string> {
  assertStorageMetadata(file, object);

  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Download verification failed with HTTP ${response.status}.`);
  }
  const downloadedBytes = await response.arrayBuffer();
  if (downloadedBytes.byteLength !== file.size) {
    throw new Error(
      `Downloaded size mismatch: expected ${file.size}, received ${downloadedBytes.byteLength}.`,
    );
  }

  const originalHash = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  const downloadedHash = await crypto.subtle.digest('SHA-256', downloadedBytes);
  const expected = toHex(originalHash);
  const actual = toHex(downloadedHash);
  if (expected !== actual) {
    throw new Error('SHA-256 mismatch between the selected and downloaded file.');
  }
  return actual;
}
//#endregion

//#region @browser
export async function verifyDownloadedRange(
  fileSize: number,
  url: string,
): Promise<number> {
  const response = await fetch(url, {
    headers: fileSize > 0 ? { Range: 'bytes=0-0' } : undefined,
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Range verification failed with HTTP ${response.status}.`);
  }
  if (fileSize > 0) {
    const contentRange = response.headers.get('Content-Range');
    if (response.status !== 206 || contentRange !== `bytes 0-0/${fileSize}`) {
      await response.body?.cancel();
      throw new Error(
        `Expected a byte-range response for ${fileSize} bytes; received HTTP ${response.status} with Content-Range "${contentRange}".`,
      );
    }
  }
  await response.body?.cancel();
  return response.status;
}
//#endregion

//#region @browser
export function assertStorageMetadata(
  file: File,
  object: TaonStorageObject,
): void {
  if (object.size !== file.size) {
    throw new Error(
      `Uploaded size mismatch: expected ${file.size}, received ${object.size}.`,
    );
  }
  if (object.fileName && !object.fileName.endsWith(file.name)) {
    throw new Error(
      `Uploaded filename mismatch: expected suffix "${file.name}", received "${object.fileName}".`,
    );
  }
  if (file.type && object.contentType && object.contentType !== file.type) {
    throw new Error(
      `Uploaded MIME type mismatch: expected "${file.type}", received "${object.contentType}".`,
    );
  }
}
//#endregion

export function formatManualTestError(error: unknown): string {
  return error instanceof Error ? error.stack || error.message : String(error);
}

export function manualHttpStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return undefined;
  }
  const { status } = error as { status?: unknown };
  return typeof status === 'number' ? status : undefined;
}

function toHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}
