
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
// TODO: routing module profile
import { UserProfileComponent } from '@feature/profile/profile.component';
import { AngularMaterialModule } from '@shared/angular-material.module';
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
