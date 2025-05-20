import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ValuationFormComponent } from './components/valuation-form/valuation-form.component';
import { StakeholderUpdateComponent } from './components/stakeholder-update/stakeholder-update.component';
import { StakeholderViewComponent } from './components/stakeholder-view/stakeholder-view.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'valuation/new', component: ValuationFormComponent },
  { path: 'stakeholder', component: StakeholderUpdateComponent },
  {path: 'valuations/:valuationId/stakeholder', component: StakeholderViewComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
