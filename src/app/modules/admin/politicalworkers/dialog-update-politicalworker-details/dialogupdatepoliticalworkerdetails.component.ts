import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { PoliticalWorkersService } from './../politicalworkers.service';

@Component({
    selector    : 'dialog-update-politicalworker-details',
    templateUrl : './dialogupdatepoliticalworkerdetails.component.html',
    styleUrls   : []
})
export class DialogUpdatePoliticalWorkerDetailsComponent implements OnInit, OnDestroy {

    form: FormGroup;
    model: any;
    e: HTMLElement;
    message: HTMLElement;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private dialogRef: MatDialogRef<DialogUpdatePoliticalWorkerDetailsComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private politicalWorkersService: PoliticalWorkersService
    ){
        this.model = data.rowData;
        this.e = data.eDom;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group(
          {
            mobileNumber1: [this.model.vtr_mobile != 'null'? this.model.vtr_mobile: '', Validators.maxLength(11)],
            mobileNumber2: [this.model.vtr_mobile2 != 'null'? this.model.vtr_mobile2: '', Validators.maxLength(11)],
            mobileNumber3: [this.model.vtr_mobile3 != 'null'? this.model.vtr_mobile3: '', Validators.maxLength(11)],
            whatsAppNumber: [this.model.vtr_whatsApp != 'null'? this.model.vtr_whatsApp: '', Validators.maxLength(11)]
          }
        );
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDialog(){
        this.dialogRef.close(true);
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
            phonenumber2: this.form.value.mobileNumber2,
            phonenumber3: this.form.value.mobileNumber3,
            whatsappnumber: this.form.value.whatsAppNumber
        };

        try {
            /*this.appUsersService.updateAppUserDetails(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.type == "error") this.showAlert('error', res.message);
                else this.showAlert('success', res.message);
            });*/
        } catch (error) {
            this.showAlert('error', 'Something went wrong. Please try again');
        }

        document.getElementById("form-container").style.cursor  = "default";
    }
}
