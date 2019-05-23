import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumListComponent } from 'src/app/albums/album-list/album-list.component';
import { AlbumCreateComponent } from 'src/app/albums/album-create/album-create.component';
import { AlbumShowComponent } from 'src/app/albums/album-show/album-show.component';

const routes: Routes = [
  { path: '', component: AlbumListComponent },
  { path: 'create', component: AlbumCreateComponent },
  { path: 'myAlbum', component: AlbumShowComponent },
  { path: 'edit/:albumId', component: AlbumCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule { }
