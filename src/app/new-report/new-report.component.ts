import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WsbeApiService } from '../wsbe-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.css']
})
export class NewReportComponent {

  public reportFormGroup : FormGroup;

  public formError : boolean = false;
  public formErrorMessage : string ;

  constructor(public formBuilder : FormBuilder,
    public wsbe : WsbeApiService, public router : Router) {
    this.reportFormGroup = this.formBuilder.group({
      report_date: [],
      ws_start: [],
      ws_end: [],
      bugzillaURL: [],
      highlights: [],
      codeReviews: [],
      planForWeek: []
    });
  }

  submitDraftReport() {
    let report = {
      report_date: this.reportFormGroup.controls.report_date.value,
      ws_start: this.reportFormGroup.controls.ws_start.value,
      ws_end: this.reportFormGroup.controls.ws_end.value,
      bugzillaURL: this.reportFormGroup.controls.bugzillaURL.value,
      highlights: this.reportFormGroup.controls.highlights.value,
      codeReviews: this.reportFormGroup.controls.codeReviews.value,
      planForWeek: this.reportFormGroup.controls.planForWeek.value
    };

    let observableObject = this.wsbe.newDraftReport(report);
    observableObject.subscribe((response : any) => {
      console.log("Success response: ", response);
      this.router.navigate(['draft']);
    }, (error : any ) => {
      console.log("Error response: ", error);
      this.formError = true;
      this.formErrorMessage = error.error.error;
    })
  }

}
