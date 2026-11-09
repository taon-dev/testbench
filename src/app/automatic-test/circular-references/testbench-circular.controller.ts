import { BodyCirc, POST, QueryCirc, Taon, TaonBaseController, TaonController } from 'taon/src';
import { TestbenchTest } from '../testbench-test-ids';
import { TestBenchPerson, TestBenchPersonCirc } from '../testbench.models';

@TaonController<TestBenchCircularController>({
  className: 'TestBenchCircularController',
})
export class TestBenchCircularController extends TaonBaseController {
  @POST()
  [TestbenchTest.bodyMappedUserWithCircuralFromClient](
    @BodyCirc() user: TestBenchPerson,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      try {
        if (!(user instanceof TestBenchPersonCirc)) {
          return false;
        }

        if (!(user.friend instanceof TestBenchPersonCirc)) {
          return false;
        }

        if (!(user.friend.friend instanceof TestBenchPersonCirc)) {
          return false;
        }

        if (!(user.friend.friend.friend instanceof TestBenchPersonCirc)) {
          return false;
        }

        if (user.name !== 'Darek') {
          return false;
        }

        if (user.friend.name !== 'Franek') {
          return false;
        }

        if (user.age !== 40) {
          return false;
        }

        if (user.description !== 'Darek (40)') {
          return false;
        }

        return true;
      } catch (error) {
        console.error(error);

        return false;
      }
    };
    //#endregion
  }

  @POST()
  [TestbenchTest.bodyMappedUserWithCircuralFromServer](): Taon.Response<TestBenchPerson> {
    //#region @websqlFunc
    return async () => {
      const user = new TestBenchPerson();
      const friend = new TestBenchPerson();
      friend.name = 'Franek';
      friend.age = 30;
      user.friend = friend;
      user.name = 'Darek';
      user.age = 40;
      friend.friend = user;
      return (options: unknown) => {
        if (
          typeof options !== 'object' ||
          options === null ||
          !('circResponse' in options) ||
          typeof options.circResponse !== 'function'
        ) {
          throw new Error('Circular response support is unavailable.');
        }
        return options.circResponse(user);
      };
    };
    //#endregion
  }

  @POST()
  [TestbenchTest.queryMappedUserWithCircuralFromClient](
    @QueryCirc() user: TestBenchPerson,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      try {
        if (!(user instanceof TestBenchPersonCirc)) {
          return false;
        }

        if (!(user.friend instanceof TestBenchPersonCirc)) {
          return false;
        }

        if (!(user.friend.friend instanceof TestBenchPersonCirc)) {
          return false;
        }

        if (!(user.friend.friend.friend instanceof TestBenchPersonCirc)) {
          return false;
        }

        if (user.name !== 'Darek') {
          return false;
        }

        if (user.age !== 40) {
          return false;
        }

        if (user.description !== 'Darek (40)') {
          return false;
        }

        return true;
      } catch (error) {
        console.error(error);

        return false;
      }
    };
    //#endregion
  }
}
