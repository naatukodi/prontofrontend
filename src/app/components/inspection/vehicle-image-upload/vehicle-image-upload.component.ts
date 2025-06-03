// src/app/vehicle-image-upload/vehicle-image-upload.component.ts

import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  HttpEvent,
  HttpEventType,
  HttpErrorResponse
} from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { VehicleInspectionService } from '../../../services/vehicle-inspection.service'; 

type ImageKey =
  | 'frontLeftSide'
  | 'frontRightSide'
  | 'rearLeftSide'
  | 'rearRightSide'
  | 'frontViewGrille'
  | 'rearViewTailgate'
  | 'driverSideProfile'
  | 'passengerSideProfile'
  | 'dashboard'
  | 'instrumentCluster'
  | 'engineBay'
  | 'chassisNumberPlate'
  | 'chassisImprint'
  | 'gearAndSeats'
  | 'dashboardCloseup'
  | 'odometer'
  | 'selfieWithVehicle'
  | 'underbody'
  | 'tiresAndRims';

interface ImageField {
  key: ImageKey;
  label: string;
  optional: boolean;
}

@Component({
  selector: 'app-vehicle-image-upload',
  templateUrl: './vehicle-image-upload.component.html',
  styleUrls: ['./vehicle-image-upload.component.scss']
})
export class VehicleImageUploadComponent implements OnInit {
  valuationId!: string;
  vehicleNumber!: string;
  applicantContact!: string;
  error: string | null = null;

  imageFields: ImageField[] = [
    { key: 'frontLeftSide',       label: 'Front Left Side',           optional: false },
    { key: 'frontRightSide',      label: 'Front Right Side',          optional: false },
    { key: 'rearLeftSide',        label: 'Rear Left Side',            optional: false },
    { key: 'rearRightSide',       label: 'Rear Right Side',           optional: false },
    { key: 'frontViewGrille',     label: 'Front View (grille)',       optional: false },
    { key: 'rearViewTailgate',    label: 'Rear View (tailgate)',      optional: false },
    { key: 'driverSideProfile',   label: 'Driver’s Side Profile',     optional: false },
    { key: 'passengerSideProfile',label: 'Passenger Side Profile',    optional: false },
    { key: 'dashboard',           label: 'Dashboard',                 optional: false },
    { key: 'instrumentCluster',   label: 'Instrument Cluster / Odometer', optional: false },
    { key: 'engineBay',           label: 'Engine Bay',                optional: false },
    { key: 'chassisNumberPlate',  label: 'Chassis Number Plate',      optional: false },
    { key: 'chassisImprint',      label: 'Chassis Imprint (scratched on metal)', optional: false },
    { key: 'gearAndSeats',        label: 'Gear and Seats (interior)', optional: false },
    { key: 'dashboardCloseup',    label: 'Dashboard Close-up (controls)', optional: false },
    { key: 'odometer',            label: 'Odometer',                  optional: false },
    { key: 'selfieWithVehicle',   label: 'Selfie of Inspector with Vehicle', optional: false },
    { key: 'underbody',           label: 'Underbody',                 optional: true  },
    { key: 'tiresAndRims',        label: 'Tires and Rims',            optional: false }
  ];

  selectedFiles: Record<ImageKey, File | null> = {
    frontLeftSide:      null,
    frontRightSide:     null,
    rearLeftSide:       null,
    rearRightSide:      null,
    frontViewGrille:    null,
    rearViewTailgate:   null,
    driverSideProfile:  null,
    passengerSideProfile:null,
    dashboard:          null,
    instrumentCluster:  null,
    engineBay:          null,
    chassisNumberPlate: null,
    chassisImprint:     null,
    gearAndSeats:       null,
    dashboardCloseup:   null,
    odometer:           null,
    selfieWithVehicle:  null,
    underbody:          null,
    tiresAndRims:       null,
  };

  uploadedUrls: Record<ImageKey, string | null> = {
    frontLeftSide:      null,
    frontRightSide:     null,
    rearLeftSide:       null,
    rearRightSide:      null,
    frontViewGrille:    null,
    rearViewTailgate:   null,
    driverSideProfile:  null,
    passengerSideProfile:null,
    dashboard:          null,
    instrumentCluster:  null,
    engineBay:          null,
    chassisNumberPlate: null,
    chassisImprint:     null,
    gearAndSeats:       null,
    dashboardCloseup:   null,
    odometer:           null,
    selfieWithVehicle:  null,
    underbody:          null,
    tiresAndRims:       null,
  };

