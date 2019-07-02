import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@guard/auth.guard';
import { UserProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: ':userId',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class ProfileRoutingModule {}
