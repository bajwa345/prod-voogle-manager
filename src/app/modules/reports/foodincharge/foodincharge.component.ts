import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { ReportsService } from './../reports.service';

import { DialogNewUpdateFoodDetailsComponent } from "./dialog-new-update-food-details/dialognewupdatefooddetails.component";

@Component({
    selector     : 'food-incharge-report',
    templateUrl  : './foodincharge.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodInchargeReportComponent
{
    data: ReturnDataModel;
    total_food_required: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(public _sharedService: SharedService,
        private reportsService: ReportsService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void
    {
        this.total_food_required = 0;

        this.reportsService.getFoodInchargeReportData()
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((ret: any) => {
                this.data = ret;
                this.data.items.forEach(item => {
                    this.total_food_required += item.food_required;
                });
            });
    }

    ngOnDestroy(): void
    {
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
        const dialogRef = this.dialog.open(DialogNewUpdateFoodDetailsComponent,{
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
