import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './core/page/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', loadChildren: '@layout/default/default.module#DefaultModule' },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
