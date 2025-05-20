import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Stakeholder } from '../models/stakeholder.model';

@Injectable({ providedIn: 'root' })
export class StakeholderService {
private base = `${environment.apiBaseUrl}/Valuations`;

  constructor(private http: HttpClient) {}

  getStakeholder(
    valuationId: string,
    vehicleNumber: string,
    applicantContact: string
  ): Observable<Stakeholder> {
    const url = `${this.base}/${valuationId}/stakeholder` +
      `?vehicleNumber=${vehicleNumber}` +
      `&applicantContact=${applicantContact}`;
    return this.http.get<Stakeholder>(url);
  }

  deleteStakeholder(
    valuationId: string,
    vehicleNumber: string,
    applicantContact: string
  ): Observable<void> {
    const url = `${this.base}/${valuationId}/stakeholder` +
      `?vehicleNumber=${vehicleNumber}` +
      `&applicantContact=${applicantContact}`;
    return this.http.delete<void>(url);
  }
}
