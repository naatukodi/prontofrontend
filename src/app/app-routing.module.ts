import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ValuationFormComponent } from './components/valution/valuation-form/valuation-form.component';
import { StakeholderNewComponent } from './components/stakeholder/stakeholder-new/stakeholder-new.component';
import { StakeholderUpdateComponent } from './components/stakeholder/stakeholder-update/stakeholder-update.component';
import { StakeholderViewComponent } from './components/stakeholder/stakeholder-view/stakeholder-view.component';
import { ValuationVehicleDetailsComponent } from './components/valution/valuation-vehicle-details/valuation-vehicle-details.component';
import {ValuationUpdateComponent} from './components/valution/valuation-update/valuation-update.component';
import { InspectionViewComponent } from './components/inspection/inspection-view/inspection-view.component';
import { InspectionUpdateComponent } from './components/inspection/inspection-update/inspection-update.component';
import { QualityControlViewComponent } from './components/qc/quality-control-view/quality-control-view.component';
import { QualityControlUpdateComponent } from './components/qc/quality-control-update/quality-control-update.component';
import { VehicleImageUploadComponent } from './components/inspection/vehicle-image-upload/vehicle-image-upload.component';
import { FinalReportComponent } from './components/Report/final-report/final-report.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'valuation/new', component: ValuationFormComponent },
  { path: 'stakeholder', component: StakeholderNewComponent },
  { path: 'valuations/:valuationId/stakeholder', component: StakeholderViewComponent },
  { path: 'valuations/:valuationId/stakeholder/update', component: StakeholderUpdateComponent },
  { path: 'valuation/:valuationId/vehicle-details', component: ValuationVehicleDetailsComponent },
  { path: 'valuation/:valuationId/vehicle-details/update', component: ValuationUpdateComponent },
  { path: 'valuation/:valuationId/inspection', component: InspectionViewComponent },
  { path: 'valuation/:valuationId/inspection/update', component: InspectionUpdateComponent },
  { path: 'valuation/:valuationId/quality-control', component: QualityControlViewComponent },
  { path: 'valuation/:valuationId/quality-control/update', component: QualityControlUpdateComponent },
  { path: 'valuation/:valuationId/inspection/vehicle-image-upload', component: VehicleImageUploadComponent },
  { path: 'valuation/:valuationId/final-report', component: FinalReportComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
