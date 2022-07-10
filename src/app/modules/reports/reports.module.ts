import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

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

import { PollingSchemeReportComponent } from './pollingscheme/pollingscheme.component';
import { VoterReachabilityReportComponent } from './voterreachability/voterreachability.component';
import { TransportInchargeReportComponent } from './transportincharge/transportincharge.component';
import { DialogNewUpdateTransportDetailsComponent } from "./transportincharge/dialog-new-update-transport-details/dialognewupdatetransportdetails.component";
import { FoodInchargeReportComponent } from './foodincharge/foodincharge.component';
import { DialogNewUpdateFoodDetailsComponent } from "./foodincharge/dialog-new-update-food-details/dialognewupdatefooddetails.component";
import { WorkersCampaignReportComponent } from './workerscampaign/workerscampaign.component';

const reportsRoutes: Route[] = [
    {
        path     : 'polling-scheme-report',
        component: PollingSchemeReportComponent
    },
    {
        path     : 'transport-incharge-report',
        component: TransportInchargeReportComponent
    },
    {
        path     : 'food-incharge-report',
        component: FoodInchargeReportComponent
    },
    {
        path     : 'voter-reachability-report',
        component: VoterReachabilityReportComponent
    },
    {
        path     : 'workers-campaign-report',
        component: WorkersCampaignReportComponent
    }
];

@NgModule({
    declarations: [
        PollingSchemeReportComponent,
        VoterReachabilityReportComponent,
        TransportInchargeReportComponent,
        WorkersCampaignReportComponent,
        FoodInchargeReportComponent,
        DialogNewUpdateTransportDetailsComponent,
        DialogNewUpdateFoodDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(reportsRoutes),
        CommonModule,
        MatCardModule,
        MatProgressBarModule,
        FuseScrollbarModule,
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
        NgxExtendedPdfViewerModule,
        SharedModule
    ]
})
export class ReportsModule
{
}
