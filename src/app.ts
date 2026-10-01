//#region imports

import {
  APP_INITIALIZER,
  ApplicationConfig,
  Component,
  Injectable,
  OnInit,
  inject,
  isDevMode,
  mergeApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core'; // @browser
import { MatButtonModule } from '@angular/material/button'; // @browser
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  Routes,
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import Aura from '@primeng/themes/aura'; // @browser
import { Translation, TranslationManager } from '@taon-dev/i18n/src';
import { providePrimeNG } from 'primeng/config'; // @browser
import {
  Body,
  GET,
  POST,
  Query,
  TAON_CONTEXT,
  Taon,
  TaonBaseAbstractEntity,
  TaonBaseAngularService,
  TaonBaseContext,
  TaonBaseController,
  TaonController,
  TaonEntity,
} from 'taon/src';
import { TaonAdmin } from 'taon/src'; // @browser
import { TaonStor } from 'taon-storage/src';
import { _ } from 'tnp-core/src';

import { HOST_CONFIG } from './app.hosts';
import { ENV_ANGULAR_NODE_APP_BUILD_PWA_DISABLE_SERVICE_WORKER } from './lib/env/env.angular-node-app';

// @placeholder-for-imports

//#endregion

//#region constants

console.log('🚀 [ TAON IS STARTING ]');

const t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP, {
  // debug: true
});

//#endregion

//#region testbench tests

export enum TestbenchTest {
  //#region backend -> frontend

  getBoolean = 'getBoolean',
  getNumber = 'getNumber',
  getZero = 'getZero',
  getString = 'getString',
  getEmptyString = 'getEmptyString',
  getNull = 'getNull',
  getStringArray = 'getStringArray',
  getNumberArray = 'getNumberArray',
  getObject = 'getObject',
  getMappedObject = 'getMappedObject',
  getMappedObjectRawJson = 'getMappedObjectRawJson',
  getMappedObjectArray = 'getMappedObjectArray',
  getMappedObjectArrayRawJson = 'getMappedObjectArrayRawJson',
  getMixedObject = 'getMixedObject',
  throwError = 'throwError',

  //#endregion

  //#region frontend -> backend / body
  bodyMappedUserWithCircuralFromClient = 'bodyMappedUserWithCircuralFromClient',

  bodyMappedUserWithCircuralFromServer = 'bodyMappedUserWithCircuralFromServer',

  bodyMappedUser = 'bodyMappedUser',
  bodyNestedMappedEntities = 'bodyNestedMappedEntities',
  bodyNumber = 'bodyNumber',
  bodyBoolean = 'bodyBoolean',
  bodyString = 'bodyString',

  //#endregion

  //#region frontend -> backend / query

  queryNumber = 'queryNumber',
  queryBoolean = 'queryBoolean',
  queryString = 'queryString',

  queryMappedUser = 'queryMappedUser',

  queryNestedMappedEntities = 'queryNestedMappedEntities',

  queryMappedUserWithCircuralFromClient = 'queryMappedUserWithCircuralFromClient',

  // queryMappedUserWithCircuralFromServer = 'queryMappedUserWithCircuralFromServer',

  //#endregion
}

type TestBenchTestStatus = 'pending' | 'running' | 'success' | 'failed';

interface TestBenchTestItem {
  test: TestbenchTest;
  status: TestBenchTestStatus;
  error?: string;
}

//#endregion

//#region testbench models

@TaonEntity({
  className: 'TestBenchPerson',
  createTable: true,
})
export class TestBenchPerson extends TaonBaseAbstractEntity {
  name!: string;

  age!: number;

  declare friend: TestBenchPerson;

  get description(): string {
    return `${this.name} (${this.age})`;
  }
}

@TaonEntity({
  className: 'TestBenchPersonCirc',
  createTable: true,
  // defaultModelMapping: () => ({
  //   '': TestBenchPersonCirc,
  //   friend: TestBenchPersonCirc,
  // }),
})
export class TestBenchPersonCirc extends TaonBaseAbstractEntity {
  name!: string;

