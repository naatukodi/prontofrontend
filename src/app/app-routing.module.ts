import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ValuationFormComponent } from './components/valuation-form/valuation-form.component';
import { StakeholderUpdateComponent } from './components/stakeholder-update/stakeholder-update.component';
import { StakeholderViewComponent } from './components/stakeholder-view/stakeholder-view.component';
import { ValuationVehicleDetailsComponent } from './components/valution/valuation-vehicle-details/valuation-vehicle-details.component';
import {ValuationUpdateComponent} from './components/valution/valuation-update/valuation-update.component';
import { InspectionViewComponent } from './components/inspection/inspection-view/inspection-view.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'valuation/new', component: ValuationFormComponent },
  { path: 'stakeholder', component: StakeholderUpdateComponent },
  { path: 'valuations/:valuationId/stakeholder', component: StakeholderViewComponent },
  { path: 'stakeholder-update/:valuationId', component: StakeholderUpdateComponent },
  { path: 'valuation/:valuationId/vehicle-details', component: ValuationVehicleDetailsComponent },
  { path: 'valuation/:valuationId/vehicle-details/update', component: ValuationUpdateComponent },
  { path: 'valuation/:valuationId/inspection', component: InspectionViewComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
