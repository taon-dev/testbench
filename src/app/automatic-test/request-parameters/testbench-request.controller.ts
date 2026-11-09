import { Body, GET, POST, Query, Taon, TaonBaseController, TaonController } from 'taon/src';
import { TestbenchTest } from '../testbench-test-ids';
import { TestBenchBook, TestBenchPerson } from '../testbench.models';

@TaonController<TestBenchRequestController>({
  className: 'TestBenchRequestController',
})
export class TestBenchRequestController extends TaonBaseController {
  @POST()
  [TestbenchTest.bodyMappedUser](
    @Body() user: TestBenchPerson,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      try {
        if (!(user instanceof TestBenchPerson)) {
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

  @POST()
  [TestbenchTest.bodyNestedMappedEntities](
    @Body('nestedBook') book: TestBenchBook,
    @Body('nestedUser') user: TestBenchPerson,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      try {
        if (!(book instanceof TestBenchBook)) {
          return false;
        }

        if (!(user instanceof TestBenchPerson)) {
          return false;
        }

        if (book.title !== 'Taon Book') {
          return false;
        }

        if (book.pages !== 123) {
          return false;
        }

        if (book.description !== 'Taon Book (123 pages)') {
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

  @POST()
  [TestbenchTest.queryMappedUser](
    @Query() user: TestBenchPerson,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      try {
        if (!(user instanceof TestBenchPerson)) {
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

  @POST()
  [TestbenchTest.queryNestedMappedEntities](
    @Query('nestedBook') book: TestBenchBook,
    @Query('nestedUser') user: TestBenchPerson,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      console.log({ book, user });
      try {
        if (!(book instanceof TestBenchBook)) {
          return false;
        }

        if (!(user instanceof TestBenchPerson)) {
          return false;
        }

        if (book.title !== 'Taon Book') {
          return false;
        }

        if (book.pages !== 123) {
          return false;
        }

        if (book.description !== 'Taon Book (123 pages)') {
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

  @POST()
  [TestbenchTest.bodyNumber](
    @Body('numberFromFE') numberFromFE: number,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      try {
        if (typeof numberFromFE !== 'number') {
          return false;
        }

        if (numberFromFE !== 123.456) {
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
  [TestbenchTest.bodyBoolean](
    @Body('boolFromFE') boolFromFE: boolean,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      try {
        if (typeof boolFromFE !== 'boolean') {
          return false;
        }

        if (boolFromFE !== true) {
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
  [TestbenchTest.bodyString](
    @Body('stringFromFE') stringFromFE: string,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      try {
        if (typeof stringFromFE !== 'string') {
          return false;
        }

        if (stringFromFE !== 'hello from frontend') {
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

  @GET()
  [TestbenchTest.queryNumber](
    @Query('numberFromFE') numberFromFE: number,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      try {
        if (typeof numberFromFE !== 'number') {
          return false;
        }

        if (numberFromFE !== 123.456) {
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

  @GET()
  [TestbenchTest.queryBoolean](
    @Query('boolFromFE') boolFromFE: boolean,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      try {
        if (typeof boolFromFE !== 'boolean') {
          return false;
        }

        if (boolFromFE !== true) {
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

  @GET()
  [TestbenchTest.queryString](
    @Query('stringFromFE') stringFromFE: string,
  ): Taon.Response<boolean> {
    //#region @websqlFunc
    return async () => {
      try {
        if (typeof stringFromFE !== 'string') {
          return false;
        }

        if (stringFromFE !== 'hello from frontend') {
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
