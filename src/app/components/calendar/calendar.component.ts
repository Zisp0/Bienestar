import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrackerService } from '../../services/tracker.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  today = new Date();
  dateStr = '';
  markedDates: Record<string, boolean> = {};

  constructor(private router: Router, private tracker: TrackerService) {}

  ngOnInit(): void {
    this.updateMarked();
  }

  get markedKeys(): string[] {
    return Object.keys(this.markedDates);
  }

  updateMarked() {
    this.markedDates = {};
    this.tracker.getAll().forEach(e => this.markedDates[e.date] = true);
  }

  openDate(d: string) {
    const iso = d;
    this.router.navigate(['/day', iso]);
  }

  onSelectInput(ev: any) {
    this.openDate(ev.target.value);
  }
}
