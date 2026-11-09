import { Taon } from 'taon/src';
import { TestBenchErrorsController } from './testbench-errors.controller';

export const TestbenchHttpErrorsContext = Taon.createContext(() => ({
  contextName: 'TestbenchHttpErrorsContext',
  controllers: { TestBenchErrorsController },
  abstract: true
}));
