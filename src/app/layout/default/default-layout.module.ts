import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultLayoutRoutingModule } from './default-layout-routing.module';
import { AngularMaterialModule } from '@shared/angular-material.module';
import { DefaultLayoutComponent } from './default-layout.component';
// import { HeaderComponent } from '@navigation/header/header.component';

@NgModule({
  declarations: [
    DefaultLayoutComponent,
    // HeaderComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    DefaultLayoutRoutingModule
  ]
})
export class DefaultLayoutModule { }
