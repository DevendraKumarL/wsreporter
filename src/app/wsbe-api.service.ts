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
        reports.array.forEach(report => {
          this.reports.push(report);
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

}
