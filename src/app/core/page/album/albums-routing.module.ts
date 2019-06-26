import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumComponent } from '';
import { AlbumCreateComponent } from '@feature/albums/create/album-create.component';
import { AlbumShowComponent } from '@feature/albums/show/album-show.component';
import { AlbumEditComponent } from './edit/album-edit.component';

const routes: Routes = [
  { path: '', component: AlbumComponent },
  { path: 'create', component: AlbumCreateComponent },
  { path: 'myAlbum', component: AlbumShowComponent },
  { path: 'edit/:albumId', component: AlbumEditComponent },
  { path: ':albumId/article', loadChildren: '../article/articles.module#ArticlesModule', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule { }
