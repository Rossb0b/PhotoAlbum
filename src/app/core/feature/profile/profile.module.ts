
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { UserProfileComponent } from '../core/page/user-profile/user-profile.component';
import { AngularMaterialModule } from '../core/shared/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MatCardModule,
    RouterModule
  ]
})
export class ProfileModule {}
