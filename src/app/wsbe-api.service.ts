import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class WsbeApiService {

	public apiURL = "http://localhost:5000/wsbe/";

	public reports: any = [];
	public draftReport: any;
	public draftPresent: boolean = false;

	constructor(public client: HttpClient) { }

	fetchReports() {
		this.reports = [];
		this.client.get(this.apiURL + "reports").subscribe((reports: any) => {
			console.log("Success response. reports: ", reports);
			for (let i = 0; i < reports.length; ++i) {
				this.reports.push({
					report_date: new Date(reports[i].report_date).toISOString().substr(0, 10),
					ws_start: new Date(reports[i].ws_start).toISOString().substr(0, 10),
					ws_end: new Date(reports[i].ws_end).toISOString().substr(0, 10),
					bugzillaURL: reports[i].bugzillaURL,
					highlights: reports[i].highlights,
					codeReviews: reports[i].codeReviews,
					planForWeek: reports[i].planForWeek
				});
			}
		}, (error: any) => {
			console.log("Error response. error: ", error);
		});
	}

	
	getDraftReport() {
		return this.client.get(this.apiURL + "draft");
	}

	newDraftReport(draftReportData: any) {
		return this.client.post(this.apiURL + "draft", draftReportData);
	}

	updateDraftReport(newDraftReportData: any) {
		return this.client.put(this.apiURL + "draft", newDraftReportData);
	}

	submitReport() {
		return this.client.post(this.apiURL + "report", this.draftReport);
	}

	deleteDraftReport() {
		return this.client.delete(this.apiURL + "draft/" + this.draftReport._id);
	}

}
