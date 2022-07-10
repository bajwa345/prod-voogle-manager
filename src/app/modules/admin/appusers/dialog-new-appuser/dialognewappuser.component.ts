import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppUsersService } from './../appusers.service';

@Component({
    selector    : 'dialog-new-appuser',
    templateUrl : './dialognewappuser.component.html',
    styleUrls   : []
})
export class DialogNewAppUserComponent implements OnInit, OnDestroy {

    form: FormGroup;
    model: any;
    message: HTMLElement;

    ddPollingLocations: any[] = null;
    ddElectoralAreas: any[] = null;
    accesslevelValue: number;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(private dialogRef: MatDialogRef<DialogNewAppUserComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private appUsersService: AppUsersService
    ){
        this.model = null;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            userName: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
            cnicNumber: ['', Validators.compose([Validators.required, Validators.minLength(13), Validators.maxLength(13)])],
            fullName: ['', Validators.compose([Validators.required, Validators.maxLength(32)])],
            accessLevel: ['1'],
            pollingLocation: [''],
            electoralArea: [''],
            password: ['1234', Validators.compose([Validators.required, Validators.maxLength(8)])],
            whatsAppNumber: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11)])],
        });

        this.populatePollingLocationDD();
        this.populateElectoralAreasDD();
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

    populateElectoralAreasDD(){
        this._sharedService.getElectoralAreasDD(null, null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddElectoralAreas = res.ddlist
            );
    }

    changeViewForAccesslevel(e: any){
        this.accesslevelValue = e.value;
    }

    showAlert(type: string, message: string): void
    {
        document.getElementById("div-message").innerHTML = '<div class="my-1 message-'+type+'">'+ message +'</div>';
    }

    onSubmit(){
        document.getElementById("form-container").style.cursor  = "wait";

        if(this.form.invalid){
            this.showAlert('error', 'Please provide proper Form values');
        }
        else if(this.form.value.accessLevel == 3 && !this.form.value.pollingLocation){
            this.showAlert('error', 'Please select Polling Location');
        }
        else if(this.form.value.accessLevel == 2 && !this.form.value.electoralArea){
            this.showAlert('error', 'Please select Electoral Area');
        }
        else {
            const requestObject: any = {
                userName: this.form.value.userName,
                cnicNumber: this.form.value.cnicNumber,
                fullName: this.form.value.fullName,
                accesslevel: this.form.value.accessLevel,
                plcId: this.form.value.accessLevel == 3 ? this.form.value.pollingLocation : '',
                elaId: this.form.value.accessLevel == 2 ? this.form.value.electoralArea : '',
                password: this.form.value.password,
                whatsAppNumber: this.form.value.whatsAppNumber
            };

            try {
                this.appUsersService.newAppUser(requestObject)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(res => {
                    if(res.type == "error") this.showAlert('error', res.message);
                    else this.showAlert('success', res.message);
                });
            } catch (error) {
                this.showAlert('error', 'Something went wrong. Please try again');
            }
        }

        document.getElementById("form-container").style.cursor  = "default";
    }
}
