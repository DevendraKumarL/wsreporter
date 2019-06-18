import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WsbeApiService } from '../wsbe-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
	public outlookForm: FormGroup;
	public senderPassword: String;
	public mailSettings: any = {};

	public errorOccured: boolean = false;
	public smtpActive: boolean = true;

	public sending: boolean = false;
	public sent: boolean = false;

	@ViewChild("mailModal")
	public mailModal: ElementRef;

	@ViewChild("smtpTab")
	public smtpTab: ElementRef;

	@ViewChild("outlookTab")
	public outlookTab: ElementRef;

	constructor(public activeRoute: ActivatedRoute, public wsService: WsbeApiService,
		public formB: FormBuilder, public router: Router) {
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
				to_name: ["", Validators.compose([Validators.required])]
			});
			this.outlookForm = this.formB.group({
				from_name: ["", Validators.compose([Validators.required])],
				to_: ["", Validators.compose([Validators.required, Validators.email])],
				to_name: ["", Validators.compose([Validators.required])]
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
		this.wsService.fetchMailSettings().subscribe((mailSettings: any) => {
			console.log("Success response. mailSettings: ", mailSettings);
			this.wsService.mailSettings = mailSettings[0]? mailSettings[0] : [];
			delete this.wsService.mailSettings._id;
			delete this.wsService.mailSettings.__v;
			this.updateMailData();
		}, (error: any) => {
			console.log("Error response. error: ", error.error.error);
		});
	}

	updateMailData() {
		this.mailSettings = this.wsService.mailSettings ? {
			from_: this.wsService.mailSettings.from_,
			from_name: this.wsService.mailSettings.from_name,
			to_: this.wsService.mailSettings.to_,
			to_name: this.wsService.mailSettings.to_name,
		} : [];
	}

	saveMailSettings() {
		this.wsService.updateMailSettings(this.mailSettings);
	}

	closeMailForm() {
		this.errorOccured = false;
		this.senderPassword = "";
		this.sending = false;
		this.smtpActive = true;
		this.mailForm.markAsPristine();
		this.mailForm.markAsUntouched();
		this.mailForm.updateValueAndValidity();
		this.outlookForm.markAsPristine();
		this.outlookForm.markAsUntouched();
		this.outlookForm.updateValueAndValidity();
		this.updateMailData();
		$(this.smtpTab.nativeElement).trigger('click');
	}

	switchSettings(flag) {
		this.smtpActive = flag;
		this.errorOccured = false;
	}

	sendSMTPMail() {
		this.sending = true;
		this.saveMailSettings();
		let mailData = {
			from_: this.mailSettings.from_,
			from_name: this.mailSettings.from_name,
			to_: this.mailSettings.to_,
			to_name: this.mailSettings.to_name,
			pass_: this.senderPassword,
			report: this.report,
			reportHTML: document.getElementsByClassName("card-body")[0].innerHTML
		};
		console.log(mailData);
		this.wsService.sendWSReportMail(mailData).subscribe((response: any) => {
			console.log("Success response. response: ", response);
			this.closeMailForm();
			this.sent = true;
			$(this.mailModal.nativeElement).modal("hide");
		}, (error: any) => {
			console.log("Error response, error: ", error);
			this.errorOccured = true;
			this.sending = false;
		});
	}

	sendOutlookMail() {
		this.sending = true;
		this.saveMailSettings();
		let mailData = {
			from_name: this.mailSettings.from_name,
			to_: this.mailSettings.to_,
			to_name: this.mailSettings.to_name,
			report: this.report,
			reportHTML: document.getElementsByClassName("card-body")[0].innerHTML
		};
		console.log(mailData);
		this.wsService.sendWSReportOutlookMail(mailData).subscribe((response: any) => {
			console.log("Success response. response: ", response);
			this.closeMailForm();
			this.sent = true;
			$(this.mailModal.nativeElement).modal("hide");
		}, (error: any) => {
			console.log("Error response, error: ", error);
			this.errorOccured = true;
			this.sending = false;
		})
	}

	deleteReport() {
		this.wsService.deleteReport(this.reportID).subscribe((response: any) => {
			console.log("Success response. response: ", response);
			this.router.navigate(["/"]);
		}, (error: any) => {
			console.log("Error response, error: ", error);
			this.errorOccured = true;
		})
	}
}
