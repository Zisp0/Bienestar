import { Component, OnInit } from '@angular/core';
import { TrackerService } from '../../services/tracker.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  entries: any[] = [];
  summary: any = {};

  constructor(private tracker: TrackerService) {}

  ngOnInit(): void {
    this.entries = this.tracker.getAll();
    this.calculate();
  }

  calculate() {
    const s: any = {
      count: this.entries.length,
      painAvg: 0,
      moodAvg: 0,
      sleepAvg: 0
    };
    if (this.entries.length === 0) { this.summary = s; return; }
    let p = 0, m = 0, sl = 0;
    this.entries.forEach(e => { p += e.pain.intensity; m += e.mood.intensity; sl += e.sleep.intensity; });
    s.painAvg = +(p / this.entries.length).toFixed(1);
    s.moodAvg = +(m / this.entries.length).toFixed(1);
    s.sleepAvg = +(sl / this.entries.length).toFixed(1);
    this.summary = s;
  }
}
