
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';

import { UserProfileComponent } from '@feature/profile/profile.component';
import { AngularMaterialModule } from '@shared/angular-material.module';
import { ProfileRoutingModule } from './profile-routing.module';



@NgModule({
  declarations: [
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MatCardModule,
    ProfileRoutingModule,
  ]
})
export class ProfileModule {}
