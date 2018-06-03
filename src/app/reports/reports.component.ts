import { Component, OnInit } from '@angular/core';
import { WsbeApiService } from '../wsbe-api.service';

@Component({
	selector: 'reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

	constructor(public wsbe: WsbeApiService) {
		if (this.wsbe.reports.length === 0) {
			this.wsbe.fetchReports();
		}
	}

}