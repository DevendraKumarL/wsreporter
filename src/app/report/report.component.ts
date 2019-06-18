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
			project: "Project: " + this.reportDetails.project,
			highlights: this.getListOfItems(this.reportDetails.highlights),
			bugs: this.getListOfItems(this.reportDetails.bugzillaURL),
			codeReviews: this.getListOfItems(this.reportDetails.codeReviews),
			planForWeek: this.getListOfItems(this.reportDetails.planForWeek),
		}
		console.log("report data: ", this.reportData);
	}

	getListOfItems(rawData) {
		let dataItems = rawData.split("<br>");
		let items = [];
		dataItems.forEach(element => {
			items.push(this.linkifyText(element));
		});
		return items;
	}

	linkifyText(textContent) {
		let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		return textContent.replace(urlRegex, function(url){
			return '<a href="' + url + '">' + url + '</a>';
		});
	}
}
