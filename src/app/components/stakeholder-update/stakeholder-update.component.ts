// src/app/stakeholder-update/stakeholder-update.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { StakeholderService } from './stakeholder.service';
import { DocumentUpload } from './document-upload.model';

@Component({
  selector: 'app-stakeholder-update',
  templateUrl: './stakeholder-update.component.html',
  styleUrls: ['./stakeholder-update.component.scss'],
})
export class StakeholderUpdateComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  error: string | null = null;
  documents: DocumentUpload[] = [];

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
    // pull the valuationId from the route or generate a new one
    const routeId = this.route.snapshot.paramMap.get('valuationId');
    this.valuationId = routeId && routeId !== 'null' ? routeId : uuidv4();

    this.form = this.fb.group({
      // Stakeholder fields
      stakeholderName: [
        'Others',
        Validators.required
      ],
      stakeholderExecutiveName: [
        '',
        Validators.required
      ],
      stakeholderExecutiveContact: [
        '',
        [Validators.required, Validators.pattern(/^\+?\d+$/)]
      ],
      stakeholderExecutiveWhatsapp: [
        '',
        Validators.pattern(/^\+?\d+$/)
      ],
      stakeholderExecutiveEmail: [
        '',
        [Validators.required, Validators.email]
      ],

      // Applicant fields
      applicantName: [
        '',
        Validators.required
      ],
      applicantContact: [
        '',
        [Validators.required, Validators.pattern(/^\+?\d+$/)]
      ],

      // Vehicle fields
      vehicleNumber: [
        '',
        Validators.required
      ],
      vehicleSegment: [
        '',
        Validators.required
      ],

      // File inputs
      rcFile: [null],
      insuranceFile: [null],
      otherFiles: [[]]     // an array of Files
    });
  }

  onFileChange(event: Event, controlName: 'rcFile' | 'insuranceFile') {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.form.patchValue({
      [controlName]: input.files[0]
    });
  }

  onMultiFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    // convert FileList to File[]
    const files: File[] = Array.from(input.files);
    this.form.patchValue({ otherFiles: files });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = null;

    // pull everything out
    const {
      valuationId,
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

    // build FormData to match your backend DTO
    const payload = new FormData();
    payload.append('valuationId', valuationId);
    payload.append('Name', stakeholderName);
    payload.append('ExecutiveName', stakeholderExecutiveName);
    payload.append('ExecutiveContact', stakeholderExecutiveContact);
    if (stakeholderExecutiveWhatsapp)
      payload.append('ExecutiveWhatsapp', stakeholderExecutiveWhatsapp);
    payload.append('ExecutiveEmail', stakeholderExecutiveEmail);

    payload.append('ApplicantName', applicantName);
    payload.append('ApplicantContact', applicantContact);

    payload.append('VehicleNumber', vehicleNumber);
    payload.append('VehicleSegment', vehicleSegment);

    if (rcFile)
      payload.append('RcFile', rcFile, rcFile.name);
    if (insuranceFile)
      payload.append('InsuranceFile', insuranceFile, insuranceFile.name);

    // append each other file under the same key
    if (otherFiles && otherFiles.length) {
      otherFiles.forEach((f: File) =>
        payload.append('OtherFiles', f, f.name)
      );
    }

    try {
      // calls PUT /api/valuations/{valuationId}/stakeholder
      await this.svc
        .upsertStakeholder(this.valuationId, payload)
        .toPromise();

      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err?.error?.title || err?.message || 'Update failed';
    } finally {
      this.saving = false;
    }
  }
}
