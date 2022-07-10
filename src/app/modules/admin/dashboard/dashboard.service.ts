import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SortDirection } from "@angular/material/sort";
import { ReturnDataModel, DdObjectDataModel } from 'app/shared/shared.service';

import { environment } from 'environments/environment';
const backEndUrl = environment.apiUrl;


@Injectable({ providedIn: 'root' })
export class DashboardService {

    constructor(private http: HttpClient) {}

    getData(): Observable<any> {
        return this.http.get<any>(
        backEndUrl  + '/dashboard/data-dashboard'
        );
    }
}

