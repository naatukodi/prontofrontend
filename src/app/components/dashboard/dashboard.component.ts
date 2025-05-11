import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../services/claim.service';
import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  claims: Claim[] = [];
  loading = true;
  error: string | null = null;

  // you could also pull these from a user service or route params
  private adjusterUserId = 'user-123';
  private status = 'Open';

  constructor(private claimService: ClaimService) {}

  ngOnInit(): void {
    this.claimService
      .getAll(this.adjusterUserId, this.status)
      .subscribe({
        next: data => {
          this.claims = data;
          this.loading = false;
        },
        error: err => {
          this.error = 'Failed to load claims';
          this.loading = false;
        }
      });
  }
} 
