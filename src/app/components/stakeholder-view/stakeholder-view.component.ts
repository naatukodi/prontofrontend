import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StakeholderService } from '../../services/stakeholder.service';

@Component({
  selector: 'app-stakeholder-view',
  templateUrl: './stakeholder-view.component.html',
  styleUrls: ['./stakeholder-view.component.scss']
})
export class StakeholderViewComponent implements OnInit {
  valuationId!: string;
  vehicleNumber!: string;
  applicantContact!: string;

  loading = true;
  error: string | null = null;

  otherDocuments: Array<{ type: string; filePath: string; uploadedAt: string }> = [];

  stakeholder!: {
    name: string;
    executiveName: string;
    executiveContact: string;
    executiveWhatsapp: string;
    executiveEmail: string;
    applicant: { name: string; contact: string };
    documents: Array<{ type: string; filePath: string; uploadedAt: string }>;
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: StakeholderService
  ) {}

  ngOnInit(): void {
    this.valuationId = this.route.snapshot.paramMap.get('valuationId')!;
    this.route.queryParamMap.subscribe(params => {
      this.vehicleNumber   = params.get('vehicleNumber')!;
      this.applicantContact = params.get('applicantContact')!;
      this.loadStakeholder();
    });
  }

  private loadStakeholder() {
    this.loading = true;
    this.error   = null;
    this.svc.getStakeholder(
      this.valuationId,
      this.vehicleNumber,
      this.applicantContact
    ).subscribe({
      next: data => {
        this.stakeholder = data;
        this.loading     = false;
      },
      error: err => {
        this.error   = err.message || 'Failed to load stakeholder';
        this.loading = false;
      }
    });
  }

  onEdit() {
    // reuse your existing stakeholder-update route
    this.router.navigate(
      ['/stakeholder-update', this.valuationId],
      {
        queryParams: {
          vehicleNumber: this.vehicleNumber,
          applicantContact: this.applicantContact
        }
      }
    );
  }

  getDocumentFilePath(type: string): string | undefined {
  return this.stakeholder?.documents?.find((d: any) => d.type === type)?.filePath;
}

setOtherDocuments() {
    // Assuming stakeholder.documents is an array of document objects
    // and each document has a type, fileName, and filePath property
    if (this.stakeholder && Array.isArray(this.stakeholder.documents)) {
      this.otherDocuments = this.stakeholder.documents.filter(
        doc => doc.type !== 'RC' && doc.type !== 'Insurance'
      );
    }
  }

  onDelete() {
    if (!confirm('Delete this stakeholder?')) return;
    this.svc.deleteStakeholder(
      this.valuationId,
      this.vehicleNumber,
      this.applicantContact
    ).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.error = err.message || 'Delete failed'
    });
  }
}
