import { Component, OnInit } from '@angular/core';
import { TrackerService } from '../../services/tracker.service';
import { Entry } from '../../models/entry.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  entries: Entry[] = [];

  constructor(private tracker: TrackerService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.entries = this.tracker.getAll();
  }
}
