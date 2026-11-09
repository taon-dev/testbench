import { Injectable } from '@angular/core';
import { TaonBaseAngularService } from 'taon/src';

import { TestBenchCircularController } from './circular-references/testbench-circular.controller';
import { TestBenchEntityController } from './entity-mapping/testbench-entity.controller';
import { TestBenchErrorsController } from './http-errors/testbench-errors.controller';
import { TestBenchRequestController } from './request-parameters/testbench-request.controller';
import { TestBenchResponseController } from './response-primitives/testbench-response.controller';
import { TestBenchTranslationsController } from './translations/testbench-translations.controller';

@Injectable({ providedIn: 'root' })
export class TestBenchApiService extends TaonBaseAngularService {
  readonly responsePrimitives = this.injectController(TestBenchResponseController);

  readonly entityMapping = this.injectController(TestBenchEntityController);

  readonly requestParameters = this.injectController(TestBenchRequestController);

  readonly circularReferences = this.injectController(TestBenchCircularController);

  readonly httpErrors = this.injectController(TestBenchErrorsController);

  readonly testBenchTranslationsController = this.injectController(TestBenchTranslationsController);
}
