// src/app/valuation-quality-control/quality-control-view.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { QualityControl } from '../../../models/QualityControl';         // Adjust path as needed
import { QualityControlService } from '../../../services/quality-control.service'; // Adjust path as needed

@Component({
  selector: 'app-valuation-quality-control',
  templateUrl: './quality-control-view.component.html',
  styleUrls: ['./quality-control-view.component.scss']
})
export class QualityControlViewComponent implements OnInit {
  loading = true;
  error: string | null = null;
  qualityControl: QualityControl | null = null;

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
        this.fetchQualityControl();
      } else {
        this.loading = false;
        this.error = 'Missing required query parameters (vehicleNumber / applicantContact).';
      }
    });
  }

  private fetchQualityControl() {
    this.loading = true;
    this.error = null;

    this.qcService
      .getQualityControlDetails(this.valuationId, this.vehicleNumber, this.applicantContact)
      .subscribe({
        next: (data: QualityControl) => {
          this.qualityControl = data;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          if (err.error && err.error.message) {
            this.error = err.error.message;
          } else if (err.status === 404) {
            this.error = 'Quality control record not found.';
          } else {
            this.error = `Unexpected error (${err.status}): ${err.message}`;
          }
        }
      });
  }

  /** Navigate to an edit screen (implement route as needed) */
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

  /** Delete (or mark deleted) – implement your own logic if needed */
  onDelete(): void {
    if (!confirm('Delete this quality control record?')) return;
    this.qcService
      .deleteQualityControlDetails(this.valuationId, this.vehicleNumber, this.applicantContact)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => (this.error = err.message || 'Delete failed')
      });
  }

  onBack(): void {
    this.router.navigate(['/valuation', this.valuationId], {
      queryParams: {
        vehicleNumber: this.vehicleNumber,
        applicantContact: this.applicantContact
      }
    });
  }
}
