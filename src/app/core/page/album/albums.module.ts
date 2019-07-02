import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AlbumComponent } from '@page/album/album.component';
import { AlbumShowComponent } from '@feature/album/show/album-show.component';
import { AlbumEditComponent } from '@feature/album/edit/album-edit.component';
import { AlbumCreateComponent } from '@feature/album/create/album-create.component';
import { ArticleCreateComponent } from '@feature/article/create/article-create.component';
import { AngularMaterialModule } from '@shared/angular-material.module';
import { AlbumsRoutingModule } from './albums-routing.module';


@NgModule({
  declarations: [
    AlbumComponent,
    AlbumCreateComponent,
    AlbumEditComponent,
    AlbumShowComponent,
    ArticleCreateComponent,
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
