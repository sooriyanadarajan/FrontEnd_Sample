import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from "../shared/shared.module";
import { NgZorroAntdModule } from '../ng-zorro-antd.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ClipboardModule } from 'ngx-clipboard';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    SharedModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule,
    NgxQRCodeModule,
    ClipboardModule,
    ChartsModule
  ],
  exports: [
    NgZorroAntdModule,
  ]

})
export class ComponentsModule { }
