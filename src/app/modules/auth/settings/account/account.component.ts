import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.accountForm = this._formBuilder.group({
            fullname: ['Team Shafqat Mehmood'],
            username: ['manager_na130'],
            cnic    : ['34501-4893144-1'],
            email   : ['bajwa345@gmail.com', Validators.email],
            mobile  : ['0300-7769960'],
            whatsapp: ['0300-7769960'],

            c_name   : ['شفقت محمود'],
            c_image   : ['shafqat-mehmood.jpg'],
            c_party  : ['PTI'],
            c_symbol : ['bat'],
            c_details  : ['امیدوار ایم این اے'],
            c_details2 : ['حلقہ این اے 130 لاہور'],
            c_constituency : ['NA-130 Lahore 8'],
            c_licensecode : ['447201']
        });
    }
}
