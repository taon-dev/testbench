import { Taon } from 'taon/src';
import { TestbenchResponsePrimitivesContext } from './response-primitives/response-primitives.context';
import { TestbenchEntityMappingContext } from './entity-mapping/entity-mapping.context';
import { TestbenchRequestParametersContext } from './request-parameters/request-parameters.context';
import { TestbenchCircularReferencesContext } from './circular-references/circular-references.context';
import { TestbenchHttpErrorsContext } from './http-errors/http-errors.context';
import { TestbenchTranslationsContext } from './translations/translations.context';

export const TestbenchAutomaticContext = Taon.createContext(() => ({
  contextName: 'TestbenchAutomaticContext',
  abstract: true,
  contexts: {
    TestbenchResponsePrimitivesContext,
    TestbenchEntityMappingContext,
    TestbenchRequestParametersContext,
    TestbenchCircularReferencesContext,
    TestbenchHttpErrorsContext,
    TestbenchTranslationsContext,
  },
}));
