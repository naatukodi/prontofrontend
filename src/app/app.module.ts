import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { MatIconModule }      from '@angular/material/icon';
import { MatDatepickerModule }from '@angular/material/datepicker';
import { MatNativeDateModule }from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ValuationFormComponent } from './components/valution/valuation-form/valuation-form.component';
import { StakeholderUpdateComponent } from './components/stakeholder/stakeholder-update/stakeholder-update.component';
import { StakeholderViewComponent } from './components/stakeholder/stakeholder-view/stakeholder-view.component';
import { ValuationVehicleDetailsComponent } from './components/valution/valuation-vehicle-details/valuation-vehicle-details.component';
import { ValuationUpdateComponent } from './components/valution/valuation-update/valuation-update.component';
import { InspectionViewComponent } from './components/inspection/inspection-view/inspection-view.component';
import { InspectionUpdateComponent } from './components/inspection/inspection-update/inspection-update.component';
import { QualityControlViewComponent } from './components/qc/quality-control-view/quality-control-view.component';
import { QualityControlUpdateComponent } from './components/qc/quality-control-update/quality-control-update.component';
import { WorkflowButtonsComponent } from './components/nav/workflow-buttons/workflow-buttons.component';
import { VehicleImageUploadComponent } from './components/inspection/vehicle-image-upload/vehicle-image-upload.component';
import { StakeholderNewComponent } from './components/stakeholder/stakeholder-new/stakeholder-new.component';
import { FinalReportComponent } from './components/Report/final-report/final-report.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, ValuationFormComponent, StakeholderUpdateComponent, StakeholderViewComponent, ValuationVehicleDetailsComponent, ValuationUpdateComponent, InspectionViewComponent, InspectionUpdateComponent, QualityControlViewComponent, QualityControlUpdateComponent, WorkflowButtonsComponent, VehicleImageUploadComponent, StakeholderNewComponent, FinalReportComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatExpansionModule,
    AppRoutingModule,
    // Forms
    ReactiveFormsModule,

    // Angular Material
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
