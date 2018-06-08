import { NewReportComponent } from "./new-report/new-report.component";
import { ReportsComponent } from "./reports/reports.component";
import { DraftComponent } from "./draft/draft.component";
import { SingleReportComponent } from "./single-report/single-report.component";

export let routes = [
	{
		path: "reports",
		component: ReportsComponent
	},
	{
		path: "draft",
		component: DraftComponent
	},
	{
		path: "new_report",
		component: NewReportComponent
	},
	{
		path: "report/:id",
		component: SingleReportComponent
	},
	{
		path: "",
		redirectTo: "reports",
		pathMatch: "full"
	},
];