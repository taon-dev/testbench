import { Taon } from 'taon/src';
import { TestbenchStorageController } from './testbench-storage.controller';

export const TestbenchStorageContext = Taon.createContext(() => ({
  contextName: 'TestbenchStorageContext',
  abstract: true,
  controllers: {
    TestbenchStorageController,
  },
}));
