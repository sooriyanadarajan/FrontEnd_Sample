import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { SecurityComponent } from '../pages/security/security.component';
import { MarketbotComponent } from '../pages/marketbot/marketbot.component';
import { RefferalsComponent } from '../pages/refferals/refferals.component';
import { FundprofitComponent } from './tradepair/tradepair.component';
import { NotificationsComponent } from '../pages/notifications/notifications.component';
import { CouponsComponent } from '../pages/coupons/coupons.component';
import { SubadminComponent } from './subadmin/subadmin.component';
import { AdminSettingComponent } from './admin-setting/admin-setting.component';
import { UserlayoutComponent } from '../pages/user/userlayout/userlayout.component';
import { HistoryComponent  } from '../pages/history/history.component'
import { ListComponent } from '../pages/list/list.component';
import { BotsignalComponent } from '../pages/botsignal/botsignal.component';
import { PaymentCoinComponent } from './payment-coin/payment-coin.component';

const routes: Routes = [
  {
    path:'',
    component:DashboardComponent
  },
  {
    path:'dashboard',
    component:DashboardComponent
  },
  {
    path:'security',
    component:SecurityComponent
  },
  {
    path:'marketplace',
    component:MarketbotComponent
  },
  {
    path:'refferals',
    component:RefferalsComponent
  },
  {
    path:'tradepair',
    component:FundprofitComponent
  },
  {
    path:'notifications',
    component:NotificationsComponent
  },
  {
    path:'coupons',
    component:CouponsComponent
  },
  {
    path:'subadmin',
    component:SubadminComponent
  },
  {
    path:'tradedetails',
    component:HistoryComponent
  },
  {
    path:'application-setting',
    component:AdminSettingComponent
  },
  {
    path:'userlist',
    component:ListComponent
  },
  {
    path:'botsignal',
    component:BotsignalComponent
  },
  {
    path:'paymentcoin',
    component:PaymentCoinComponent
  },
  {
    path: 'user/:id',
    // component:UserlayoutComponent,
    loadChildren: () =>
        import('./user/user.module').then(
            mod => mod.UserModule
        )
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
