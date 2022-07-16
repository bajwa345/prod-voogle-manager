import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppUsersService } from '../appusers.service';

@Component({
    selector    : 'dialog-delete-appuser',
    templateUrl : './dialogdeleteappuser.component.html',
    styleUrls   : []
})
export class DialogDeleteAppUserComponent implements OnInit, OnDestroy {

    form: FormGroup;
    model: any;
    e: HTMLElement;
    message: HTMLElement;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private dialogRef: MatDialogRef<DialogDeleteAppUserComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private appUsersService: AppUsersService
    ){
        this.model = data.rowData;
        this.e = data.eDom;
    }

    ngOnInit(): void {
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

            const requestObject: any = {
                userId: this.model.aur_id
            };

        try {
            this.appUsersService.deleteAppUser(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.type == "error") this.showAlert('error', res.message);
                else {
                    this.showAlert('success', res.message);
                }
            });
        } catch (error) {
            this.showAlert('error', 'Something went wrong. Please try again');
        }
        document.getElementById("form-container").style.cursor = "default";
    }
}
