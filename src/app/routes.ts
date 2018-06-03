import { NewReportComponent } from "./new-report/new-report.component";
import { ReportsComponent } from "./reports/reports.component";
import { DraftComponent } from "./draft/draft.component";

export let routes = [
	{
		path: "new_report",
		component: NewReportComponent
	},
	{
		path: "reports",
		component: ReportsComponent
	},
	{
		path: "draft",
		component: DraftComponent
	},
	{
		path: "",
		redirectTo: "reports",
		pathMatch: "full"
	}
];