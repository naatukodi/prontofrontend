// src/app/valuation-vehicle-details/valuation-vehicle-details.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleDetails } from '../../../models/VehicleDetails'; // Adjust the import path as needed
import { environment } from '../../../../environments/environment'; // Adjust the import path as needed
import { ValuationService } from '../../../services/valuation.service'; // Adjust the import path as needed

@Component({
  selector: 'app-valuation-vehicle-details',
  templateUrl: './valuation-vehicle-details.component.html',
  styleUrls: ['./valuation-vehicle-details.component.scss']
})
export class ValuationVehicleDetailsComponent implements OnInit {
  loading = true;
  error: string | null = null;
  vehicleDetails: VehicleDetails | null = null;

  // These come from the route params or query params:
  valuationId!: string;
  vehicleNumber!: string;
  applicantContact!: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private valuationService: ValuationService // Use the service for fetching data
  ) {}

  ngOnInit(): void {
    // 1) Fetch valuationId from route parameters
    this.route.paramMap.subscribe(params => {
      const vid = params.get('valuationId');
      if (vid) {
        this.valuationId = vid;
        this.loadQueryParamsAndFetch();
      } else {
        // No valuationId → show error
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
        this.fetchVehicleDetails();
      } else {
        this.loading = false;
        this.error = 'Missing required query parameters (vehicleNumber / applicantContact).';
      }
    });
  }

  private fetchVehicleDetails() {
    this.loading = true;
    this.error = null;

    // Build the URL: GET https://…/api/valuations/{valuationId}/vehicledetails
    const baseUrl = 'https://prontobackend-bhdnbec2fvd3ecfk.eastus2-01.azurewebsites.net';
    const url = `${baseUrl}/api/valuations/${this.valuationId}/vehicledetails`;

    // Attach query params: vehicleNumber, applicantContact
    const params = new HttpParams()
      .set('vehicleNumber', this.vehicleNumber)
      .set('applicantContact', this.applicantContact);

    this.http
      .get<VehicleDetails>(url, { params, responseType: 'json' })
      .subscribe({
        next: (data) => {
          this.vehicleDetails = data;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          if (err.error && err.error.message) {
            this.error = err.error.message;
          } else if (err.status === 404) {
            this.error = 'Vehicle details not found.';
          } else {
            this.error = `Unexpected error (${err.status}): ${err.message}`;
          }
        }
      });
  }

  /**
   * Returns the filePath for a given document type (e.g. “RC”, “Insurance”, etc.).
   * If no matching document is found, returns an empty string.
   */
  getDocumentFilePath(type: string): string {
    if (!this.vehicleDetails) {
      return '';
    }
    const doc = this.vehicleDetails.documents.find(d => d.type === type);
    return doc ? doc.filePath : '';
  }

  /** Navigate to an edit screen or open a dialog (implement as needed) */
  onEdit(): void {
    this.router.navigate(
      ['valuation', this.valuationId, 'vehicle-details', 'update'],
      {
        queryParams: {
          vehicleNumber: this.vehicleNumber,
          applicantContact: this.applicantContact
        }
      }
    );
  }

  onDelete(): void {
    if (!confirm('Delete this vehicle details?')) return;
    
    this.valuationService.updateVehicleDetails(
      this.valuationId,
      this.vehicleNumber,
      this.applicantContact,
      { deleted: true } // Add request body to mark for deletion
    ).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => this.error = err.message || 'Delete failed'
    });
  }

  onBack(): void {
    // Navigate back to the previous screen
    this.router.navigate(['/valuation', this.valuationId], {
      queryParams: {
        vehicleNumber: this.vehicleNumber,
        applicantContact: this.applicantContact
      }
    });
  }
}
