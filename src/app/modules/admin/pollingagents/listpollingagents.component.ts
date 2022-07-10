import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { PollingAgentsService } from './pollingagents.service';
import { PollingStationsService } from 'app/modules/admin/pollingstations/pollingstations.service';
import { DialogViewPollingAgentsDetailsComponent } from './dialog-view-pollingagents-details/dialogviewpollingagentsdetails.component';
import { DialogViewPollingStationDetailsComponent } from 'app/modules/admin/pollingstations/dialog-view-pollingstation-details/dialogviewpollingstationdetails.component';
import { VotersService } from './../voters/voters.service';
import { DialogViewBasicVoterDetailsComponent } from 'app/modules/admin/voters/dialog-view-basic-voter-details/dialogviewbasicvoterdetails.component';
import { DialogUpdatePollingAgentsDetailsComponent } from './dialog-update-pollingagents-details/dialogupdatepollingagentsdetails.component';

@Component({
    selector       : 'list-pollingagents',
    templateUrl    : './listpollingagents.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPollingAgentsComponent implements OnInit, AfterViewInit, OnDestroy {

    paConstituency = new FormControl(null, null);
    pollingLocation = new FormControl(null, null);
    agentCnicNumber = new FormControl(null, null);
    searchType = new FormControl(null, null);

    displayedColumns: string[] = ['rownumber', 'pls_name', 'pls_votersCount', 'pls_boothsCount', 'pls_type', 'pag_cnics', 'actions'];
    //term$ = new BehaviorSubject<string>('');
    resultsLength = 0;
    isLoading = false;

    ddPaConstituencies: any[] = null;
    ddPollingLocations: any[] = null;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();
    public dataSource = new MatTableDataSource<any>();

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private _pollingAgentsService: PollingAgentsService,
        private _pollingStationsService: PollingStationsService,
        private _votersService: VotersService,
        protected _sharedService: SharedService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void
    {
        this.populatePaConstituenciesDD();
        this.populatePollingLocationsDD();
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

    search(){
        this.populateListData();
    }

    clear(){
        this.paConstituency.setValue('');
        this.pollingLocation.setValue('');
        this.agentCnicNumber = new FormControl(null, null);
        this.searchType.setValue('');

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
                iagentcnicnumber: this.agentCnicNumber.value,
                isearchtype: this.searchType.value,

                fromRow: (this.paginator.pageIndex * 15) + 1,
                toRow: (this.paginator.pageIndex + 1) * 15,
                sortColumn: this.sort.active,
                sortOrder: this.sort.direction,
                search: ''//(searchTerm && typeof searchTerm == 'string') ? searchTerm.toString() : ''
            }
            return this._pollingAgentsService!.getListData(queryData)
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
        this._pollingAgentsService.getPollingAgentsList(rowData.pls_id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                res.pls_name = rowData.pls_name;
                res.pls_votersCount = rowData.pls_votersCount;
                res.pls_boothsCount = rowData.pls_boothsCount;
                res.pa_name = rowData.pa_name;
                res.pls_inchargeCnic = rowData.pls_inchargeCnic;
                res.pls_inchargeName = rowData.pls_inchargeName;
                this.dialog.open(DialogViewPollingAgentsDetailsComponent,{
                    width: "40%", disableClose: false, autoFocus: true,
                    data: {
                      rowData: res
                    }
                });
            });
    }

    viewPollingStationDetails(rowData: any,  e: HTMLElement){
        this._pollingStationsService.getPollingStationDetails(rowData.pls_id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.item != null) {
                    this.dialog.open(DialogViewPollingStationDetailsComponent,{
                        width:"40%", disableClose: false, autoFocus: true,
                        data: {
                          rowData: res.item
                        }
                    });
                }
            });
    }

    viewPollingAgentBasicDetails(cnic: any,  e: HTMLElement){
        this._votersService.getVoterBasicDetails(cnic)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.item != null) {
                    this.dialog.open(DialogViewBasicVoterDetailsComponent,{
                        width:"40%", disableClose: false, autoFocus: true,
                        data: {
                          rowData: res.item
                        }
                    });
                }
            });
    }

    updateDetails(rowData: any,  e: HTMLElement){
        const dialogRef = this.dialog.open(DialogUpdatePollingAgentsDetailsComponent,{
          width:"40%", disableClose: false, autoFocus: true,
          data: {
            rowData: rowData,
            eDom: e
          }
        });

        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
        });
    }
}
