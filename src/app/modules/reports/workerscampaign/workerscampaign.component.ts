import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { ReportsService } from './../reports.service';

@Component({
    selector     : 'workers-campaign-report',
    templateUrl  : './workerscampaign.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkersCampaignReportComponent
{
    data: ReturnDataModel;
    total_did_searches: number;
    total_did_calls: number;
    total_view_locations: number;
    total_updated_phones: number;
    total_updated_locations: number;
    total_sent_sms: number;
    total_printed_slips: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(public _sharedService: SharedService,
        public reportsService: ReportsService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void
    {
        this.total_did_searches = 0;
        this.total_did_calls = 0;
        this.total_view_locations = 0;
        this.total_updated_phones = 0;
        this.total_updated_locations = 0;
        this.total_sent_sms = 0;
        this.total_printed_slips = 0;

        this.reportsService.getWorkersCampaignSummaryReportData()
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((ret: any) => {
                this.data = ret;
                this.data.items.forEach(item => {
                    this.total_did_searches += item.did_searches;
                    this.total_did_calls += item.did_calls;
                    this.total_view_locations += item.view_locations;
                    this.total_updated_phones += item.updated_phones;
                    this.total_updated_locations += item.updated_locations;
                    this.total_sent_sms += item.sent_sms;
                    this.total_printed_slips += item.printed_slips;
                });
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    printReport(){}
}
