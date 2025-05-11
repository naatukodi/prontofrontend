import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { ClaimService } from '../../services/claim.service';
import { Valuation } from '../../models/claim.model';

@Component({
  selector: 'app-valuation-form',
  templateUrl: './valuation-form.component.html',
  styleUrls: ['./valuation-form.component.scss']
})
export class ValuationFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private svc: ClaimService,
    private router: Router  
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [''],
      adjusterUserId: ['', Validators.required],
      status: ['Open', Validators.required],
      accidentDate: [new Date().toISOString(), Validators.required],
      accidentLocation: ['', Validators.required],
      policyNumber: ['', Validators.required],

      stakeholder: this.fb.group({
        name: [''],
        executiveName: [''],
        executiveContact: [''],
        executiveWhatsapp: [''],
        applicant: this.fb.group({         // nested stakeholder.applicant
          name: [''],
          contact: [''],
          vehicleDetails: this.fb.group({
            registrationNumber: [''], segment: [''], make: [''],
            model: [''], yearMfg: [0], presentAddress: [''],
            permanentAddress: [''], hypothecation: [false],
            insurer: [''], dateOfRegistration: [new Date()],
            vehicleClass: [''], engineCC: [0], gvw: [0],
            seatingCapacity: [0], policyValidUpTo: [new Date()],
            idv: [0], permitNo: [''], permitValidUpTo: [new Date()],
            documents: this.fb.array([])
          })
        })
      }),

      applicant: this.fb.group({           // top-level applicant
        name: [''], contact: [''],
        vehicleDetails: this.fb.group({
          /* same as above */
          registrationNumber: [''], /* … */ documents: this.fb.array([])
        })
      }),

      vehicleDetails: this.fb.group({
        registrationNumber: [''], /* … */ documents: this.fb.array([])
      }),

      documents: this.fb.array([]),
      components: this.fb.array([]),

      summary: this.fb.group({
        overallRating: [0],
        valuationAmount: [0],
        chassisPunch: [''],
        remarks: [''],
        workflow: this.fb.array([])
      }),

      workflow: this.fb.array([]),

      createdAt: [new Date().toISOString()],
      updatedAt: [new Date().toISOString()]
    });

    // start with one empty entry in each array
    this.addDocument();
    this.addComponent();
    this.addWorkflow();
    (this.form.get('summary')!.get('workflow') as FormArray).push(this.createWorkflow());
  }

  ///////////////////////////////////////
  // helpers for FormArrays
  ///////////////////////////////////////
  get documents() {
    return this.form.get('documents') as FormArray;
  }
  createDocument(): FormGroup {
    return this.fb.group({
      type: [''], filePath: [''], uploadedAt: [new Date().toISOString()],
      components: this.fb.array([])
    });
  }
  addDocument() {
    this.documents.push(this.createDocument());
  }
  removeDocument(i: number) {
    this.documents.removeAt(i);
  }

  get components() {
    return this.form.get('components') as FormArray;
  }
  createComponent(): FormGroup {
    return this.fb.group({
      componentTypeId: [0],
      condition: [''],
      remarks: [''],
      summary: this.fb.group({           // nested summary under component
        overallRating: [0],
        valuationAmount: [0],
        chassisPunch: [''],
        remarks: [''],
        workflow: this.fb.array([])
      })
    });
  }
  addComponent() {
    this.components.push(this.createComponent());
  }
  removeComponent(i: number) {
    this.components.removeAt(i);
  }

  get workflow() {
    return this.form.get('workflow') as FormArray;
  }
  createWorkflow(): FormGroup {
    return this.fb.group({
      templateStepId: [0],
      stepOrder: [0],
      assignedToRole: [''],
      status: [''],
      startedAt: [new Date().toISOString()],
      completedAt: [new Date().toISOString()]
    });
  }
  addWorkflow() {
    this.workflow.push(this.createWorkflow());
  }
  removeWorkflow(i: number) {
    this.workflow.removeAt(i);
  }

  ///////////////////////////////////////
  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload: Valuation = this.form.value;
    this.svc.create(payload).subscribe({
      next: res => {
        this.loading = false;
        // Redirect to Dashboard (home)
        this.router.navigate(['/']);
      },
      error: err => {
        this.loading = false;
        this.error = err.message || 'Save failed';
      }
    }); 
  }
}
