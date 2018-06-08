import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WsbeApiService } from '../wsbe-api.service';

@Component({
	selector: 'single-report',
	templateUrl: './single-report.component.html',
	styleUrls: ['./single-report.component.css']
})
export class SingleReportComponent {

	public reportID: string;
	public report: any;

	public errPresent: boolean = false;
	public errMsg: string;

	constructor(public activeRoute: ActivatedRoute, public wsService: WsbeApiService) {
		this.activeRoute.params.subscribe(params => {
			this.reportID = params.id;
			console.log("reportID: ", this.reportID);
			this.getReport();
		});
	}

	getReport() {
		this.wsService.getReport(this.reportID).subscribe((report: any) => {
			console.log("Success response. report: ", report);
			if (report === null) {
				this.report = undefined;
				this.errPresent = true;
				this.errMsg = "Sorry, could not fetch the report details";
			} else {
				this.report = report;
				this.report.report_date = new Date(this.report.report_date).toISOString().substr(0, 10);
				this.report.ws_start = new Date(this.report.ws_start).toISOString().substr(0, 10);
				this.report.ws_end = new Date(this.report.ws_end).toISOString().substr(0, 10);
			}
		}, (error: any) => {
			console.log("Error response. error: ", error);
			this.report = undefined;
			// TODO: Handle when api server is down
			this.errPresent = true;
			this.errMsg = error.error.error;
		});
	}

}
