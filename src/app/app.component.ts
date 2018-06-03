import { Component } from '@angular/core';
import { WsbeApiService } from './wsbe-api.service';

@Component({
	selector: 'app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	constructor(public wsbe: WsbeApiService) {}

}
