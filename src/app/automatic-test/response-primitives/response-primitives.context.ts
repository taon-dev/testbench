import { Taon } from 'taon/src';
import { TestBenchResponseController } from './testbench-response.controller';

export const TestbenchResponsePrimitivesContext = Taon.createContext(() => ({
  contextName: 'TestbenchResponsePrimitivesContext',
  controllers: { TestBenchResponseController },
  abstract: true,
}));
