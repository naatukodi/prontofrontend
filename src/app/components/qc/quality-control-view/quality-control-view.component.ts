// src/app/valuation-quality-control/quality-control-view.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { QualityControlViewModel } from '../../../models/QualityControlViewModel';
import { QualityControlService } from '../../../services/quality-control.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-valuation-quality-control',
  templateUrl: './quality-control-view.component.html',
  styleUrls: ['./quality-control-view.component.scss']
})
export class QualityControlViewComponent implements OnInit {
  loading = true;
  error: string | null = null;

  // Combined view‐model containing both QC data and price‐estimate data
  viewModel: QualityControlViewModel | null = null;

  // route param & query params
  valuationId!: string;
  vehicleNumber!: string;
  applicantContact!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qcService: QualityControlService
  ) {}

  ngOnInit(): void {
    // 1) Fetch valuationId from route parameters
    this.route.paramMap.subscribe(params => {
      const vid = params.get('valuationId');
      if (vid) {
        this.valuationId = vid;
        this.loadQueryParamsAndFetch();
      } else {
        this.loading = false;
        this.error = 'Valuation ID is missing in the route.';
      }
    });
  }

  private loadQueryParamsAndFetch() {
    // 2) Fetch vehicleNumber & applicantContact from queryParams
    this.route.queryParamMap.subscribe(qp => {
      const vn = qp.get('vehicleNumber');
      const ac = qp.get('applicantContact');
      if (vn && ac) {
        this.vehicleNumber = vn;
        this.applicantContact = ac;
        this.fetchAllData();
      } else {
        this.loading = false;
        this.error = 'Missing required query parameters (vehicleNumber / applicantContact).';
      }
    });
  }

  /**
   * Performs both HTTP calls in parallel:
   *   1) getQualityControlDetails(...)
   *   2) getValuationEstimate(...)
   *
   * Then merges results into `this.viewModel`.
   */
  private fetchAllData(): void {
    this.loading = true;
    this.error = null;

    const qc$ = this.qcService.getQualityControlDetails(
      this.valuationId,
      this.vehicleNumber,
      this.applicantContact
    );

    const ve$ = this.qcService.getValuationEstimate(
      this.valuationId,
      this.vehicleNumber,
      this.applicantContact
    );

    // Use forkJoin to run both requests in parallel
    forkJoin({ qcData: qc$, veData: ve$ }).subscribe({
      next: ({ qcData, veData }) => {
        this.viewModel = {
          overallRating:  qcData.overallRating,
          valuationAmount: qcData.valuationAmount,
          chassisPunch:     qcData.chassisPunch,
          remarks:          qcData.remarks,

          lowRange:    veData.lowRange,
          midRange:    veData.midRange,
          highRange:   veData.highRange,
          rawResponse: veData.rawResponse
        };
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.error?.message) {
          this.error = err.error.message;
        } else if (err.status === 404) {
          this.error = 'Quality control or valuation estimate record not found.';
        } else {
          this.error = `Unexpected error (${err.status}): ${err.message}`;
        }
      }
    });
  }

  /** Navigate to an edit screen */
  onEdit(): void {
    this.router.navigate(
      ['/valuation', this.valuationId, 'quality-control', 'update'],
      {
        queryParams: {
          vehicleNumber: this.vehicleNumber,
          applicantContact: this.applicantContact
        }
      }
    );
  }

  /** Delete this quality control record */
  onDelete(): void {
    if (!confirm('Delete this quality control record?')) return;
    this.qcService
      .deleteQualityControlDetails(this.valuationId, this.vehicleNumber, this.applicantContact)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => (this.error = err.message || 'Delete failed')
      });
  }

  /** Go back to the valuation overview */
  onBack(): void {
    this.router.navigate(['/valuation', this.valuationId], {
      queryParams: {
        vehicleNumber: this.vehicleNumber,
        applicantContact: this.applicantContact
      }
    });
  }
}
