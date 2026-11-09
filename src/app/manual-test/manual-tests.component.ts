import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { manualTestRegistry } from './manual-test.registry';

@Component({
  selector: 'app-manual-tests',
  standalone: true,
  imports: [MatExpansionModule, NgComponentOutlet],
  templateUrl: './manual-tests.component.html',
  styleUrl: './manual-tests.component.scss',
})
export class ManualTestsComponent {
  readonly tests = manualTestRegistry;
}
