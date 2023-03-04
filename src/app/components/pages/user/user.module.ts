import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserlayoutComponent } from './userlayout/userlayout.component';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BalanceComponent } from './balance/balance.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SmarttradeComponent } from './smarttrade/smarttrade.component';
import { HistoryComponent } from './history/history.component';
import { FutureComponent } from './future/future.component';

import { RouterModule } from '@angular/router';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ClipboardModule } from 'ngx-clipboard';
import { HttpClientModule} from '@angular/common/http';
import { NotificationComponent } from './notification/notification.component';
import { BotComponent } from './bot/bot.component';
import { SettingsComponent } from './settings/settings.component';
import { DateAgoPipe } from '../../../helpers/dateAgo.pipe';
import { ChartsModule } from 'ng2-charts';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TwoDigitDecimaNumberDirective } from '../../../helpers/decimal.directive';
@NgModule({
  declarations: [TwoDigitDecimaNumberDirective,DateAgoPipe, UserlayoutComponent, DashboardComponent, BalanceComponent, SmarttradeComponent, HistoryComponent, FutureComponent, NotificationComponent, BotComponent, SettingsComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxQRCodeModule,
    ClipboardModule,
    HttpClientModule,
    ChartsModule,
    CarouselModule
  ]
})
export class UserModule { }
