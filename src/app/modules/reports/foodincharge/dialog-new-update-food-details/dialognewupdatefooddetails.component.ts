import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsService } from './../../reports.service';

@Component({
    selector    : 'dialog-new-update-food-details',
    templateUrl : './dialognewupdatefooddetails.component.html',
    styleUrls   : []
})
export class DialogNewUpdateFoodDetailsComponent implements OnInit, OnDestroy {

    form: FormGroup;
    model: any;
    message: HTMLElement;
    ddPollingLocations: any[] = null;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any},
        private dialogRef: MatDialogRef<DialogNewUpdateFoodDetailsComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private reportsService: ReportsService
    ){
        this.model = data.rowData;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group(
          {
            pollingLocation: [''],
            requirement: ['0', Validators.compose([Validators.required, Validators.maxLength(4)])]
          }
        );

        this.populatePollingLocationDD();
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDialog(){
        this.dialogRef.close(true);
    }

    populatePollingLocationDD(){
        this._sharedService.getPollingLocationsDD(null, null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddPollingLocations = res.ddlist
            );
    }

    updateDetailsByPollingLocation(e: any){
        this.form.value.requirement.set = e.value;
    }

    showAlert(type: string, message: string): void
    {
        document.getElementById("div-message").innerHTML = '<div class="my-1 message-'+type+'">'+ message +'</div>';
    }

    onSubmit(){
        document.getElementById("form-container").style.cursor  = "wait";

        if(this.form.invalid){
            this.showAlert('error', 'Please provide proper Form values.');
            return;
        }

        const requestObject: any = {
            cnic: this.model.vtr_cnic,
            phonenumber1: this.form.value.mobileNumber1,
            phonenumber2: this.form.value.mobileNumber2
        };

        try {
            /*this.votersService.updateVoterDetails(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.type == "error") this.showAlert('error', res.message);
                else {
                    this.showAlert('success', res.message);
                    this.model.vtr_mobile = this.form.value.mobileNumber1;
                    this.model.vtr_mobile2 = this.form.value.mobileNumber2;
                    this.model.vtr_mobile3 = this.form.value.mobileNumber3;
                    this.model.vtr_whatsApp = this.form.value.whatsAppNumber;
                }
            });*/
        } catch (error) {
            this.showAlert('error', 'Something went wrong. Please try again');
        }

        document.getElementById("form-container").style.cursor  = "default";
    }
}
