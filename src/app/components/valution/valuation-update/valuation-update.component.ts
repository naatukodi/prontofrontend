// src/app/valuation‐update/valuation‐update.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValuationService } from '../../../services/valuation.service';
import {WorkflowService} from '../../../services/workflow.service'; // Adjust the import path as needed
import { VehicleDetails } from '../../../models/VehicleDetails';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-valuation-update',
  templateUrl: './valuation-update.component.html',
  styleUrls: ['./valuation-update.component.scss']
})
export class ValuationUpdateComponent implements OnInit {
  valuationId!: string;
  vehicleNumber!: string;
  applicantContact!: string;

  form!: FormGroup;
  loading = true;
  error: string | null = null;
  saving = false;
  saveInProgress = false;
  submitInProgress = false;

  // For file uploads
  rcFile?: File;
  insuranceFile?: File;
  otherFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private valuationSvc: ValuationService,
    private workflowSvc: WorkflowService, // Use the service for workflow operations
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // 1) Read route param: valuationId
    this.valuationId = this.route.snapshot.paramMap.get('valuationId')!;

    // 2) Read query params: vehicleNumber, applicantContact
    this.route.queryParamMap.subscribe(params => {
      const vn = params.get('vehicleNumber');
      const ac = params.get('applicantContact');
      if (vn && ac) {
        this.vehicleNumber = vn;
        this.applicantContact = ac;
        this.initForm();
        this.loadVehicleDetails();
      } else {
        this.loading = false;
        this.error = 'Missing vehicleNumber or applicantContact in query parameters.';
      }
    });
  }

  private initForm() {
    // Build a FormGroup with all editable fields
    this.form = this.fb.group({
      // Vehicle Identification
      registrationNumber: [{ value: '', disabled: true }], // typically read‐only
      make: ['', Validators.required],
      model: ['', Validators.required],
      bodyType: ['', Validators.required],
      yearOfMfg: [null, [Validators.required, Validators.min(1900)]],
      monthOfMfg: [null, [Validators.required, Validators.min(1), Validators.max(12)]],

      // Engine & Specs
      engineNumber: ['', Validators.required],
      chassisNumber: ['', Validators.required],
      engineCC: [null, Validators.required],
      grossVehicleWeight: [null],
      seatingCapacity: [null],

      // Registration & RTO
      dateOfRegistration: ['', Validators.required], // ISO date string (YYYY‐MM‐DD)
      rto: ['', Validators.required],
      classOfVehicle: ['', Validators.required],
      categoryCode: [''],
      normsType: [''],
      makerVariant: [''],

      // Owner & Address
      ownerName: ['', Validators.required],
      presentAddress: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      hypothecation: [false],
      lender: [''],

      // Insurance
      insurer: [''],
      insurancePolicyNo: [''],
      insuranceValidUpTo: [''], // ISO date (YYYY‐MM‐DD)

      // Permit & Fitness
      permitNo: [''],
      permitValidUpTo: [''],  // ISO date
      permitType: [''],
      permitIssued: [''],     // ISO date
      permitFrom: [''],       // ISO date
      fitnessNo: [''],
      fitnessValidTo: [''],   // ISO date

      // Pollution & Tax
      pollutionCertificateNumber: [''],
      pollutionCertificateUpto: [''], // ISO date
      taxUpto: [''],                   // ISO date
      taxPaidUpTo: [''],

      // Additional
      idv: [null],
      exShowroomPrice: [null],
      backlistStatus: [false],
      rcStatus: [false],
      manufacturedDate: [''], // ISO date

      // Any URLs (read‐only or editable if you allow)
      stencilTraceUrl: [''],
      chassisNoPhotoUrl: ['']
    });
  }

  private loadVehicleDetails() {
    this.loading = true;
    this.error = null;

    this.valuationSvc
      .getVehicleDetails(this.valuationId, this.vehicleNumber, this.applicantContact)
      .subscribe({
        next: (data: VehicleDetails) => {
          this.patchForm(data);
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load vehicle details.';
          this.loading = false;
        }
      });
  }

  private patchForm(data: VehicleDetails) {
    // Patch all form controls with the API response
    this.form.patchValue({
      registrationNumber: data.registrationNumber,
      make: data.make,
      model: data.model,
      bodyType: data.bodyType,
      yearOfMfg: data.yearOfMfg,
      monthOfMfg: data.monthOfMfg,
      engineNumber: data.engineNumber,
      chassisNumber: data.chassisNumber,
      engineCC: data.engineCC,
      grossVehicleWeight: data.grossVehicleWeight,
      seatingCapacity: data.seatingCapacity,
      dateOfRegistration: data.dateOfRegistration?.slice(0, 10) || '', // "YYYY-MM-DD"
      rto: data.rto,
      classOfVehicle: data.classOfVehicle,
      categoryCode: data.categoryCode,
      normsType: data.normsType,
      makerVariant: data.makerVariant,
      ownerName: data.ownerName,
      presentAddress: data.presentAddress,
      permanentAddress: data.permanentAddress,
      hypothecation: data.hypothecation,
      lender: data.lender,
      insurer: data.insurer,
      insurancePolicyNo: data.insurancePolicyNo,
      insuranceValidUpTo: data.insuranceValidUpTo?.slice(0, 10) || '',
      permitNo: data.permitNo,
      permitValidUpTo: data.permitValidUpTo?.slice(0, 10) || '',
      permitType: data.permitType,
      permitIssued: data.permitIssued?.slice(0, 10) || '',
      permitFrom: data.permitFrom?.slice(0, 10) || '',
      fitnessNo: data.fitnessNo,
      fitnessValidTo: data.fitnessValidTo?.slice(0, 10) || '',
      pollutionCertificateNumber: data.pollutionCertificateNumber,
      pollutionCertificateUpto: data.pollutionCertificateUpto?.slice(0, 10) || '',
      taxUpto: data.taxUpto?.slice(0, 10) || '',
      idv: data.idv,
      exShowroomPrice: data.exShowroomPrice,
      backlistStatus: data.backlistStatus,
      rcStatus: data.rcStatus,
      manufacturedDate: data.manufacturedDate?.slice(0, 10) || '',
      stencilTraceUrl: data.stencilTraceUrl,
      chassisNoPhotoUrl: data.chassisNoPhotoUrl
    });

    // If you want to show existing documents somewhere, you can store them here,
    // but for simplicity this example only uploads new files.
  }

  // Single‐file input for RC or Insurance
  onFileChange(event: Event, field: 'rcFile' | 'insuranceFile') {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.files && inputEl.files.length > 0) {
      this[field] = inputEl.files[0];
    }
  }

  // Multi‐file input for “other” documents
  onMultiFileChange(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    this.otherFiles = inputEl.files ? Array.from(inputEl.files) : [];
  }

  private buildFormData(): FormData {
    const fd = new FormData();
    const v = this.form.getRawValue();

    // Text/number/bool fields
    fd.append('registrationNumber', v.registrationNumber);
    fd.append('make', v.make);
    fd.append('model', v.model);
    fd.append('bodyType', v.bodyType);
    fd.append('yearOfMfg', v.yearOfMfg.toString());
    fd.append('monthOfMfg', v.monthOfMfg.toString());
    fd.append('engineNumber', v.engineNumber);
    fd.append('chassisNumber', v.chassisNumber);
    fd.append('engineCC', v.engineCC.toString());
    if (v.grossVehicleWeight !== null) {
      fd.append('grossVehicleWeight', v.grossVehicleWeight.toString());
    }
    if (v.seatingCapacity !== null) {
      fd.append('seatingCapacity', v.seatingCapacity.toString());
    }
    fd.append('dateOfRegistration', v.dateOfRegistration);
    fd.append('rto', v.rto);
    fd.append('classOfVehicle', v.classOfVehicle);
    fd.append('categoryCode', v.categoryCode || '');
    fd.append('normsType', v.normsType || '');
    fd.append('makerVariant', v.makerVariant || '');
    fd.append('ownerName', v.ownerName);
    fd.append('presentAddress', v.presentAddress);
    fd.append('permanentAddress', v.permanentAddress);
    fd.append('hypothecation', v.hypothecation ? 'true' : 'false');
    fd.append('lender', v.lender || '');
    fd.append('insurer', v.insurer || '');
    fd.append('insurancePolicyNo', v.insurancePolicyNo || '');
    fd.append('insuranceValidUpTo', v.insuranceValidUpTo || '');
    fd.append('permitNo', v.permitNo || '');
    fd.append('permitValidUpTo', v.permitValidUpTo || '');
    fd.append('permitType', v.permitType || '');
    fd.append('permitIssued', v.permitIssued || '');
    fd.append('permitFrom', v.permitFrom || '');
    fd.append('fitnessNo', v.fitnessNo || '');
    fd.append('fitnessValidTo', v.fitnessValidTo || '');
    fd.append('pollutionCertificateNumber', v.pollutionCertificateNumber || '');
    fd.append('pollutionCertificateUpto', v.pollutionCertificateUpto || '');
    fd.append('taxUpto', v.taxUpto || '');
    fd.append('taxPaidUpTo', v.taxPaidUpTo || '');
    if (v.idv !== null) {
      fd.append('idv', v.idv.toString());
    }
    if (v.exShowroomPrice !== null) {
      fd.append('exShowroomPrice', v.exShowroomPrice.toString());
    }
    fd.append('backlistStatus', v.backlistStatus ? 'true' : 'false');
    fd.append('rcStatus', v.rcStatus ? 'true' : 'false');
    fd.append('manufacturedDate', v.manufacturedDate || '');
    fd.append('stencilTraceUrl', v.stencilTraceUrl || '');
    fd.append('chassisNoPhotoUrl', v.chassisNoPhotoUrl || '');

    // File fields
    if (this.rcFile) {
      fd.append('rcFile', this.rcFile, this.rcFile.name);
    }
    if (this.insuranceFile) {
      fd.append('insuranceFile', this.insuranceFile, this.insuranceFile.name);
    }
    this.otherFiles.forEach(file => {
      fd.append('otherFiles', file, file.name);
    });

    // Always include the route identifiers
    fd.append('valuationId', this.valuationId);
    fd.append('vehicleNumber', this.vehicleNumber);
    fd.append('applicantContact', this.applicantContact);

    return fd;
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.saveInProgress = true;

    const payload = this.buildFormData();
    this.valuationSvc
      .updateVehicleDetails(this.valuationId, this.vehicleNumber, this.applicantContact, payload)
      .pipe(
      // After successful update, start workflow
      switchMap(() => this.workflowSvc.startWorkflow(this.valuationId, 2, this.vehicleNumber, this.applicantContact))
      )
      .subscribe({
      next: () => {
        this.saveInProgress = false;
        this.saving = false;
        this._snackBar.open('Saved successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
        });
      },
      error: (err) => {
          this.error = err.message || 'Save failed.';
          this.saveInProgress = false;
          this.saving = false;
        }
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.submitInProgress = true;

    const payload = this.buildFormData();
    this.valuationSvc
      .updateVehicleDetails(this.valuationId, this.vehicleNumber, this.applicantContact, payload)
      .pipe(
        // Complete workflow with step 1
        switchMap(() => this.workflowSvc.completeWorkflow(this.valuationId, 2, this.vehicleNumber, this.applicantContact)),
        // Start workflow with step 2  
        switchMap(() => this.workflowSvc.startWorkflow(this.valuationId, 3, this.vehicleNumber, this.applicantContact))
      )
      .subscribe({
        next: () => {
          // After successful submit, navigate back to "view" screen
          this.router.navigate(['/valuation', this.valuationId, 'vehicle-details'], {
            queryParams: {
              vehicleNumber: this.vehicleNumber,
              applicantContact: this.applicantContact
            }
          });
        },
        error: (err) => {
          this.error = err.message || 'Submit failed.';
          this.submitInProgress = false;
          this.saving = false;
        }
      });
  }

  onCancel() {
    this.router.navigate(['/valuation', this.valuationId, 'vehicle-details'], {
      queryParams: {
        vehicleNumber: this.vehicleNumber,
        applicantContact: this.applicantContact
      }
    });
  }
}

