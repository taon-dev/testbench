import { Taon } from 'taon/src';
import { TestBenchRequestController } from './testbench-request.controller';
import { TestBenchBook, TestBenchPerson, TestBenchPersonCirc } from '../testbench.models';

export const TestbenchRequestParametersContext = Taon.createContext(() => ({
  contextName: 'TestbenchRequestParametersContext',
  controllers: { TestBenchRequestController },
  abstract: true,
  entities: { TestBenchBook, TestBenchPerson, TestBenchPersonCirc },
}));
