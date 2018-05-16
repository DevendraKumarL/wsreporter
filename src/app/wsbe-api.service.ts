import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class WsbeApiService {

  public apiURL = "http://localhost:5000/wsbe/";

  public reports : any = [];

  public draftReport : any = {};

  constructor(public client : HttpClient) {}

  fetchReports() {
    let observableObject = this.client.get(this.apiURL + "reports");
    observableObject.subscribe((reports : any) => {
      if (reports.length > 0) {
        this.reports = [];
        reports.forEach(report => {
          let tmpDraft = {
            report_date: new Date(report.report_date).toISOString().substr(0, 10),
            ws_start: new Date(report.ws_start).toISOString().substr(0, 10),
            ws_end: new Date(report.ws_end).toISOString().substr(0, 10),
            bugzillaURL: report.bugzillaURL,
            highlights: report.highlights,
            codeReviews: report.codeReviews,
            planForWeek: report.planForWeek
          };
          this.reports.push(tmpDraft);
        });
        console.log("Reports: ", this.reports);
      }
    });
  }

  newDraftReport(draftReportData : any) {
    return this.client.post(this.apiURL + "draft", draftReportData);
  }

  getDraftReport() {
    return this.client.get(this.apiURL + "draft");
  }

  updateDraftReport(newDraftReportData : any) {
    return this.client.put(this.apiURL + "draft", newDraftReportData);
  }

  submitReport() {
    console.log("Draft report saved in wsbe: ", this.draftReport);
    return this.client.post(this.apiURL + "report", this.draftReport);
  }

}
