import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultLayoutRoutingModule } from './default-layout-routing.module';
import { DefaultLayoutComponent } from './default-layout.component';

@NgModule({
  declarations: [DefaultLayoutComponent],
  imports: [
    CommonModule,
    DefaultLayoutRoutingModule
  ]
})
export class DefaultLayoutModule { }
