import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumCreateComponent } from '@feature/album/create/album-create.component';
import { AlbumShowComponent } from '@feature/album/show/album-show.component';
import { AlbumEditComponent } from '@feature/album/edit/album-edit.component';
import { AlbumComponent } from './album.component';
import { AuthGuard } from '@guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AlbumComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    component: AlbumCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':albumId',
    component: AlbumShowComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:albumId',
    component: AlbumEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':albumId/article',
    loadChildren: '../article/articles.module#ArticlesModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AlbumsRoutingModule {}
