// src/app/components/final-report-view/final-report-view.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ValuationService } from '../../../services/valuation.service';
import { FinalReport, PhotoUrls } from '../../../models/final-report.model';

@Component({
  selector: 'app-final-report-view',
  templateUrl: './final-report.component.html',
  styleUrls: ['./final-report.component.scss'],
})
export class FinalReportComponent implements OnInit {
  valuationId!: string;
  vehicleNumber!: string;
  applicantContact!: string;

  loading = true;
  error: string | null = null;

  report!: FinalReport;
  // Change this from string[] to (keyof PhotoUrls)[]
  photoKeys: (keyof PhotoUrls)[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private valuationService: ValuationService
  ) {}

  ngOnInit(): void {
    this.valuationId = this.route.snapshot.paramMap.get('valuationId')!;
    this.route.queryParamMap.subscribe((params) => {
      this.vehicleNumber = params.get('vehicleNumber')!;
      this.applicantContact = params.get('applicantContact')!;
      this.loadFinalReport();
    });
  }

  private loadFinalReport(): void {
    this.loading = true;
    this.error = null;

    this.valuationService
      .getFinalReport(this.valuationId, this.vehicleNumber, this.applicantContact)
      .subscribe({
        next: (data: FinalReport) => {
          this.report = data;

          // Cast Object.keys(...) to (keyof PhotoUrls)[]
          this.photoKeys = Object.keys(this.report.photoUrls) as (keyof PhotoUrls)[];

          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load final report';
          this.loading = false;
        },
      });
  }

  onBack(): void {
    this.router.navigate(['/valuation', this.valuationId], {
      queryParams: {
        vehicleNumber: this.vehicleNumber,
        applicantContact: this.applicantContact,
      },
    });
  }
}
