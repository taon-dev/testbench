//#region imports
import {
  APP_INITIALIZER,
  ApplicationConfig,
  Component,
  isDevMode,
  mergeApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  OnInit,
  inject,
  signal,
} from '@angular/core'; // @browser
import { MatTabsModule } from '@angular/material/tabs'; // @browser
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
  Routes,
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import {
  RenderMode,
  ServerRoute,
  provideServerRendering,
  withRoutes,
} from '@angular/ssr';
import Aura from '@primeng/themes/aura'; // @browser
import { TranslationManager } from '@taon-dev/i18n/src';
import { providePrimeNG } from 'primeng/config'; // @browser
import { Taon, TAON_CONTEXT, TaonBaseContext } from 'taon/src';
import { TaonAdmin } from 'taon/src'; // @browser
import { TaonStor } from 'taon-storage/src';

import { TestbenchAutomaticContext } from './app/automatic-test/automatic-test.context';
import { AutomaticTestsComponent } from './app/automatic-test/automatic-tests.component'; // @browser
import { ManualTestsComponent } from './app/manual-test/manual-tests.component'; // @browser
import { configureTestbenchStorageSecret } from './app/manual-test/testbench-storage-secret';
import { TestbenchStorageContext } from './app/manual-test/testbench-storage.context';
import { HOST_CONFIG } from './app.hosts';
import { ENV_ANGULAR_NODE_APP_BUILD_PWA_DISABLE_SERVICE_WORKER } from './lib/env/env.angular-node-app';
//#endregion

//#region testbench component
//#region @browser
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTabsModule, AutomaticTestsComponent, ManualTestsComponent],
  template: `
    <mat-tab-group
      [selectedIndex]="selectedTab()"
      (selectedIndexChange)="onTabChange($event)">
      <mat-tab label="Automatic Tests">
        <app-automatic-tests />
      </mat-tab>

      <mat-tab label="Manual Tests">
        <app-manual-tests />
      </mat-tab>
    </mat-tab-group>
  `,
})
export class TestbenchApp implements OnInit {
  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  readonly selectedTab = signal(0);

  ngOnInit(): void {
    void Taon.removeLoader(1000);

    this.route.queryParamMap.subscribe(params => {
      this.selectedTab.set(params.get('tab') === 'manual' ? 1 : 0);
    });
  }

  onTabChange(index: number): void {
    if (index === this.selectedTab()) {
      return;
    }

    this.selectedTab.set(index);

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tab: index === 1 ? 'manual' : 'automatic',
      },
      queryParamsHandling: 'merge',
    });
  }
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
    TestbenchAutomaticContext,
    TestbenchStorageContext,
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

  //#region @backendFunc
  // const runtimeParams = startParams as
  //   | (Taon.StartParams & { cloudflareEnv?: Record<string, unknown> })
  //   | undefined;

  // const workerSecret =
  //   runtimeParams?.cloudflareEnv?.['TAON_TESTBENCH_STORAGE_SECRET'];

  // const nodeProcess = (
  //   globalThis as typeof globalThis & {
  //     process?: { env?: Record<string, string | undefined> };
  //   }
  // ).process;
  // const secret =
  //   (typeof workerSecret === 'string' ? workerSecret : undefined) ??
  //   nodeProcess?.env?.['TAON_TESTBENCH_STORAGE_SECRET'];

  const secret = '12323423491232342349asdasdasda5555';

  configureTestbenchStorageSecret(secret);

  //#endregion
};

//#endregion

//#region default export

export default TestbenchStartFunction;

//#endregion
