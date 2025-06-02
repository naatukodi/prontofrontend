// src/app/shared/workflow-buttons/workflow-buttons.component.ts

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-workflow-buttons',
  templateUrl: './workflow-buttons.component.html',
  styleUrls: ['./workflow-buttons.component.scss']
})
export class WorkflowButtonsComponent {
  /**
   * `id` is the Valuation ID (route param).
   * `vehicleNumber` and `applicantContact` are passed as query params.
   */
  @Input() id!: string;
  @Input() vehicleNumber!: string;
  @Input() applicantContact!: string;

  constructor() { }
}