  age!: number;

  declare friend: TestBenchPerson;

  get description(): string {
    return `${this.name} (${this.age})`;
  }
}

@TaonEntity({
  className: 'TestBenchBook',
  createTable: true,
})
export class TestBenchBook extends TaonBaseAbstractEntity {
  title!: string;

  pages!: number;

  get description(): string {
    return `${this.title} (${this.pages} pages)`;
  }
}

//#endregion

//#region testbench controller

@TaonController({
  className: 'TestBenchController',
})
export class TestBenchController extends TaonBaseController {
  //#region backend -> frontend

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

  /**
   * Same backend value as getMappedObjectArray.
   *
   * Separate endpoint/test name exists so every test has a unique
   * TestbenchTest enum value.
   */

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
  [TestbenchTest.throwError](): Taon.Response<any> {
    //#region @websqlFunc
    return async () => {
      throw new Error('Intentional TestBench backend error');
    };
    //#endregion
  }

  //#endregion

  //#region frontend -> backend / body

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
      return () => user;
    };
    //#endregion
  }

  @POST()
  [TestbenchTest.bodyMappedUserWithCircuralFromClient](
    @Body(void 0, {
      circ: true,
    })
    user: TestBenchPerson,
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
  [TestbenchTest.queryMappedUserWithCircuralFromClient](
    @Query(void 0, {
      circ: true,
    })
    user: TestBenchPerson,
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
  [TestbenchTest.queryNestedMappedEntities](
    @Query('nestedBook') book: TestBenchBook,
    @Query('nestedUser') user: TestBenchPerson,
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

  //#endregion

  //#region frontend -> backend / query

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

  //#endregion
}

//#endregion

//#region testbench api service

//#region @browser

@Injectable({
  providedIn: 'root',
})
export class TestBenchApiService extends TaonBaseAngularService {
  testBenchController = this.injectController(TestBenchController);
}

//#endregion

//#endregion

//#region testbench app

//#region @browser

@Component({
  selector: 'app-root',

  imports: [MatButtonModule],

  template: `
    <main
      style="
        max-width: 1000px;
        margin: 40px auto;
        padding: 24px;
        font-family: sans-serif;
      ">
      <h1>Taon TestBench</h1>

      <button
        mat-flat-button
        color="primary"
        [disabled]="runningAll()"
        (click)="startTests()">
        {{ runningAll() ? 'Running tests...' : 'Start all tests' }}
      </button>

      <h2 style="margin-top: 32px">Tests</h2>

      <div
        style="
          display: flex;
          flex-direction: column;
          gap: 10px;
        ">
        @for (item of tests(); track item.test) {
          <div
            style="
              display: flex;
              align-items: flex-start;
              gap: 12px;
            ">
            <div
              style="
                width: 28px;
                padding-top: 8px;
                flex-shrink: 0;
              ">
              @switch (item.status) {
                @case ('pending') {
                  ⏳
                }

                @case ('running') {
                  🔄
                }

                @case ('success') {
                  ✅️
                }

                @case ('failed') {
                  ⛔️
                }
              }
            </div>

            <div
              style="
                flex: 1;
                min-width: 0;
                padding-top: 8px;
              ">
              {{ testDisplayName(item.test) }}

              @if (item.error) {
                <pre
                  style="
                    margin: 8px 0 0;
                    white-space: pre-wrap;
                    overflow-wrap: anywhere;
                    color: #c62828;
                  "
                  >{{ item.error }}</pre
                >
              }
            </div>

            <button
              mat-button
              [disabled]="item.status === 'running'"
              (click)="runTest(item.test)">
              Run
            </button>
          </div>
        }
      </div>
    </main>
  `,
})
export class TestbenchApp implements OnInit {
  private readonly testBenchApiService = inject(TestBenchApiService);

  readonly runningAll = signal(false);

  readonly tests = signal<TestBenchTestItem[]>([]);

  ngOnInit(): void {
    void Taon.removeLoader(1000);

    this.resetTests();
  }

  //#region tests initialization

  private resetTests(): void {
    this.tests.set(
      Object.values(TestbenchTest).map(test => ({
        test,
        status: 'pending' as const,
      })),
    );
  }

  //#endregion

  //#region display

  testDisplayName(test: TestbenchTest): string {
    return `Requesting ${_.startCase(test)} (${test})`;
  }

  //#endregion

  //#region run tests

  async startTests(): Promise<void> {
    if (this.runningAll()) {
      return;
    }

    this.runningAll.set(true);
    this.resetTests();

    try {
      for (const test of Object.values(TestbenchTest)) {
        await this.runTest(test);
      }
    } finally {
      this.runningAll.set(false);
    }
  }

  async runTest(test: TestbenchTest): Promise<void> {
    this.patchTest(test, {
      status: 'running',
      error: undefined,
    });

    try {
      await this[test]();

      this.patchTest(test, {
        status: 'success',
        error: undefined,
      });
    } catch (error) {
      console.error(`[Taon TestBench] "${test}" failed`, error);

      this.patchTest(test, {
        status: 'failed',
        error:
          error instanceof Error ? error.stack || error.message : String(error),
      });
    }
  }

  //#endregion

  //#region test implementations / backend -> frontend

  async [TestbenchTest.getBoolean](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getBoolean
      ]().request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.getNumber](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getNumber
      ]().request!();

    this.assertEqual(data.body.numericValue, 123.456);
  }

  async [TestbenchTest.getZero](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getZero
      ]().request!();

    this.assertEqual(data.body.numericValue, 0);
  }

  async [TestbenchTest.getString](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getString
      ]().request!();

    this.assertEqual(data.body.text, 'hello from Taon backend');
  }

  async [TestbenchTest.getEmptyString](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getEmptyString
      ]().request!();

    this.assertEqual(data.body.text, '');
  }

  async [TestbenchTest.getNull](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getNull
      ]().request!();

    this.assertEqual(data.body.json, null);
  }

  async [TestbenchTest.getStringArray](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getStringArray
      ]().request!();

    const value = data.body.json;

    this.assert(Array.isArray(value), 'Expected value to be an array');

    this.assertEqual(value.length, 3);
    this.assertEqual(value[0], 'one');
    this.assertEqual(value[1], 'two');
    this.assertEqual(value[2], 'three');
  }

  async [TestbenchTest.getNumberArray](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getNumberArray
      ]().request!();

    const value = data.body.json;

    this.assert(Array.isArray(value), 'Expected value to be an array');

    this.assertEqual(value.length, 3);
    this.assertEqual(value[0], 10);
    this.assertEqual(value[1], 20);
    this.assertEqual(value[2], 30);
  }

  async [TestbenchTest.getObject](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getObject
      ]().request!();

    const value = data.body.json;

    this.assertEqual(value.name, 'test-object');
    this.assertEqual(value.enabled, true);
    this.assertEqual(value.count, 123);
  }

  async [TestbenchTest.getMappedObject](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getMappedObject
      ]().request!();

    const value = data.body.json;

    this.assert(
      value instanceof TestBenchPerson,
      'Expected body.json to be instance of TestBenchPerson',
    );

    this.assertEqual(value.name, 'Darek');
    this.assertEqual(value.age, 40);

    this.assertEqual(value.description, 'Darek (40)');
  }

  async [TestbenchTest.getMappedObjectRawJson](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getMappedObjectRawJson
      ]().request!();

    const value = data.body.rawJson;

    this.assert(
      !(value instanceof TestBenchPerson),
      'Expected body.rawJson NOT to be TestBenchPerson instance',
    );

    this.assertEqual((value as any).name, 'Darek');

    this.assertEqual((value as any).age, 40);
  }

  async [TestbenchTest.getMappedObjectArray](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getMappedObjectArray
      ]().request!();

    const value = data.body.json;

    this.assert(Array.isArray(value), 'Expected value to be an array');

    this.assertEqual(value.length, 2);

    this.assert(
      value[0] instanceof TestBenchPerson,
      'Expected first value to be TestBenchPerson',
    );

    this.assert(
      value[1] instanceof TestBenchPerson,
      'Expected second value to be TestBenchPerson',
    );

    this.assertEqual(value[0].description, 'John (30)');

    this.assertEqual(value[1].description, 'Alice (25)');
  }

  async [TestbenchTest.getMappedObjectArrayRawJson](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getMappedObjectArrayRawJson
      ]().request!();

    const value = data.body.rawJson;

    this.assert(Array.isArray(value), 'Expected rawJson value to be an array');

    this.assert(
      !(value[0] instanceof TestBenchPerson),
      'Expected rawJson value NOT to be TestBenchPerson',
    );

    this.assertEqual((value[0] as any).name, 'John');

    this.assertEqual((value[1] as any).name, 'Alice');
  }

  async [TestbenchTest.getMixedObject](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.getMixedObject
      ]().request!();

    const value = data.body.json;

    this.assertEqual(value.boolean, true);
    this.assertEqual(value.number, 123);
    this.assertEqual(value.string, 'hello');

    this.assert(Array.isArray(value.array), 'Expected nested array');

    this.assertEqual(value.nested.foo, 'bar');
  }

  async [TestbenchTest.throwError](): Promise<void> {
    let errorWasThrown = false;

    try {
      await this.testBenchApiService.testBenchController[
        TestbenchTest.throwError
      ]().request!();
    } catch {
      errorWasThrown = true;
    }

    this.assert(errorWasThrown, 'Expected backend request to throw');
  }

  //#endregion

  //#region test implementations / frontend -> backend / body

  async [TestbenchTest.bodyMappedUser](): Promise<void> {
    const user = new TestBenchPerson();

    user.name = 'Darek';
    user.age = 40;

    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.bodyMappedUser
      ](user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.bodyMappedUserWithCircuralFromClient](): Promise<void> {
    const user = new TestBenchPersonCirc();
    const friend = new TestBenchPersonCirc();
    friend.name = 'Franek';
    friend.age = 30;
    user.friend = friend;
    user.name = 'Darek';
    user.age = 40;
    friend.friend = user;

    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.bodyMappedUserWithCircuralFromClient
      ](user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.bodyMappedUserWithCircuralFromServer](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.bodyMappedUserWithCircuralFromServer
      ]().request!();

    const user = data.body.json;
    // this.assertEqual(data.body.json, true);

    this.assert(
      user instanceof TestBenchPerson,
      'Expected value to be TestBenchPerson',
    );

    this.assert(
      user.friend instanceof TestBenchPerson,
      'Expected friend value to be TestBenchPerson',
    );

    this.assert(
      user.friend.friend instanceof TestBenchPerson,
      'Expected friend.friend value to be TestBenchPerson',
    );
  }

  async [TestbenchTest.queryMappedUserWithCircuralFromClient](): Promise<void> {
    const user = new TestBenchPersonCirc();

    user.name = 'Darek';
    user.age = 40;
    user.friend = user;

    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.queryMappedUserWithCircuralFromClient
      ](user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.queryMappedUser](): Promise<void> {
    const user = new TestBenchPerson();

    user.name = 'Darek';
    user.age = 40;

    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.queryMappedUser
      ](user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.bodyNestedMappedEntities](): Promise<void> {
    const book = new TestBenchBook();

    book.title = 'Taon Book';
    book.pages = 123;

    const user = new TestBenchPerson();

    user.name = 'Darek';
    user.age = 40;

    const data = await this.testBenchApiService.testBenchController[
      TestbenchTest.bodyNestedMappedEntities
    ](book, user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.queryNestedMappedEntities](): Promise<void> {
    const book = new TestBenchBook();

    book.title = 'Taon Book';
    book.pages = 123;

    const user = new TestBenchPerson();

    user.name = 'Darek';
    user.age = 40;

    const data = await this.testBenchApiService.testBenchController[
      TestbenchTest.queryNestedMappedEntities
    ](book, user).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.bodyNumber](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.bodyNumber
      ](123.456).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.bodyBoolean](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.bodyBoolean
      ](true).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.bodyString](): Promise<void> {
    const data = await this.testBenchApiService.testBenchController[
      TestbenchTest.bodyString
    ]('hello from frontend').request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  //#endregion

  //#region test implementations / frontend -> backend / query

  async [TestbenchTest.queryNumber](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.queryNumber
      ](123.456).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.queryBoolean](): Promise<void> {
    const data =
      await this.testBenchApiService.testBenchController[
        TestbenchTest.queryBoolean
      ](true).request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  async [TestbenchTest.queryString](): Promise<void> {
    const data = await this.testBenchApiService.testBenchController[
      TestbenchTest.queryString
    ]('hello from frontend').request!();

    this.assertEqual(data.body.booleanValue, true);
  }

  //#endregion

  //#region test helpers

  private patchTest(
    test: TestbenchTest,
    patch: Partial<TestBenchTestItem>,
  ): void {
    this.tests.update(tests =>
      tests.map(item =>
        item.test === test
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  }

  private assert(
    condition: unknown,
    message = 'Assertion failed',
  ): asserts condition {
    if (!condition) {
      throw new Error(message);
    }
  }

  private assertEqual<T>(actual: T, expected: T): void {
    if (actual !== expected) {
      throw new Error(
        `Expected ${JSON.stringify(expected)}, ` +
          `received ${JSON.stringify(actual)}`,
      );
    }
  }

  //#endregion
}

//#endregion

//#endregion

//#region testbench routes

//#region @browser

export const TestbenchServerRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];

export const TestbenchClientRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      if (TestbenchClientRoutes.length === 1) {
        return '';
      }

      return TestbenchClientRoutes.find(r => r.path !== '')!.path!;
    },
  },

  // PUT ALL ROUTES HERE
  // @placeholder-for-routes
];

