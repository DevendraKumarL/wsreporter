import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class WsbeApiService {

	public apiURL = "http://localhost:5002/wsbe/";
	public mailURL = "http://localhost:5000/wsmailer/";

	public reports: any = [];
	public draftReport: any;
	public draftPresent: boolean = false;
	public mailSettings: any;

	constructor(public client: HttpClient) { }

	fetchReports() {
		this.reports = [];
		this.client.get(this.apiURL + "reports").subscribe((reports: any) => {
			// latest report first - stack
			for (let i = reports.length - 1; i >= 0; i--) {
				this.reports.push({
					report_date: new Date(reports[i].report_date).toISOString().substr(0, 10),
					ws_start: new Date(reports[i].ws_start).toISOString().substr(0, 10),
					ws_end: new Date(reports[i].ws_end).toISOString().substr(0, 10),
					bugzillaURL: reports[i].bugzillaURL,
					highlights: reports[i].highlights,
					codeReviews: reports[i].codeReviews,
					planForWeek: reports[i].planForWeek,
					_id: reports[i]._id
				});
			}
			console.log("Success response. reports: ", this.reports);
		}, (error: any) => {
			console.log("Error response. error: ", error);
		});
	}

	submitReport() {
		let report = JSON.parse(JSON.stringify(this.draftReport)); // deep clone
		report.highlights = report.highlights.replace(new RegExp('\n', 'g'), "<br>");
		report.codeReviews = report.codeReviews.replace(new RegExp('\n', 'g'), "<br>");
		report.planForWeek = report.planForWeek.replace(new RegExp('\n', 'g'), "<br>");
		report.bugzillaURL = report.bugzillaURL.replace(new RegExp('\n', 'g'), "<br>");
		console.log("***report*** : ", report);
		return this.client.post(this.apiURL + "report", report);
	}

	deleteDraftReport() {
		return this.client.delete(this.apiURL + "draft/" + this.draftReport._id);
	}

	getReport(reportID) {
		return this.client.get(this.apiURL + "report/" + reportID);
	}

	deleteReport(reportID) {
		return this.client.delete(this.apiURL + "report/" + reportID);
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


	fetchMailSettings() {
		return this.client.get(this.apiURL + "mailsettings");
	}

	updateMailSettings(newMailSettings) {
		let mailSettingsChanged = JSON.stringify(this.mailSettings) !== JSON.stringify(newMailSettings);
		console.log("mailSettingsChanged: ", mailSettingsChanged);
		if (mailSettingsChanged) {
			this.client.put(this.apiURL + "mailsettings", newMailSettings).subscribe((response) => {
				console.log("Success response. response: ", response);
			}, (error) => {
				console.log("Error response. error: ", error.error.error);
			});
		}
	}

	sendWSReportMail(mailData) {
		return this.client.post(this.mailURL + "sendmail-smtp", mailData);
	}

	sendWSReportOutlookMail(mailData) {
		return this.client.post(this.mailURL + "sendmail-outlook", mailData);
	}
}
