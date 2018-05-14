import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { WsbeApiService } from '../wsbe-api.service';

@Component({
  selector: 'draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.css']
})
export class DraftComponent {

  public draftReportFormGroup : FormGroup;

  public enableEditDraft : boolean = false;

  constructor(public formBuilder : FormBuilder,
    public wsbe : WsbeApiService, public router : Router) {
      this.draftReportFormGroup = this.formBuilder.group({
        report_date: [],
        ws_start: [],
        ws_end: [],
        bugzillaURL: [],
        highlights: [],
        codeReviews: [],
        planForWeek: []
      });

      let observableObject = this.wsbe.getDraftReport();
      observableObject.subscribe((report : any) => {
        this.wsbe.draftReport = report[0];
        console.log("Draft report: ", this.wsbe.draftReport);
        this.updateDataInFormGroup(this.wsbe.draftReport);
      });
  }

  private updateDataInFormGroup(draft) {
    this.draftReportFormGroup.setValue({
      report_date: new Date(draft.report_date).toISOString().substr(0, 10),
      ws_start: new Date(draft.ws_start).toISOString().substr(0, 10),
      ws_end: new Date(draft.ws_end).toISOString().substr(0, 10),
      bugzillaURL: draft.bugzillaURL,
      highlights: draft.highlights,
      codeReviews: draft.codeReviews,
      planForWeek: draft.planForWeek
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
    observableObject.subscribe((response : any) => {
      console.log("Success response: ", response);
      this.wsbe.draftReport = response.updatedDraft;
      this.updateDataInFormGroup(this.wsbe.draftReport);
      this.enableEditDraft = false;
    }, (error : any ) => {
      console.log("Error response: ", error);
    })
  }

  submitFinalReport() {

  }

}
