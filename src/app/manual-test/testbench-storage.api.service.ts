import { Injectable } from '@angular/core';
import { TaonBaseAngularService } from 'taon/src';
import { TestbenchStorageController } from './testbench-storage.controller';

@Injectable({ providedIn: 'root' })
export class TestbenchStorageApiService extends TaonBaseAngularService {
  readonly storageController = this.inject(TestbenchStorageController);
}
