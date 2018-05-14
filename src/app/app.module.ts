import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { routes } from './routes';

import { AppComponent } from './app.component';
import { NewReportComponent } from './new-report/new-report.component';

import { WsbeApiService } from './wsbe-api.service';
import { ReportsComponent } from './reports/reports.component';
import { ReportComponent } from './report/report.component';
import { HttpClientModule } from '@angular/common/http';
import { DraftComponent } from './draft/draft.component';


@NgModule({
  declarations: [
    AppComponent,
    NewReportComponent,
    ReportsComponent,
    ReportComponent,
    DraftComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [WsbeApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
