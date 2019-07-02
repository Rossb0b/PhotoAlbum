import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@guard/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: '@page/auth/auth.module#AuthModule'
  },
  {
    path: '',
    redirectTo: 'albums',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: '@feature/profile/profile.module#ProfileModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'albums',
    loadChildren: '@page/album/albums.module#AlbumsModule',
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class DefaultLayoutRoutingModule { }
