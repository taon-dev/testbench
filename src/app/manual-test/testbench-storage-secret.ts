let storageSecret: string | undefined;

export function configureTestbenchStorageSecret(secret: string): void {
  if (secret.length < 32) {
    throw new Error(
      'TAON_TESTBENCH_STORAGE_SECRET must contain at least 32 characters.',
    );
  }
  storageSecret = secret;
}

export function hasTestbenchStorageSecret(): boolean {
  return Boolean(storageSecret);
}

export function getTestbenchStorageSecret(): string {
  if (!storageSecret) {
    throw new Error(
      'Private TestBench assets require TAON_TESTBENCH_STORAGE_SECRET (at least 32 characters) in the Node environment or Cloudflare Worker bindings.',
    );
  }
  return storageSecret;
}
