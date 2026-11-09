import { GET, Taon, TaonBaseController, TaonController } from 'taon/src';
import { TestbenchTest } from '../testbench-test-ids';

@TaonController<TestBenchErrorsController>({
  className: 'TestBenchErrorsController',
})
export class TestBenchErrorsController extends TaonBaseController {
  @GET()
  [TestbenchTest.throwError](): Taon.Response<any> {
    //#region @websqlFunc
    return async () => {
      throw new Error('Intentional TestBench backend error');
    };
    //#endregion
  }
}
