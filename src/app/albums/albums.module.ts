import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumCreateComponent } from './album-create/album-create.component';
import { AlbumShowComponent } from './album-show/album-show.component';
import { AlbumsRoutingModule } from './albums-routing.module';


@NgModule({
  declarations: [
    AlbumListComponent,
    AlbumCreateComponent,
    AlbumShowComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AlbumsRoutingModule,
    RouterModule
  ]
})
export class AlbumsModule { }
