import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '@shared/angular-material.module';
import { AlbumComponent } from '@page/album/album.component';
import { AlbumCreateComponent } from '@feature/album/create/album-create.component';
import { AlbumShowComponent } from '@feature/album/show/album-show.component';
import { AlbumsRoutingModule } from './albums-routing.module';
import { AlbumEditComponent } from '@feature/album/edit/album-edit.component';


@NgModule({
  declarations: [
    AlbumComponent,
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
