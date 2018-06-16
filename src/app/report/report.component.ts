import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
	selector: 'report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.css']
})
export class ReportComponent {

	@Input()
	public reportDetails: any;

	@ViewChild("reportBody")
	public reportBody: ElementRef;

	public reportData: any;
	public reportHTML: string;

	ngOnInit() {
		// this data is specific for mailing format
		this.reportData = {
			wsrPeroid: "WSR for the period: " + this.reportDetails.ws_start + " - " + this.reportDetails.ws_end,
			wsrDate: this.reportDetails.report_date,
			line2: "Project: Horizon 7",
			highlights: this.reportDetails.highlights.split("<br>"),
			bugs: this.reportDetails.bugzillaURL,
			codeReviews: this.reportDetails.codeReviews.split("<br>"),
			planForWeek: this.reportDetails.planForWeek.split("<br>"),
		}
	}
}
