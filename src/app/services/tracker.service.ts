import { Injectable } from '@angular/core';
import { Entry } from '../models/entry.model';

@Injectable({ providedIn: 'root' })
export class TrackerService {
  private storageKey = 'bienestar-entries';

  private load(): Entry[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private saveAll(list: Entry[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  getAll(): Entry[] {
    return this.load().sort((a, b) => a.date < b.date ? 1 : -1);
  }

  getForDate(dateISO: string): Entry | undefined {
    return this.load().find(e => e.date === dateISO);
  }

  upsert(entry: Entry) {
    const list = this.load();
    const idx = list.findIndex(e => e.date === entry.date);
    if (idx >= 0) {
      list[idx] = entry;
    } else {
      list.push(entry);
    }
    this.saveAll(list);
  }

  remove(dateISO: string) {
    const list = this.load().filter(e => e.date !== dateISO);
    this.saveAll(list);
  }

  getCategories() {
    return {
      pain: ['Ninguno','Leve','Moderado','Fuerte','Severo'],
      libido: ['Bajo','Normal','Alto'],
      sleep: ['Malo','Regular','Bueno','Excelente'],
      mood: ['Triste','Neutral','Contento','Eufórico']
    };
  }
}