  uploadProgress: Partial<Record<ImageKey, number>> = {};
  isUploading:    Partial<Record<ImageKey, boolean>> = {};
  uploadError:    Partial<Record<ImageKey, string>> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleInspectionService: VehicleInspectionService
  ) {}

  ngOnInit(): void {
    this.valuationId = this.route.snapshot.paramMap.get('valuationId') || '';
    if (!this.valuationId) {
      this.error = 'Missing valuationId in route.';
      return;
    }

    this.route.queryParamMap.subscribe(params => {
      const vn = params.get('vehicleNumber');
      const ac = params.get('applicantContact');
      if (vn && ac) {
        this.vehicleNumber = vn;
        this.applicantContact = ac;
        this.loadExistingImages();
      } else {
        this.error = 'Missing vehicleNumber or applicantContact in query parameters.';
      }
    });
  }

  private loadExistingImages(): void {
    this.vehicleInspectionService
      .getVehicleImages(this.valuationId, this.vehicleNumber, this.applicantContact)
      .subscribe({
        next: (map: Record<string,string>) => {
          Object.keys(map).forEach((key) => {
            // Normalize “FrontLeftSide” → “frontLeftSide”
            const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
            if ((this.uploadedUrls as any)[normalizedKey] !== undefined) {
              (this.uploadedUrls as any)[normalizedKey] = map[key];
            }
          });
        },
        error: (err) => {
          // 404 or other error: no existing images yet
          console.warn('No existing images or error fetching them', err);
        }
      });
  }

  onFileSelected(
    event: Event,
    fieldKey: ImageKey
  ) {
    const inputEl = event.target as HTMLInputElement;
    if (!inputEl.files || inputEl.files.length === 0) {
      this.selectedFiles[fieldKey] = null;
      return;
    }
    this.selectedFiles[fieldKey] = inputEl.files[0];
    this.uploadError[fieldKey] = undefined;
  }

  private buildSingleFormData(fieldKey: ImageKey): FormData {
    const formData = new FormData();
    const file = this.selectedFiles[fieldKey]!;
    formData.append(fieldKey, file, file.name);
    formData.append('valuationId', this.valuationId);
    formData.append('vehicleNumber', this.vehicleNumber);
    formData.append('applicantContact', this.applicantContact);
    return formData;
  }

  async uploadImage(fieldKey: ImageKey) {
    const isOptional = this.imageFields.find(f => f.key === fieldKey)!.optional;
    if (!this.selectedFiles[fieldKey] && !isOptional) {
      this.uploadError[fieldKey] = `Please select "${this.getLabel(fieldKey)}" image.`;
      return;
    }
    if (!this.selectedFiles[fieldKey] && this.uploadedUrls[fieldKey]) {
      return;
    }

    this.uploadProgress[fieldKey] = 0;
    this.isUploading[fieldKey] = true;
    this.uploadError[fieldKey] = undefined;

    const payload = this.buildSingleFormData(fieldKey);

    try {
      const observable = await this.vehicleInspectionService.uploadPhotos(
        this.valuationId,
        this.vehicleNumber,
        this.applicantContact,
        payload,
        { reportProgress: true, observe: 'events' }
      );
      observable.pipe(
        finalize(() => {
          this.isUploading[fieldKey] = false;
        })
      ).subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress[fieldKey] = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            const body = event.body as { url: string };
            this.uploadedUrls[fieldKey] = body.url;
            this.uploadProgress[fieldKey] = 100;
            this.selectedFiles[fieldKey] = null;
          }
        },
        error: (err: HttpErrorResponse) => {
          this.uploadError[fieldKey] = err.error?.message || 'Upload failed.';
        }
      });
    } catch (err: any) {
      this.isUploading[fieldKey] = false;
      this.uploadError[fieldKey] = err?.message || 'Upload failed.';
    }
  }

  getLabel(fieldKey: ImageKey): string {
    return this.imageFields.find(f => f.key === fieldKey)!.label;
  }

  openImage(url: string): void {
    window.open(url, '_blank');
  }

  onBack(): void {
    this.router.navigate(['/valuation', this.valuationId, 'inspection', 'update'], {
      queryParams: {
        vehicleNumber: this.vehicleNumber,
        applicantContact: this.applicantContact
      }
    });
  }
}
