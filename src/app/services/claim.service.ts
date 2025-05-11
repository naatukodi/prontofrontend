import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private apiUrl = `${environment.apiBaseUrl}/Valuations`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch all claims, optionally filtered by adjusterUserId and status
   */
  getAll(
    adjusterUserId?: string,
    status?: string
  ): Observable<Claim[]> {
    let params = new HttpParams();
    if (adjusterUserId) {
      params = params.set('adjusterUserId', adjusterUserId);
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Claim[]>(this.apiUrl, { params });
  }
}
