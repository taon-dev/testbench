import { GET, Taon, TaonBaseController, TaonController } from 'taon/src';
import { TestbenchTest } from '../testbench-test-ids';
import { TestBenchPerson } from '../testbench.models';

@TaonController<TestBenchEntityController>({
  className: 'TestBenchEntityController',
})
export class TestBenchEntityController extends TaonBaseController {
  @GET()
  [TestbenchTest.getMappedObject](): Taon.Response<TestBenchPerson> {
    //#region @websqlFunc
    return async () => {
      const person = new TestBenchPerson();

      person.name = 'Darek';
      person.age = 40;

      return person;
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getMappedObjectRawJson](): Taon.Response<TestBenchPerson> {
    //#region @websqlFunc
    return async () => {
      const person = new TestBenchPerson();

      person.name = 'Darek';
      person.age = 40;

      return person;
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getMappedObjectArray](): Taon.Response<TestBenchPerson[]> {
    //#region @websqlFunc
    return async () => {
      const john = new TestBenchPerson();
      john.name = 'John';
      john.age = 30;

      const alice = new TestBenchPerson();
      alice.name = 'Alice';
      alice.age = 25;

      return [john, alice];
    };
    //#endregion
  }

  @GET()
  [TestbenchTest.getMappedObjectArrayRawJson](): Taon.Response<
    TestBenchPerson[]
  > {
    //#region @websqlFunc
    return async () => {
      const john = new TestBenchPerson();
      john.name = 'John';
      john.age = 30;

      const alice = new TestBenchPerson();
      alice.name = 'Alice';
      alice.age = 25;

      return [john, alice];
    };
    //#endregion
  }
}
