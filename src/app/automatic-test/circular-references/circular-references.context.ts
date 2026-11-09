import { Taon } from 'taon/src';
import { TestBenchCircularController } from './testbench-circular.controller';
import {
  TestBenchBook,
  TestBenchPerson,
  TestBenchPersonCirc,
} from '../testbench.models';

export const TestbenchCircularReferencesContext = Taon.createContext(() => ({
  contextName: 'TestbenchCircularReferencesContext',
  controllers: { TestBenchCircularController },
  abstract: true,
  entities: { TestBenchBook, TestBenchPerson, TestBenchPersonCirc },
}));
