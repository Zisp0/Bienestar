import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Entry } from '../../models/entry.model';
import { TrackerService } from '../../services/tracker.service';

@Component({
  selector: 'app-day-detail',
  templateUrl: './day-detail.component.html',
  styleUrls: ['./day-detail.component.css']
})
export class DayDetailComponent implements OnInit {
  date = '';
  entry: Entry | undefined;
  categories: any = {};

  constructor(private route: ActivatedRoute, private tracker: TrackerService, private router: Router) {}

  ngOnInit(): void {
    this.categories = this.tracker.getCategories();
    this.route.paramMap.subscribe(params => {
      const d = params.get('date');
      if (d) {
        this.date = d;
        this.entry = this.tracker.getForDate(d);
      }
    });
  }

  private genId() {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  ensureEntry(): Entry {
    if (this.entry) return this.entry;
    const e: Entry = {
      id: this.genId(),
      date: this.date,
      pain: { category: this.categories.pain[0], intensity: 0 },
      libido: { category: this.categories.libido[0], intensity: 5 },
      sleep: { category: this.categories.sleep[1], intensity: 5 },
      mood: { category: this.categories.mood[1], intensity: 5 },
      comment: ''
    };
    this.entry = e;
    return e;
  }

  save() {
    const e = this.ensureEntry();
    this.tracker.upsert(e);
    this.router.navigate(['/']);
  }

  remove() {
    if (confirm('Eliminar el registro de ' + this.date + '?')) {
      this.tracker.remove(this.date);
      this.router.navigate(['/']);
    }
  }
}
