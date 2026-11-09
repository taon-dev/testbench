import { Injectable, inject } from '@angular/core';

import { automaticTestDetails } from './automatic-test.registry';
import {
  type AutomaticTestCase,
  type AutomaticTestGroup,
  type AutomaticTestResult,
} from './automatic-test.types';
import { CircularReferenceTests } from './circular-references/circular-references.tests.service';
import { EntityMappingTests } from './entity-mapping/entity-mapping.tests.service';
import { HttpErrorTests } from './http-errors/http-errors.tests.service';
import { RequestParameterTests } from './request-parameters/request-parameters.tests.service';
import { ResponsePrimitiveTests } from './response-primitives/response-primitives.tests.service';
import { TranslationTests } from './translations/translations.tests.service';

@Injectable({ providedIn: 'root' })
export class AutomaticTestRunner {
  private readonly responsePrimitives = inject(ResponsePrimitiveTests);

  private readonly entityMapping = inject(EntityMappingTests);

  private readonly requestParameters = inject(RequestParameterTests);

  private readonly circularReferences = inject(CircularReferenceTests);

  private readonly httpErrors = inject(HttpErrorTests);

  private readonly translations = inject(TranslationTests);

  private readonly groups: Record<string, AutomaticTestGroup> = {
    'Response primitives': this.responsePrimitives,
    'Serialization edge cases': this.responsePrimitives,
    'Entity mapping': this.entityMapping,
    'Request parameters': this.requestParameters,
    'Circular references': this.circularReferences,
    'HTTP errors': this.httpErrors,
    Localization: this.translations,
  };

  readonly cases: readonly AutomaticTestCase[] = automaticTestDetails.map(
    test => ({
      ...test,
      run: () => this.runGroup(test.category, test.id),
    }),
  );

  async run(test: AutomaticTestCase): Promise<AutomaticTestResult> {
    const startedAt = performance.now();

    try {
      await test.run();
      return {
        ...test,
        status: 'success',
        durationMs: performance.now() - startedAt,
      };
    } catch (error) {
      console.error(`[Taon TestBench] "${test.id}" failed`, error);
      return {
        ...test,
        status: 'failed',
        durationMs: performance.now() - startedAt,
        error:
          error instanceof Error ? error.stack || error.message : String(error),
      };
    }
  }

  private runGroup(category: string, id: string): Promise<void> {
    const group = this.groups[category];
    if (!group) throw new Error(`Unknown automatic test category: ${category}`);
    return group.run(id);
  }
}
