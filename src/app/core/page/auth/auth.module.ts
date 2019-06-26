import { NgModule } from '@angular/core';
import { LoginComponent } from '@feature/auth/login/login.component';
import { SignupComponent } from '@feature/auth/signup/signup.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '@shared/angular-material.module';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
