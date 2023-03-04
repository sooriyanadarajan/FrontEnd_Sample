import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BalanceComponent } from './balance/balance.component';
import {SmarttradeComponent  } from './smarttrade/smarttrade.component';
import { HistoryComponent } from './history/history.component';
import { FutureComponent } from './future/future.component';
import { NotificationComponent } from './notification//notification.component'
import { BotComponent } from './bot/bot.component';
import { SettingsComponent } from './settings/settings.component'


const routes: Routes = [
  {
    path:'dashboard',
    component:DashboardComponent
  },
  {
    path:'wallet',
    component:BalanceComponent
  },
  {
    path:'smarttrade',
    component:SmarttradeComponent
  },
  {
    path:'history',
    component:HistoryComponent
  },
  {
    path:'future',
    component:FutureComponent
  },
  {
    path:'notification',
    component:NotificationComponent
  },
  {
    path:'bot',
    component:BotComponent
  },
  {
    path:'settings',
    component:SettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
