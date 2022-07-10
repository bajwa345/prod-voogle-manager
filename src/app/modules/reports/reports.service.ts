import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SortDirection } from "@angular/material/sort";
import { ReturnDataModel, DdObjectDataModel } from 'app/shared/shared.service';

import { environment } from 'environments/environment';
const backEndUrl = environment.apiUrl;


@Injectable({ providedIn: 'root' })
export class ReportsService {

    constructor(private http: HttpClient) {}

    getFoodInchargeReportData(): Observable<ReturnDataModel> {
        return this.http.get<ReturnDataModel>(
        backEndUrl  + '/reports/report-foodincharge'
        );
    }

    getTransportInchargeReportData(): Observable<ReturnDataModel> {
        return this.http.get<ReturnDataModel>(
        backEndUrl  + '/reports/report-transportincharge'
        );
    }

    getVoterReachabilityReportData(): Observable<ReturnDataModel> {
        return this.http.get<ReturnDataModel>(
        backEndUrl  + '/reports/report-voterreachability'
        );
    }

    getWorkersCampaignSummaryReportData(): Observable<ReturnDataModel> {
        return this.http.get<ReturnDataModel>(
        backEndUrl  + '/reports/report-workerscampaignsummary'
        );
    }

    updateFoodInchargeDetails(requestObject: any): Observable<ReturnDataModel> {
        return this.http.post<ReturnDataModel>(
            backEndUrl + "/pollingstations/update-pollingstation-details", requestObject
        );
    }
}
