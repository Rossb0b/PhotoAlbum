import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumCreateComponent } from './album-create/album-create.component';
import { AlbumShowComponent } from './album-show/album-show.component';
import { AlbumsRoutingModule } from './albums-routing.module';
import { AlbumEditComponent } from './album-edit/album-edit.component';


@NgModule({
  declarations: [
    AlbumListComponent,
    AlbumCreateComponent,
    AlbumEditComponent,
    AlbumShowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AlbumsRoutingModule,
    RouterModule
  ]
})
export class AlbumsModule { }
