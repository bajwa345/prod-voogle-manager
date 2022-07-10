import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { ReportsService } from './../reports.service';

import { DialogNewUpdateTransportDetailsComponent } from "./dialog-new-update-transport-details/dialognewupdatetransportdetails.component";

@Component({
    selector     : 'transport-incharge-report',
    templateUrl  : './transportincharge.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportInchargeReportComponent
{
    data: ReturnDataModel;
    total_vehical_van: number;
    total_vehical_riksha: number;
    total_vehical_car: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(public _sharedService: SharedService,
        public reportsService: ReportsService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void
    {
        this.total_vehical_van = 0;
        this.total_vehical_riksha = 0;
        this.total_vehical_car = 0;

        this.reportsService.getTransportInchargeReportData()
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((ret: any) => {
                this.data = ret;
                this.data.items.forEach(item => {
                    this.total_vehical_van += item.vehical_van;
                    this.total_vehical_riksha += item.vehical_riksha;
                    this.total_vehical_car += item.vehical_car;
                });
            });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    newResultDetails(rowData: any,  e: HTMLElement){
        /*this._blockCodesService.getBlockCodeDetails(rowData.vtr_blockCode)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.item != null) {
                    this.dialog.open(DialogViewBlockCodeDetailsComponent,{
                        width:"40%", disableClose: false, autoFocus: true,
                        data: {
                          rowData: res.item
                        }
                    });
                }
            });*/
        const dialogRef = this.dialog.open(DialogNewUpdateTransportDetailsComponent,{
            width:"40%", disableClose: false, autoFocus: true,
            data: {
              rowData: rowData
            }
        });

        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
        });
    }
}
