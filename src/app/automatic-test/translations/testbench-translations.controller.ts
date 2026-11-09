import { Translation } from '@taon-dev/i18n/src';
import { POST, Taon, TaonBaseController, TaonController } from 'taon/src';

import { TestbenchTest } from '../testbench-test-ids';
const t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP);

@TaonController<TestBenchTranslationsController>({
  className: 'TestBenchTranslationsController',
})
export class TestBenchTranslationsController extends TaonBaseController {
  t = t;

  @POST()
  [TestbenchTest.shouldTranslateMessage](): Taon.Response<string> {
    //#region @backendFunc
    return async (_req, _res, requestResults) => {
      if (!requestResults?.t) {
        throw new Error('Backend translation context is unavailable.');
      }
      return requestResults.t.gettext('Tank');
    };
    //#endregion
  }
}
