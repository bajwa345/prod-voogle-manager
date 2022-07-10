import { Component,Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { VotersService } from './../../voters/voters.service';

@Component({
    selector    : 'dialog-view-blockcode-details',
    templateUrl : './dialogviewblockcodedetails.component.html',
    styleUrls   : []
})
export class DialogViewBlockCodeDetailsComponent {

    model: any = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private _votersService: VotersService,
        public dialogRef: MatDialogRef<DialogViewBlockCodeDetailsComponent>
    ){
        this.model = data.rowData;
    }

    closeDialog(){
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
    }

    DownloadVoterParchi(blc_code: number){
        const requestObject: any = {
            iblockcode: blc_code
        };

        try {
            this._votersService.downloadVoterParchi(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                var blob = new Blob([data], {type: 'application/pdf'});
                var downloadURL = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = "voterslip_"+requestObject.iblockcode.trim()+".pdf";
                link.click();
              });
        } catch (error) {
            alert('Something went wrong. Please try again');
        }
    }

    DownloadVoterList(blc_code: number){
        alert("voter list");
    }
}
