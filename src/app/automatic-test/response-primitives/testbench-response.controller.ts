import { GET, Taon, TaonBaseController, TaonController } from 'taon/src';
import { TestbenchTest } from '../testbench-test-ids';

@TaonController<TestBenchResponseController>({
  className: 'TestBenchResponseController',
})
export class TestBenchResponseController extends TaonBaseController {
  @GET()
  [TestbenchTest.getBoolean](): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      return true;
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getNumber](): Taon.Response<number> {
    //#region @websqlFunc
    return async () => {
      return 123.456;
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getZero](): Taon.Response<number> {
    //#region @websqlFunc
    return async () => {
      return 0;
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getString](): Taon.Response<string> {
    //#region @websqlFunc
    return async () => {
      return 'hello from Taon backend';
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getEmptyString](): Taon.Response<string> {
    //#region @websqlFunc
    return async () => {
      return '';
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getNull](): Taon.Response<null> {
    //#region @websqlFunc
    return async () => {
      return null;
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getStringArray](): Taon.Response<string[]> {
    //#region @websqlFunc
    return async () => {
      return ['one', 'two', 'three'];
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getNumberArray](): Taon.Response<number[]> {
    //#region @websqlFunc
    return async () => {
      return [10, 20, 30];
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getObject](): Taon.Response<{
    name: string;
    enabled: boolean;
    count: number;
  }> {
    //#region @websqlFunc
    return async () => {
      return {
        name: 'test-object',
        enabled: true,
        count: 123,
      };
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getMixedObject](): Taon.Response<any> {
    //#region @websqlFunc
    return async () => {
      return {
        boolean: true,
        number: 123,
        string: 'hello',
        array: ['a', 'b', 'c'],
        nested: {
          foo: 'bar',
        },
      };
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getSerializationEdgeCases](): Taon.Response<{
    booleanValues: boolean[];
    numbers: number[];
    textValues: string[];
    emptyArray: unknown[];
    emptyObject: Record<string, never>;
    nested: { values: Array<{ value: string }> };
  }> {
    //#region @websqlFunc
    return async () => ({
      booleanValues: [true, false],
      numbers: [0, -12, 123.456],
      textValues: [
        '',
        '雪だるま ☃️ 🚀',
        'special: & = ? # % +',
        '123',
        'false',
        '{"value":1}',
      ],
      emptyArray: [],
      emptyObject: {},
      nested: {
        values: [{ value: 'deep value' }],
      },
    });
    //#endregion
  }
}
