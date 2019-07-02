import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DefaultLayoutRoutingModule } from './default-layout-routing.module';
import { AngularMaterialModule } from '@shared/angular-material.module';
import { DefaultLayoutComponent } from './default-layout.component';

@NgModule({
  declarations: [
    DefaultLayoutComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    DefaultLayoutRoutingModule,
    RouterModule,
  ]
})
export class DefaultLayoutModule { }
