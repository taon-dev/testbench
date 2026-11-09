// import { TranslationManager } from '@taon-dev/i18n/src';
// import { Taon } from 'taon/src';
// import { TaonAdmin } from 'taon/src'; // @browser
// import { TaonStor } from 'taon-storage/src';
// import { TestbenchContext } from './app.context';
// import { configureTestbenchStorageSecret } from './manual-test/testbench-storage-secret';

// export const TestbenchStartFunction = async (
//   startParams?: Taon.StartParams,
// ): Promise<void> => {
//   TranslationManager.Instance.visibleLanguages = ['en-US', 'pl-PL'];

//   //#region @backendFunc
//   const runtimeParams = startParams as
//     | (Taon.StartParams & { cloudflareEnv?: Record<string, unknown> })
//     | undefined;
//   const workerSecret = runtimeParams?.cloudflareEnv?.[
//     'TAON_TESTBENCH_STORAGE_SECRET'
//   ];
//   const nodeProcess = (
//     globalThis as typeof globalThis & {
//       process?: { env?: Record<string, string | undefined> };
//     }
//   ).process;
//   const secret =
//     (typeof workerSecret === 'string' ? workerSecret : undefined) ??
//     nodeProcess?.env?.['TAON_TESTBENCH_STORAGE_SECRET'];
//   if (secret) configureTestbenchStorageSecret(secret);
//   //#endregion

//   //#region @browser

//   TaonAdmin.init();

//   await TaonStor.awaitAll();
//   //#endregion

//   await TestbenchContext.initialize(startParams);
// };
