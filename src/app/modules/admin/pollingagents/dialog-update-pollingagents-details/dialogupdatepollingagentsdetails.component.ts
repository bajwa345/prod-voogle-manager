import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PollingAgentsService } from './../pollingagents.service';
import { VotersService } from './../../voters/voters.service';

@Component({
    selector    : 'dialog-update-pollingagents-details',
    templateUrl : './dialogupdatepollingagentsdetails.component.html',
    styleUrls   : []
})
export class DialogUpdatePollingAgentsDetailsComponent implements OnInit, OnDestroy {

    form: FormGroup;
    model: any;
    e: HTMLElement;
    message: HTMLElement;
    cnics: [];

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private dialogRef: MatDialogRef<DialogUpdatePollingAgentsDetailsComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private pollingAgentsService: PollingAgentsService,
        private _votersService: VotersService
    ){
        this.model = data.rowData;
        this.e = data.eDom;
        this.model.cnics = data.rowData.pag_cnics?.split(', ');
    }

    ngOnInit(): void {
        let icnics = this.model.cnics;
        this.form = this.formBuilder.group(
          {
            pa_cnic_0: [icnics && icnics.length > 0 && icnics[0] != null && icnics[0].trim() != 'null'? icnics[0].trim() : '', Validators.maxLength(13)],
            pa_cnic_1: [icnics && icnics.length > 1 && icnics[1] != null && icnics[1].trim() != 'null'? icnics[1].trim() : '', Validators.maxLength(13)],
            pa_cnic_2: [icnics && icnics.length > 2 && icnics[2] != null && icnics[2].trim() != 'null'? icnics[2].trim() : '', Validators.maxLength(13)]
          }
        );
        this.updateInfoByCnic();
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    updateInfoByCnic(){
        Object.keys(this.form.value).forEach((ikey) => {
            let icnic = this.form.value[ikey].trim();
            if(icnic && icnic.length == 13) {
                this._votersService.getVoterBasicDetails(icnic)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(res => {
                    if(res.item != null) {
                        document.getElementById("incharge_name_container_"+ ikey).style.display = 'inline-block';
                        if(res.item.vtr_nameUrdu != null)
                            document.getElementById("incharge_name_container_"+ ikey).innerHTML = '<p id="incharge_name_text" class="incharge_name_txt urdu text-lg font-bold">'+res.item.vtr_nameUrdu+'</p>';
                        else
                            document.getElementById("incharge_name_container_"+ ikey).innerHTML = '<img class="row_urdu_blob" onerror=\'this.style.display = "none"\' src="'+ 'data:image/png;base64,' + res.item.vtr_nameBlob+'" />';
                    }
                    else{
                        document.getElementById("incharge_name_container_"+ ikey).style.display = 'none';
                        document.getElementById("incharge_name_container_"+ ikey).innerHTML = '';
                    }
                });
            }
            else {
                document.getElementById("incharge_name_container_"+ ikey).style.display = 'none';
                document.getElementById("incharge_name_container_"+ ikey).innerHTML = '';
            }
        });
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
            plsId: this.model.pls_id,
            cnicp1: this.form.value.pa_cnic_0.length == 13? this.form.value.pa_cnic_0 : '',
            cnicp2: this.form.value.pa_cnic_1.length == 13? this.form.value.pa_cnic_1 : '',
            cnicp3: this.form.value.pa_cnic_2.length == 13? this.form.value.pa_cnic_2 : '',
            //cnicp4: this.model.pa2_cnic,
        };

        if ((requestObject.cnicp1 && requestObject.cnicp1.length == 13 && (requestObject.cnicp1 == requestObject.cnicp2 || requestObject.cnicp1 == requestObject.cnicp3)) ||
            (requestObject.cnicp2 && requestObject.cnicp2.length == 13 && (requestObject.cnicp2 == requestObject.cnicp1 || requestObject.cnicp2 == requestObject.cnicp3)))
        {
            this.showAlert('error', 'Duplicate entries found');
            document.getElementById("form-container").style.cursor  = "default";
            return;
        }

        try {
            this.pollingAgentsService.updatePollingAgents(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.type == "error") this.showAlert('error', res.message);
                else {
                    this.showAlert('success', res.message);
                    let _cnics = requestObject.cnicp1? ',' +requestObject.cnicp1 : '';
                    _cnics += requestObject.cnicp2? ',' +requestObject.cnicp2 : '';
                    _cnics += requestObject.cnicp3? ',' +requestObject.cnicp3 : '';

                    this.model.pag_cnics = _cnics ? _cnics.substring(1) : '';
                }
            });
        } catch (error) {
            this.showAlert('error', 'Something went wrong. Please try again');
        }

        document.getElementById("form-container").style.cursor  = "default";
    }
}
