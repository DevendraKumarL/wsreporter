import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WsbeApiService } from '../wsbe-api.service';

declare var $: any;

@Component({
	selector: 'draft',
	templateUrl: './draft.component.html',
	styleUrls: ['./draft.component.css']
})
export class DraftComponent {

	public draftReportFormGroup: FormGroup;

	public enableEditDraft: boolean = false;

	public dftUpdateSubmitErr: boolean = false;
	public dftUpdateSubmitErrMsg: string;
	public errorDraft: boolean = false;
	public errorDraftMsg: string;

	@ViewChild("deleteConfirmModal")
	public delConfirmModal: ElementRef;

	constructor(public formBuilder: FormBuilder,
		public wsbe: WsbeApiService, public router: Router) {

		this.wsbe.fetchReports();

		this.draftReportFormGroup = this.formBuilder.group({
			report_date: ["", Validators.compose([Validators.required])],
			ws_start: ["", Validators.compose([Validators.required])],
			ws_end: ["", Validators.compose([Validators.required])],
			bugzillaURL: ["", Validators.compose([Validators.required])],
			highlights: ["", Validators.compose([Validators.required])],
			codeReviews: ["", Validators.compose([Validators.required])],
			planForWeek: ["", Validators.compose([Validators.required])]
		});

		this.getDraftReport();
	}

	private getDraftReport() {
		if (this.wsbe.draftReport === undefined) {
			this.wsbe.draftPresent = false;
			this.wsbe.getDraftReport().subscribe((dftReport: any) => {
				console.log("Success response: draftReport: ", dftReport);
				if (dftReport.length > 0) {
					this.wsbe.draftReport = dftReport[0];
					this.updateDataInFormGroup(false);
					this.wsbe.draftPresent = true;
				}
			}, (error: any) => {
				console.log("Error response. error: ", error);
				this.clearData();
				this.errorDraft = true;
				this.errorDraftMsg = error.error.error;
			});
		}
		else {
			this.updateDataInFormGroup(false);
		}
	}

	private clearData() {
		this.dftUpdateSubmitErr = false;
		this.dftUpdateSubmitErrMsg = "";
		this.errorDraft = false;
		this.errorDraftMsg = "";
	}

	private updateDataInFormGroup(reset: boolean) {
		if (reset) {
			this.draftReportFormGroup.setValue({
				report_date: "",
				ws_start: "",
				ws_end: "",
				bugzillaURL: "",
				highlights: "",
				codeReviews: "",
				planForWeek: ""
			});
			return;
		}
		this.draftReportFormGroup.setValue({
			report_date: new Date(this.wsbe.draftReport.report_date).toISOString().substr(0, 10),
			ws_start: new Date(this.wsbe.draftReport.ws_start).toISOString().substr(0, 10),
			ws_end: new Date(this.wsbe.draftReport.ws_end).toISOString().substr(0, 10),
			bugzillaURL: this.wsbe.draftReport.bugzillaURL,
			highlights: this.wsbe.draftReport.highlights,
			codeReviews: this.wsbe.draftReport.codeReviews,
			planForWeek: this.wsbe.draftReport.planForWeek
		});
	}

	updateDraftReport() {
		let report = {
			report_date: this.draftReportFormGroup.controls.report_date.value,
			ws_start: this.draftReportFormGroup.controls.ws_start.value,
			ws_end: this.draftReportFormGroup.controls.ws_end.value,
			bugzillaURL: this.draftReportFormGroup.controls.bugzillaURL.value,
			highlights: this.draftReportFormGroup.controls.highlights.value,
			codeReviews: this.draftReportFormGroup.controls.codeReviews.value,
			planForWeek: this.draftReportFormGroup.controls.planForWeek.value
		};

		let observableObject = this.wsbe.updateDraftReport(report);
		observableObject.subscribe((response: any) => {
			console.log("Success response: ", response);
			this.wsbe.draftReport = response.updatedDraft;
			this.updateDataInFormGroup(false);
			this.enableEditDraft = false;
			this.clearData();
		}, (error: any) => {
			console.log("Error response: ", error);
			this.clearData();
			this.dftUpdateSubmitErr = true;
			this.dftUpdateSubmitErrMsg = error.error.error;
		});
	}

	submitFinalReport() {
		let observableObject = this.wsbe.submitReport();
		observableObject.subscribe((response: any) => {
			console.log("Success response: ", response);
			this.wsbe.draftReport = undefined;
			this.router.navigate(["/reports"]);
		}, (error: any) => {
			console.log("Error response: ", error);
			this.clearData();
			this.dftUpdateSubmitErr = true;
			this.dftUpdateSubmitErrMsg = error.error.error;
		});
	}

	deleteDraft() {
		if (this.wsbe.draftPresent && this.wsbe.draftReport._id !== undefined) {
			this.wsbe.deleteDraftReport().subscribe((response: any) => {
				console.log("Success response. response: ", response);
				$(this.delConfirmModal.nativeElement).modal("hide");
				this.clearData();
				this.wsbe.draftPresent = false;
				this.wsbe.draftReport = undefined;
				this.updateDataInFormGroup(true);
			}, (error: any) => {
				console.log("Error response. error: ", error);
				this.clearData();
				this.errorDraft = true;
				this.errorDraftMsg = error.error.error;
				$(this.delConfirmModal.nativeElement).modal("hide");
			})
		}
	}

	cancelEditDraft() {
		this.enableEditDraft = false;
		this.getDraftReport();
	}
}
