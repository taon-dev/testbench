import type { Type } from '@angular/core';

export interface ManualTestDefinition {
  id: string;
  title: string;
  description: string;
  component: Type<unknown>;
}
