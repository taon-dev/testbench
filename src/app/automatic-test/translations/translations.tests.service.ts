import { Injectable, inject } from '@angular/core';
import { Translation } from '@taon-dev/i18n/src';
import { Taon } from 'taon/src';

import { TestbenchAssertions } from '../testbench-assertions';
import { TestbenchTest } from '../testbench-test-ids';
import { TestBenchApiService } from '../testbench.api.service';

@Injectable({ providedIn: 'root' })
export class TranslationTests extends TestbenchAssertions {
  private readonly testBenchApiService = inject(TestBenchApiService);

  private readonly t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP).for(this);

  private readonly methods: Record<string, () => Promise<void>> = {
    [TestbenchTest.shouldTranslateMessage]: () => this[TestbenchTest.shouldTranslateMessage](),
  };

  run(id: string): Promise<void> {
    const test = this.methods[id];
    if (!test) throw new Error(`Test "${id}" is not part of TranslationTests.`);
    return test();
  }

  async [TestbenchTest.shouldTranslateMessage](): Promise<void> {
    try {
      for (const [language, expected] of [
        ['en-US', 'Tank'],
        ['pl-PL', 'Czołg'],
        ['de-DE', 'Panzer'],
      ] as const) {
        await this.testBenchApiService.testBenchTranslationsController.t.changeFileLang(language);
        const data =
          await this.testBenchApiService.testBenchTranslationsController[TestbenchTest.shouldTranslateMessage]().request!();

        this.assertEqual(data.body.text, expected);
      }
    } finally {
      await this.t.changeFileLang('en-US');
    }
  }
}
