// src/app/services/quality-control.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QualityControl } from '../models/QualityControl';
import { ValuationEstimate } from '../models/ValuationEstimate';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QualityControlService {
  private readonly baseUrl = environment.apiBaseUrl + 'valuations';

  constructor(private http: HttpClient) {}

  getQualityControlDetails(
    valuationId: string,
    vehicleNumber: string,
    applicantContact: string
  ): Observable<QualityControl> {
    const url = `${this.baseUrl}/${valuationId}/qualitycontrol`;
    const params = new HttpParams()
      .set('vehicleNumber', vehicleNumber)
      .set('applicantContact', applicantContact);
    return this.http
      .get<QualityControl>(url, { params })
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  getValuationEstimate(
    valuationId: string,
    vehicleNumber: string,
    applicantContact: string
  ): Observable<ValuationEstimate> {
    const url = `${this.baseUrl}/${valuationId}/valuationresponse`;
    const params = new HttpParams()
      .set('vehicleNumber', vehicleNumber)
      .set('applicantContact', applicantContact);
    return this.http
      .get<ValuationEstimate>(url, { params })
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  deleteQualityControlDetails(
    valuationId: string,
    vehicleNumber: string,
    applicantContact: string
  ): Observable<any> {
    const url = `${this.baseUrl}/${valuationId}/qualitycontrol`;
    const params = new HttpParams()
      .set('vehicleNumber', vehicleNumber)
      .set('applicantContact', applicantContact);
    return this.http
      .delete(url, { params })
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  updateQualityControlDetails(
    valuationId: string,
    vehicleNumber: string,
    applicantContact: string,
    body: any
  ): Observable<any> {
    const url = `${this.baseUrl}/${valuationId}/qualitycontrol`;
    const params = new HttpParams()
      .set('vehicleNumber', vehicleNumber)
      .set('applicantContact', applicantContact);
    return this.http
      .put(url, body, { params })
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }
}
