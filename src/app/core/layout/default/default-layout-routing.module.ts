import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'albums', pathMath: 'full' },
  { path: 'auth', loadChildren: './shared/service/auth.module#AuthModule' },
  { path: 'profile', loadCHildren: '@feature/profile/profile.module#ProfileModule', canActivate: [AuthGuard] },
  { path: 'albums', loadChildren: '@page/albums.module#AlbumsModule', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
