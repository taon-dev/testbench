import { Taon } from 'taon/src';
import { TestBenchTranslationsController } from './testbench-translations.controller';

export const TestbenchTranslationsContext = Taon.createContext(() => ({
  contextName: 'TestbenchTranslationsContext',
  abstract: true,
  controllers: { TestBenchTranslationsController },
}));
