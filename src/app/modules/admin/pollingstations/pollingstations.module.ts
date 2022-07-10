import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertModule } from '@fuse/components/alert';
import { NgxMaskModule } from 'ngx-mask';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';

import { ListPollingStationsComponent } from 'app/modules/admin/pollingstations/listpollingstations.component';
import { DialogViewPollingStationDetailsComponent } from 'app/modules/admin/pollingstations/dialog-view-pollingstation-details/dialogviewpollingstationdetails.component';

const pollingStationsRoutes: Route[] = [
    {
        path     : '',
        component: ListPollingStationsComponent
    }
];

@NgModule({
    declarations: [
        ListPollingStationsComponent,
        DialogViewPollingStationDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(pollingStationsRoutes),
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatCardModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,

        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRadioModule,
        MatSelectModule,
        SharedModule,
        MatDialogModule,
        FuseAlertModule,
        NgxMaskModule.forRoot()
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
})

export class PollingStationsModule
{
}
