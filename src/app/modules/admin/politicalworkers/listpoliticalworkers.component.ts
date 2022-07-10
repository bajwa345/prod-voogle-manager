import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subject, BehaviorSubject, combineLatest, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { PoliticalWorkersService } from './politicalworkers.service';
//import { DialogViewPoliticalWorkerDetailsComponent } from 'app/modules/admin/appusers/dialog-view-appuser-details/dialogviewappuserdetails.component';
//import { DialogUpdatePoliticalWorkerDetailsComponent } from 'app/modules/admin/appusers/dialog-update-appuser-details/dialogupdateappuserdetails.component';


@Component({
    selector       : 'list-politicalworkers',
    templateUrl    : './listpoliticalworkers.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPoliticalWorkersComponent implements OnInit, AfterViewInit, OnDestroy {

    workers: any = [
        {
            id    : 1,
            avatar: 'male-13.jpg',
            name  : 'Rana Shaharyar Ahmed',
            fatherhusband  : 'Rana Nafees',
            address: 'Mohallah Rehmanura, Street #4, Zafarwal road Narowal',
            cnic  : '34501-1375962-3',
            mobile   : '0300-5566443',
            gender : 'Male',
            age : 32,
            name_urdu  : 'چوہدری احسن اقبال',
            poling_station : 'گورنمنٹ گرلز پرائمری سکول قاضی والا قریشیاں نارووال',
            electoral_area : 'UC 112',
            pa_constituency : 'PP-135',
            member_since : '2009-03-30',
            interested_in : 'Polling Agent',
            status : 'available'
        },
        {
            id    : 23,
            avatar: 'female-20.jpg',
            name  : 'Sughra Bibi',
            fatherhusband  : 'Momin Khan',
            address: 'Mohallah Rehmanura, Street #4, Zafarwal road Narowal',
            cnic  : '34501-1375962-3',
            mobile   : '0300-5566443',
            gender : 'female',
            age : 32,
            name_urdu  : 'چوہدری احسن اقبال',
            poling_station : 'گورنمنٹ گرلز پرائمری سکول قاضی والا قریشیاں نارووال',
            electoral_area : 'UC 112',
            pa_constituency : '	PP-135',
            member_since : '2009-03-30',
            interested_in : 'Polling Agent',
            status : 'available'
        },
        {
            id    : 43,
            avatar: 'male-14.jpg',
            name  : 'Zubair Ahmed Toor',
            fatherhusband  : 'Shaukat Toor',
            address: 'Mohallah Rehmanura, Street #4, Zafarwal road Narowal',
            cnic  : '34501-1375962-3',
            mobile   : '0300-5566443',
            gender : 'Male',
            age : 32,
            name_urdu  : 'چوہدری احسن اقبال',
            poling_station : 'گورنمنٹ گرلز پرائمری سکول قاضی والا قریشیاں نارووال',
            electoral_area : 'UC 112',
            pa_constituency : '	PP-135',
            member_since : '2009-03-30',
            interested_in : 'Polling Agent',
            status : 'available'
        },
        {
            id    : 44,
            avatar: 'male-01.jpg',
            name  : 'Muhammad Amin Khan',
            fatherhusband  : 'Subhan Khan',
            address: 'Mohallah Rehmanura, Street #4, Zafarwal road Narowal',
            cnic  : '34501-1375962-3',
            mobile   : '0300-5566443',
            gender : 'Male',
            age : 32,
            name_urdu  : 'چوہدری احسن اقبال',
            poling_station : 'گورنمنٹ گرلز پرائمری سکول قاضی والا قریشیاں نارووال',
            electoral_area : 'UC 112',
            pa_constituency : '	PP-135',
            member_since : '2009-03-30',
            interested_in : 'Polling Agent',
            status : 'available'
        },
        {
            id    : 99,
            avatar: 'male-16.jpg',
            name  : 'Taimoor Jutt',
            fatherhusband  : 'Sanaullah Jutt',
            address: 'Mohallah Rehmanura, Street #4, Zafarwal road Narowal',
            cnic  : '34501-1375962-3',
            mobile   : '0300-5566443',
            gender : 'Male',
            age : 65,
            name_urdu  : 'چوہدری احسن اقبال',
            poling_station : 'گورنمنٹ گرلز پرائمری سکول قاضی والا قریشیاں نارووال',
            electoral_area : 'UC 112',
            pa_constituency : '	PP-135',
            member_since : '2009-03-30',
            interested_in : 'Polling Agent',
            status : 'available'
        },
        {
            id    : 111,
            avatar: 'male-19.jpg',
            name  : 'Salam Saleem',
            fatherhusband  : 'Saleem Gujjar',
            address: 'Mohallah Rehmanura, Street #4, Zafarwal road Narowal',
            cnic  : '34501-1375962-3',
            mobile   : '0300-5566443',
            gender : 'Male',
            age : 32,
            name_urdu  : 'چوہدری احسن اقبال',
            poling_station : 'گورنمنٹ گرلز پرائمری سکول قاضی والا قریشیاں نارووال',
            electoral_area : 'UC 112',
            pa_constituency : '	PP-135',
            member_since : '2009-03-30',
            interested_in : 'Polling Agent',
            status : 'available'
        },
        {
            id    : 140,
            avatar: 'male-02.jpg',
            name  : 'Abubakar Butt',
            fatherhusband  : 'Karamat Ali Butt',
            address: 'Mohallah Rehmanura, Street #4, Zafarwal road Narowal',
            cnic   : '34501-1375962-3',
            mobile : '0300-5566443',
            gender : 'Male',
            age : 32,
            name_urdu  : 'چوہدری احسن اقبال',
            poling_station : 'گورنمنٹ گرلز پرائمری سکول قاضی والا قریشیاں نارووال',
            electoral_area : 'UC 112',
            pa_constituency: 'PP-135',
            member_since   : '2009-03-30',
            interested_in  : 'Polling Agent',
            status : 'unavailable'
        },
        {
            id    : 199,
            avatar: 'male-03.jpg',
            name  : 'Burhan Ali',
            fatherhusband  : 'Aman Ullah Babar',
            address: 'Mohallah Rehmanura, Street #4, Zafarwal road Narowal',
            cnic   : '34501-1375962-3',
            mobile : '0300-5566443',
            gender : 'Male',
            age : 32,
            name_urdu  : 'چوہدری احسن اقبال',
            poling_station : 'گورنمنٹ گرلز پرائمری سکول قاضی والا قریشیاں نارووال',
            electoral_area : 'UC 112',
            pa_constituency: '	PP-135',
            member_since   : '2009-03-30',
            interested_in  : 'Polling Agent',
            status : 'assigned'
        },
        {
            id    : 100,
            avatar: 'male-04.jpg',
            name  : 'Zeeshan Javed',
            fatherhusband : 'Mian Javed',
            address : 'Mohallah Rehmanura, Street #4, Zafarwal road Narowal',
            cnic    : '34501-1375962-3',
            mobile  : '0300-5566443',
            gender  : 'Male',
            age     : 32,
            name_urdu  : 'چوہدری احسن اقبال',
            poling_station : 'گورنمنٹ گرلز پرائمری سکول قاضی والا قریشیاں نارووال',
            electoral_area : 'UC 112',
            pa_constituency: 'PP-135',
            member_since   : '2009-03-30',
            interested_in  : 'Polling Agent',
            status : 'assigned'
        }
    ];

    paConstituency = new FormControl(null, null);
    pollingLocation = new FormControl(null, null);
    electoralArea = new FormControl(null, null);
    cnicNumber = new FormControl(null, null);
    mobileNumber = new FormControl(null, null);
    accessLevel = new FormControl(null, null);
    userStatus = new FormControl(null, null);

    displayedColumns: string[] = ['rownumber', 'aur_userName', 'aur_fullName', 'uc_name', 'aur_accesslevel', 'aur_isActive', 'actions'];
    //term$ = new BehaviorSubject<string>('');
    resultsLength = 9;
    isLoading = false;

    ddPaConstituencies: any[] = null;
    ddPollingLocations: any[] = null;
    ddElectoralAreas: any[] = null;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();
    public dataSource = new MatTableDataSource<any>();

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private politicalWorkersService: PoliticalWorkersService,
        private _sharedService: SharedService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void
    {
        this.populatePaConstituenciesDD();
        this.populatePollingLocationsDD();
        this.populateElectoralAreasDD();
    }

    ngAfterViewInit(): void
    {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.populateListData();
        this.cdRef.detectChanges();
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    populatePaConstituenciesDD(){
        this._sharedService.getPaConstituenciesDD()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddPaConstituencies = res.ddlist
            );
    }

    populatePollingLocationsDD(){
        this._sharedService.getPollingLocationsDD(this.paConstituency.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                this.ddPollingLocations = res.ddlist,
                this.pollingLocation.setValue('');
            });
    }

    populateElectoralAreasDD(){
        this._sharedService.getElectoralAreasDD(null, null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddElectoralAreas = res.ddlist
            );
    }

    search(){
        this.populateListData();
    }

    clear(){
        this.paConstituency.setValue('');
        this.pollingLocation.setValue('');
        this.electoralArea.setValue('');
        this.cnicNumber = new FormControl(null, null);
        this.mobileNumber = new FormControl(null, null);
        this.accessLevel.setValue('');
        this.userStatus.setValue('');

        this.populateListData();
    }

    populateListData(){
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap((searchTerm) => {
            this.isLoading = true;

            const queryData: any = {
                ipaconstituency: this.paConstituency.value,
                ipollinglocationid: this.pollingLocation.value,
                ielectoralareaid: this.electoralArea.value,
                icnic: this.cnicNumber.value,
                imobile: this.mobileNumber.value,
                iaccesslevel: this.accessLevel.value,
                iuserstatus: this.userStatus.value,

                fromRow: (this.paginator.pageIndex * 25) + 1,
                toRow: (this.paginator.pageIndex + 1) * 25,
                sortColumn: this.sort.active,
                sortOrder: this.sort.direction,
                search: ''//(searchTerm && typeof searchTerm == 'string') ? searchTerm.toString() : ''
            }
            return this.politicalWorkersService!.getListData(queryData)
              .pipe(catchError(() => of(null)));
          }),
          map(data => {
            if (data === null) {
                this.isLoading = false;
                this.resultsLength = 0;
                this.dataSource.data = [];
                return data;
            }

            this.isLoading = false;
            this.resultsLength = data.rows_count;
            this.dataSource.data = data.items;
            return data;
          })
        ).subscribe(data => {
            this._unsubscribeAll.next(data);
        });
    }

    viewDetails(rowData: any,  e: HTMLElement){
        /*this.dialog.open(DialogViewAppUserDetailsComponent,{
          width:"40%", disableClose: false, autoFocus: true,
          data: {
            rowData: rowData,
            eDom: e
          }
        });*/
      }

    updateDetails(rowData: any,  e: HTMLElement){
        /*const dialogRef = this.dialog.open(DialogUpdateAppUserDetailsComponent,{
          width:"40%", disableClose: false, autoFocus: true,
          data: {
            rowData: rowData,
            eDom: e
          }
        });

        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
        });*/
      }
}
