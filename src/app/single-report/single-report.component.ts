import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WsbeApiService } from '../wsbe-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var $: any;

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

	public mailForm: FormGroup;
	public senderPassword: String;
	public mailSettings: any = {};

	public errorOccured: boolean = false;
	public sending: boolean = false;

	@ViewChild("mailModal")
	public mailModal: ElementRef;

	constructor(public activeRoute: ActivatedRoute, public wsService: WsbeApiService,
		public formB: FormBuilder) {
		this.activeRoute.params.subscribe(params => {
			this.reportID = params.id;
			console.log("reportID: ", this.reportID);
			this.wsService.fetchReports();
			this.getReport();
			this.mailForm = this.formB.group({
				from_: ["", Validators.compose([Validators.required, Validators.email])],
				from_name: ["", Validators.compose([Validators.required])],
				pass_: ["", Validators.compose([Validators.required])],
				to_: ["", Validators.compose([Validators.required, Validators.email])],
				to_name: ["", Validators.compose([Validators.required])],
				project_name: ["", Validators.compose([Validators.required])]
			});
			this.getMailSettings();
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

	getMailSettings() {
		this.wsService.fetchMailSettings().subscribe((mailSettings) => {
			console.log("Success response. mailSettings: ", mailSettings);
			this.wsService.mailSettings = mailSettings[0];
			this.mailSettings = {
				from_: this.wsService.mailSettings.from_,
				from_name: this.wsService.mailSettings.from_name,
				project_name: this.wsService.mailSettings.project_name,
				to_: this.wsService.mailSettings.to_,
				to_name: this.wsService.mailSettings.to_name,
			};
			delete this.wsService.mailSettings._id;
			delete this.wsService.mailSettings.__v;
		}, (error) => {
			console.log("Error response. error: ", error.error.error);
		});
	}

	saveMailSettings() {
		this.wsService.updateMailSettings(this.mailSettings);
	}

	sendMail() {
		this.sending = true;
		this.saveMailSettings();
		let mailData = {
			from_: this.mailSettings.from_,
			from_name: this.mailSettings.from_name,
			to_: this.mailSettings.to_,
			to_name: this.mailSettings.to_name,
			pass_: this.senderPassword,
			report: this.report
		};
		this.wsService.sendWSReportMail(mailData).subscribe((response) => {
			console.log("Success response. response: ", response);
			this.errorOccured = false;
			this.sending = false;
			$(this.mailModal.nativeElement).modal("hide");
		}, (error) => {
			console.log("Error response, error: ", error);
			this.errorOccured = true;
			this.sending = false;			
		});
	}
}
