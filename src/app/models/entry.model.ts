export interface Metric {
  category: string;
  intensity: number; // 0-10
}

export interface Entry {
  id: string;
  date: string; // ISO date yyyy-mm-dd
  pain: Metric;
  libido: Metric;
  sleep: Metric;
  mood: Metric;
  comment?: string;
}
