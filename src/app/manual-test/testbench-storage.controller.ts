import {
  Body,
  DELETE,
  ExpressRequest,
  ExpressResponse,
  GET,
  Models,
  POST,
  Query,
  Taon,
  TaonBaseStorageController,
  TaonController,
  TaonMultipartUploadOptions,
} from 'taon/src';
import { ClassHelpers } from 'taon/src';
import { UtilsJwt } from 'tnp-core/src';

import {
  getTestbenchStorageSecret,
  hasTestbenchStorageSecret,
} from './testbench-storage-secret';

interface TestbenchStorageAuthResult {
  authenticated: boolean;
  token: string;
}

interface TestbenchTokenPayload {
  storageController?: string;
  key?: string;
  purpose?: string;
  authenticated?: boolean;
  expiresAt?: number;
}

@TaonController<TestbenchStorageController>({
  className: 'TestbenchStorageController',
})
export class TestbenchStorageController extends TaonBaseStorageController<
  {},
  TestbenchStorageController
> {
  afterFileUploadHook(): void {}

  protected override async authorizeMultipartUpload(options: {
    key: string;
  }): Promise<boolean> {
    return options.key.includes('testbench-');
  }

  @GET()
  runtimeDiagnostics(): Taon.Response<{
    runtime: 'Node.js' | 'Cloudflare Worker';
    storageAvailable: boolean;
    privateAssetSigningConfigured: boolean;
  }> {
    //#region @backendFunc
    return async () => {
      const process = (
        globalThis as typeof globalThis & {
          process?: { versions?: { node?: string } };
        }
      ).process;
      const runtime = process?.versions?.node ? 'Node.js' : 'Cloudflare Worker';
      return {
        runtime,
        storageAvailable:
          runtime === 'Node.js'
            ? Boolean(this.ctx.bucketFileDbLocationBase)
            : Boolean(this.ctx.R2),
        privateAssetSigningConfigured: hasTestbenchStorageSecret(),
      };
    };
    //#endregion
  }

  @POST()
  setTestbenchAuthentication(
    @Body('authenticated') authenticated: boolean,
  ): Taon.Response<TestbenchStorageAuthResult> {
    //#region @backendFunc
    return async () => {
      if (!authenticated) {
        return { authenticated: false, token: '' };
      }

      const expiresAt = Date.now() + 15 * 60 * 1000;
      const token = await UtilsJwt.sign(
        {
          purpose: 'testbench-auth',
          authenticated: true,
          expiresAt,
        },
        getTestbenchStorageSecret(),
        { expiresIn: 15 * 60 },
      );
      return { authenticated: true, token };
    };
    //#endregion
  }

  @DELETE()
  override delete(@Query('key') key: string): Taon.Response<boolean> {
    //#region @backendFunc
    if (!key.startsWith('testbench-')) {
      throw new Error(
        'TestBench cleanup may only delete TestBench-owned files.',
      );
    }
    return super.delete(key);
    //#endregion
  }

  protected override async beforeEachRequest(
    request: Models.TaonCtrlBeforeEachRequestParams<TestbenchStorageController>,
  ): Promise<void> {
    const methodName = String(request.methodConfig.methodName);
    if (methodName === 'deleteMany') {
      request.res.status(403);
      throw new Error('Bulk deletion is disabled for TestBench storage.');
    }

    if (
      methodName !== 'getPrivateUrl' &&
      methodName !== 'startMultipartUpload' &&
      methodName !== 'uploadMultipartPart' &&
      methodName !== 'completeMultipartUpload' &&
      methodName !== 'abortMultipartUpload'
    ) {
      return;
    }

    const rawToken = request.req.headers['x-testbench-auth'];
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
    if (!token || !(await this.isAuthenticatedTestbenchToken(token))) {
      request.res.status(401);
      throw new Error(
        'TestBench authentication is required for this operation.',
      );
    }

    request.req.userId = 'testbench-user';
  }

  override async createStorageDownloadToken(options: {
    key: string;
    expiresAt: number;
  }): Promise<string> {
    return UtilsJwt.sign(
      {
        storageController: ClassHelpers.getName(this),
        key: options.key,
        expiresAt: options.expiresAt,
      },
      getTestbenchStorageSecret(),
      {
        expiresIn: Math.max(
          1,
          Math.ceil((options.expiresAt - Date.now()) / 1000),
        ),
      },
    );
  }

  protected override async verifyStorageDownloadToken(options: {
    token: string;
    key: string;
  }): Promise<boolean> {
    try {
      const payload = (await UtilsJwt.verify(
        options.token,
        getTestbenchStorageSecret(),
      )) as TestbenchTokenPayload;
      return (
        payload.storageController === ClassHelpers.getName(this) &&
        payload.key === options.key &&
        typeof payload.expiresAt === 'number' &&
        payload.expiresAt > Date.now()
      );
    } catch {
      return false;
    }
  }

  protected override async isPublicStorageKey(key: string): Promise<boolean> {
    return key.startsWith('testbench-public-');
  }

  override buildStorageDownloadUrl(options: {
    req: ExpressRequest;
    key: string;
    private: boolean;
    token?: string;
    download?: boolean;
  }): string {
    const url = new URL(this.getThisControllerMethodFullUrl('download'));
    url.search = '';
    url.searchParams.set('key', options.key);
    if (options.token) url.searchParams.set('token', options.token);
    if (options.download) url.searchParams.set('download', 'true');
    return url.toString();
  }

  private async isAuthenticatedTestbenchToken(token: string): Promise<boolean> {
    try {
      const payload = (await UtilsJwt.verify(
        token,
        getTestbenchStorageSecret(),
      )) as TestbenchTokenPayload;
      return (
        payload.purpose === 'testbench-auth' &&
        payload.authenticated === true &&
        typeof payload.expiresAt === 'number' &&
        payload.expiresAt > Date.now()
      );
    } catch {
      return false;
    }
  }
}
