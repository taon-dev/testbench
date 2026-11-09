import { Taon } from 'taon/src';
import { TestBenchEntityController } from './testbench-entity.controller';
import {
  TestBenchBook,
  TestBenchPerson,
  TestBenchPersonCirc,
} from '../testbench.models';

export const TestbenchEntityMappingContext = Taon.createContext(() => ({
  contextName: 'TestbenchEntityMappingContext',
  controllers: { TestBenchEntityController },
  abstract: true,
  entities: { TestBenchBook, TestBenchPerson, TestBenchPersonCirc },
}));
