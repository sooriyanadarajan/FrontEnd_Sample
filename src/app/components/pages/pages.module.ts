import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { SecurityComponent } from './security/security.component';
import { MarketbotComponent } from './marketbot/marketbot.component';
import { RefferalsComponent } from './refferals/refferals.component';
import { FundprofitComponent } from './tradepair/tradepair.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CouponsComponent } from './coupons/coupons.component';
import { SubadminComponent } from './subadmin/subadmin.component';
import { AdminSettingComponent } from './admin-setting/admin-setting.component';

import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { MinusPipe } from '../../helpers/minus.pipe';
import { HistoryComponent } from './history/history.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ListComponent } from './list/list.component';
import { ChartsModule } from 'ng2-charts';
import { BotsignalComponent } from './botsignal/botsignal.component';
import { PaymentCoinComponent } from './payment-coin/payment-coin.component';
import { CodeInputModule } from 'angular-code-input';
@NgModule({
  declarations: [
    DashboardComponent, 
    SecurityComponent,
    MarketbotComponent,
    RefferalsComponent,
    FundprofitComponent,
    NotificationsComponent,
    CouponsComponent,
    SubadminComponent,
    AdminSettingComponent,
    MinusPipe,
    HistoryComponent,
    ListComponent,
    BotsignalComponent,
    PaymentCoinComponent
  ],

  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    HighchartsChartModule,
    ChartsModule,
    CodeInputModule
  ],

  exports: [
  ]
})
export class PagesModule { }