//#endregion

//#endregion

//#region testbench app configs

//#region @browser

export const TestbenchAppConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),

    {
      provide: TAON_CONTEXT,
      useFactory: () => TestbenchContext,
    },

    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),

    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => TestbenchStartFunction,
    },

    provideBrowserGlobalErrorListeners(),

    provideRouter(
      TestbenchClientRoutes,
      withHashLocation(),
      withComponentInputBinding(),
    ),

    provideClientHydration(withEventReplay()),

    provideServiceWorker('ngsw-worker.js', {
      enabled:
        !isDevMode() && !ENV_ANGULAR_NODE_APP_BUILD_PWA_DISABLE_SERVICE_WORKER,

      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};

export const TestbenchServerConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(TestbenchServerRoutes))],
};

export const TestbenchConfig = mergeApplicationConfig(
  TestbenchAppConfig,
  TestbenchServerConfig,
);

//#endregion

//#endregion

//#region testbench context

var TestbenchContext = Taon.createContext(() => ({
  ...HOST_CONFIG['TestbenchContext'],

  contexts: {
    TaonBaseContext,
  },

  controllers: {
    TestBenchController,
  },

  entities: {
    TestBenchPerson,
    TestBenchPersonCirc,
    TestBenchBook,
  },

  database: true,

  disabledRealtime: false,
}));

//#endregion

//#region testbench start function

export const TestbenchStartFunction = async (
  startParams?: Taon.StartParams,
): Promise<void> => {
  TranslationManager.Instance.visibleLanguages = ['en-US', 'pl-PL'];

  //#region @browser

  TaonAdmin.init();

  await TaonStor.awaitAll();

  //#endregion

  await TestbenchContext.initialize(startParams);
};

//#endregion

//#region default export

export default TestbenchStartFunction;

//#endregion
