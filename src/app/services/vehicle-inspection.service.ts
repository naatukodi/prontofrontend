// src/app/services/vehicle-inspection.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WorkflowService } from './workflow.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleInspectionService {
private readonly baseUrl = environment.apiBaseUrl + 'valuations';

  constructor(private http: HttpClient, private workflowService: WorkflowService) {}

  // Add methods for vehicle image upload
  uploadPhotos(
    valuationId: string,
    vehicleNumber: string,
    applicantContact: string,
    formData: FormData,
    options: any = {}
  ): Observable<HttpEvent<any>> {
    formData.append('valuationId', valuationId);
    formData.append('vehicleNumber', vehicleNumber);
    formData.append('applicantContact', applicantContact);

    const params = new HttpParams()
      .set('vehicleNumber', vehicleNumber)
      .set('applicantContact', applicantContact);

    return this.http.put<HttpEvent<any>>(
      `${this.baseUrl}/${valuationId}/photos`,
      formData,
      { ...options, params, reportProgress: true, observe: 'events' }
    ).pipe(catchError(this.handleError));
  }

  getVehicleImages(
    valuationId: string,
    vehicleNumber: string,
    applicantContact: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('vehicleNumber', vehicleNumber)
      .set('applicantContact', applicantContact);

    return this.http.get<any>(
      `${this.baseUrl}/${valuationId}/photos`,
      { params }
    ).pipe(catchError(this.handleError));
  }

  deleteVehicleImage(
    valuationId: string,
    imageName: string
  ): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/${valuationId}/photos/${imageName}`
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}