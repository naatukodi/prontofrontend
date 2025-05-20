// src/app/stakeholder-update/stakeholder-update.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { StakeholderService } from './stakeholder.service';
import { DocumentUpload } from './document-upload.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-stakeholder-update',
  templateUrl: './stakeholder-update.component.html',
  styleUrls: ['./stakeholder-update.component.scss'],
})
export class StakeholderUpdateComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  saveInProgress = false;
  submitInProgress = false;
  error: string | null = null;

  stakeholderOptions = [
    'Acme Claims Ltd.',
    'Beta Insurance Co.',
    'Others'
  ];

  private valuationId!: string;

  constructor(
    private fb: FormBuilder,
    private svc: StakeholderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const routeId = this.route.snapshot.paramMap.get('valuationId');
    this.valuationId = routeId && routeId !== 'null'
      ? routeId
      : uuidv4();

    this.form = this.fb.group({
      stakeholderName: ['Others', Validators.required],
      stakeholderExecutiveName: ['', Validators.required],
      stakeholderExecutiveContact: ['', [Validators.required, Validators.pattern(/^\+?\d+$/)]],
      stakeholderExecutiveWhatsapp: ['', Validators.pattern(/^\+?\d+$/)],
      stakeholderExecutiveEmail: ['', [Validators.required, Validators.email]],
      applicantName: ['', Validators.required],
      applicantContact: ['', [Validators.required, Validators.pattern(/^\+?\d+$/)]],
      vehicleNumber: ['', Validators.required],
      vehicleSegment: ['', Validators.required],
      rcFile: [null],
      insuranceFile: [null],
      otherFiles: [[]]
    });
  }

  onFileChange(event: Event, controlName: 'rcFile' | 'insuranceFile') {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.form.patchValue({ [controlName]: input.files[0] });
    }
  }

  onMultiFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.form.patchValue({ otherFiles: Array.from(input.files) });
    }
  }

  private buildPayload(): FormData {
    const {
      stakeholderName,
      stakeholderExecutiveName,
      stakeholderExecutiveContact,
      stakeholderExecutiveWhatsapp,
      stakeholderExecutiveEmail,
      applicantName,
      applicantContact,
      vehicleNumber,
      vehicleSegment,
      rcFile,
      insuranceFile,
      otherFiles
    } = this.form.value;

    const payload = new FormData();
    payload.append('valuationId', this.valuationId);
    payload.append('Name', stakeholderName);
    payload.append('ExecutiveName', stakeholderExecutiveName);
    payload.append('ExecutiveContact', stakeholderExecutiveContact);
    if (stakeholderExecutiveWhatsapp) {
      payload.append('ExecutiveWhatsapp', stakeholderExecutiveWhatsapp);
    }
    payload.append('ExecutiveEmail', stakeholderExecutiveEmail);
    payload.append('ApplicantName', applicantName);
    payload.append('ApplicantContact', applicantContact);
    payload.append('VehicleNumber', vehicleNumber);
    payload.append('VehicleSegment', vehicleSegment);
    if (rcFile) {
      payload.append('RcFile', rcFile, rcFile.name);
    }
    if (insuranceFile) {
      payload.append('InsuranceFile', insuranceFile, insuranceFile.name);
    }
    if (otherFiles?.length) {
      otherFiles.forEach((f: File) =>
        payload.append('OtherFiles', f, f.name)
      );
    }
    return payload;
  }

  async onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.saveInProgress = true;
    this.error = null;

    const { vehicleNumber, applicantContact } = this.form.value;
    const payload = this.buildPayload();

    try {

      // 1) Upsert stakeholder
      await this.svc
        .upsertStakeholder(this.valuationId, payload)
        .toPromise();

      // 2) Start workflow
      await this.svc
        .startWorkflow(
          this.valuationId,
          vehicleNumber,
          applicantContact
        )
        .toPromise();

      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err?.error?.title || err?.message || 'Save failed';
    } finally {
      this.saving = false;
      this.saveInProgress = false;
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.submitInProgress = true;
    this.error = null;

    const { vehicleNumber, applicantContact } = this.form.value;
    const payload = this.buildPayload();

    try {

       // 1) Upsert stakeholder
      await this.svc
        .upsertStakeholder(this.valuationId, payload)
        .toPromise();

      // 2) Complete workflow
      await this.svc
        .completeWorkflow(
          this.valuationId,
          vehicleNumber,
          applicantContact
        )
        .toPromise();

      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err?.error?.title || err?.message || 'Submit failed';
    } finally {
      this.saving = false;
      this.submitInProgress = false;
    }
  }
}
