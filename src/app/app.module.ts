import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DayDetailComponent } from './components/day-detail/day-detail.component';
import { StatsComponent } from './components/stats/stats.component';

const routes = [
  { path: '', component: DashboardComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'day/:date', component: DayDetailComponent },
  { path: 'stats', component: StatsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CalendarComponent,
    DayDetailComponent,
    StatsComponent
  ],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
